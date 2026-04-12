# -*- coding: utf-8 -*-
"""
Bagging (Bootstrap + vote) trên cây quyết định tự code — Wisconsin Breast Cancer (UCI).

Cấu trúc file (đọc theo thứ tự):
  § Cấu hình (ExperimentConfig)
  § Dữ liệu: tải, chia train/test, chuẩn hóa z-score
  § Cây: Gini, split, build, predict
  § Bootstrap / OOB
  § train_bagging + predict_bagging
  § Demo vote trên test + matplotlib
  § main() — 5 bước gọi rõ tên
"""

from __future__ import annotations

import math
import random
import sys
from collections import Counter
from dataclasses import dataclass
from typing import List, Optional, Sequence, Tuple
from urllib.request import urlopen

try:
    import matplotlib.pyplot as plt
except ImportError:  # pragma: no cover
    plt = None


# =============================================================================
# § CẤU HÌNH — chỉnh thử nghiệm tại đây
# =============================================================================


@dataclass
class ExperimentConfig:
    """Một chỗ chứa toàn bộ tham số để dễ đọc và so sánh khi phân tích."""

    data_url: str
    random_state: int
    test_fraction: float
    n_estimators: int
    min_samples_leaf: int
    min_samples_split: int
    randomize_depth_per_tree: bool
    max_depth_min: int
    max_depth_max: int
    max_depth_default: int  # dùng cho cây baseline full train + khi không random depth
    bagging_max_samples: float  # tỉ lệ độ dài bootstrap so với len(train)
    min_oob_samples_for_metric: int  # ít hơn thì không báo OOB (tránh chia nhỏ)
    output_figure: str


CFG = ExperimentConfig(
    data_url=(
        "https://archive.ics.uci.edu/ml/machine-learning-databases/"
        "breast-cancer-wisconsin/wdbc.data"
    ),
    random_state=42,
    
    # tỉ lệ train/test
    test_fraction=0.2,
    n_estimators=41,
    min_samples_leaf=40,
    min_samples_split=95,
    randomize_depth_per_tree=True,
    max_depth_min=2,
    max_depth_max=4,
    max_depth_default=3,
    bagging_max_samples=0.55,
    min_oob_samples_for_metric=10,
    output_figure="bagging_steps_overview.png",
)

LABEL_NAME = {0: "Malignant (M)", 1: "Benign (B)"}


# =============================================================================
# § DỮ LIỆU
# =============================================================================

# read đặc trưng số từ URL, chuyển B/M thành 1/0, bỏ qua dòng lỗi nếu có. Kết quả: X là list of list of float, y là list of int (1=B, 0=M).
# đọc dữ liệu từng cột giả sử cđọc côt part[1]  , part[2..31] là 30 đặc trưng số đọc xong lưu vào x, còn part[1] là nhãn B/M chuyển thành 1/0 lưu vào y. Nếu có lỗi dòng nào thì bỏ qua, nhưng nếu không đọc được dòng nào thì báo lỗi.

def load_wdbc_from_url(url: str) -> Tuple[List[List[float]], List[int]]:
    """UCI wdbc: cột 1 = B/M → y ∈ {1,0}; 30 đặc trưng số."""
    X: List[List[float]] = []
    y: List[int] = []
    with urlopen(url) as resp:
        raw = resp.read().decode("utf-8").splitlines()
    for line in raw:
        line = line.strip()
        if not line:
            continue
        parts = line.split(",")
        if len(parts) < 32:
            continue
        diagnosis = parts[1].strip().upper()
        if diagnosis == "B":
            label = 1
        elif diagnosis == "M":
            label = 0
        else:
            continue
        X.append([float(parts[j]) for j in range(2, 32)])
        y.append(label)
    if not X:
        raise RuntimeError("Không đọc được dữ liệu từ URL.")
    return X, y

# chia tập train/test của 2 nhãn riêng biệt (stratified) để giữ tỉ lệ B/M tương tự nhau, tránh bias nếu chia ngẫu nhiên mà trúng nhiều M vào test chẳng hạn.
def stratified_train_test_split(
    X: List[List[float]],
    y: List[int],
    test_fraction: float,
    rng: random.Random,
) -> Tuple[List[List[float]], List[List[float]], List[int], List[int]]:
    """Chia train/test riêng từng lớp rồi gộp — giữ tỉ lệ nhãn (stratified)."""
    idx0 = [i for i, t in enumerate(y) if t == 0]
    idx1 = [i for i, t in enumerate(y) if t == 1]
    rng.shuffle(idx0)
    rng.shuffle(idx1)

    def take_train_test(idxs: List[int]) -> Tuple[List[int], List[int]]:
        n = len(idxs)
        n_test = max(1, int(round(n * test_fraction)))
        return idxs[n_test:], idxs[:n_test]

    tr0, te0 = take_train_test(idx0)
    tr1, te1 = take_train_test(idx1)
    train_idx, test_idx = tr0 + tr1, te0 + te1
    rng.shuffle(train_idx)
    rng.shuffle(test_idx)

    return (
        [X[i][:] for i in train_idx],
        [X[i][:] for i in test_idx],
        [y[i] for i in train_idx],
        [y[i] for i in test_idx],
    )

# chuẩn hóa dữ lieu đẻ train
def fit_zscore(X_train: List[List[float]]) -> Tuple[List[float], List[float]]:
    n, d = len(X_train), len(X_train[0])
    means = [sum(row[j] for row in X_train) / n for j in range(d)]
    variances: List[float] = []
    for j in range(d):
        variances.append(sum((row[j] - means[j]) ** 2 for row in X_train) / max(n - 1, 1))
    stds = [math.sqrt(v) + 1e-9 for v in variances]
    return means, stds


def apply_zscore(X: List[List[float]], means: List[float], stds: List[float]) -> List[List[float]]:
    d = len(means)
    return [[(row[j] - means[j]) / stds[j] for j in range(d)] for row in X]


# =============================================================================
# § CÂY QUYẾT ĐỊNH (CART, Gini)
# =============================================================================


def gini(labels: Sequence[int]) -> float:
    n = len(labels)
    if n == 0:
        return 0.0
    c = Counter(labels)
    return 1.0 - sum((cnt / n) ** 2 for cnt in c.values())


@dataclass
class TreeNode:
    is_leaf: bool
    prediction: Optional[int] = None
    feat_index: Optional[int] = None
    threshold: Optional[float] = None
    left: Optional["TreeNode"] = None
    right: Optional["TreeNode"] = None


def _majority_class(labels: Sequence[int]) -> int:
    return Counter(labels).most_common(1)[0][0]


def _find_best_binary_split(
    X: List[List[float]],
    y: List[int],
    min_samples_leaf: int,
    rng: random.Random,
) -> Optional[Tuple[int, float, List[int], List[int]]]:
    """Một split: feature j, ngưỡng t, chia chỉ số hàng trái/phải."""
    n = len(y)
    if n < 2:
        return None
    n_features = len(X[0])
    parent_gini = gini(y)
    best_gain, best = 0.0, None
    feature_order = list(range(n_features))
    rng.shuffle(feature_order)

    for j in feature_order:
        values = sorted({X[i][j] for i in range(n)})
        thresholds = [(a + b) / 2.0 for a, b in zip(values[:-1], values[1:])]
        rng.shuffle(thresholds)
        for t in thresholds[: min(30, len(thresholds))]:
            left_idx = [i for i in range(n) if X[i][j] <= t]
            right_idx = [i for i in range(n) if X[i][j] > t]
            if len(left_idx) < min_samples_leaf or len(right_idx) < min_samples_leaf:
                continue
            y_l = [y[i] for i in left_idx]
            y_r = [y[i] for i in right_idx]
            weighted = (len(y_l) / n) * gini(y_l) + (len(y_r) / n) * gini(y_r)
            gain = parent_gini - weighted
            if gain > best_gain + 1e-12:
                best_gain, best = gain, (j, t, left_idx, right_idx)
    return best


def build_tree(
    X: List[List[float]],
    y: List[int],
    depth: int,
    max_depth: int,
    min_samples_leaf: int,
    min_samples_split: int,
    rng: random.Random,
) -> TreeNode:
    stop = (
        depth >= max_depth
        or len(y) < min_samples_leaf * 2
        or len(y) < min_samples_split
        or gini(y) < 1e-12
    )
    if stop:
        return TreeNode(is_leaf=True, prediction=_majority_class(y))

    split = _find_best_binary_split(X, y, min_samples_leaf, rng)
    if split is None:
        return TreeNode(is_leaf=True, prediction=_majority_class(y))

    j, t, left_idx, right_idx = split
    X_l = [X[i] for i in left_idx]
    X_r = [X[i] for i in right_idx]
    y_l = [y[i] for i in left_idx]
    y_r = [y[i] for i in right_idx]
    kw = dict(
        max_depth=max_depth,
        min_samples_leaf=min_samples_leaf,
        min_samples_split=min_samples_split,
        rng=rng,
    )
    return TreeNode(
        is_leaf=False,
        feat_index=j,
        threshold=t,
        left=build_tree(X_l, y_l, depth + 1, **kw),
        right=build_tree(X_r, y_r, depth + 1, **kw),
    )


def predict_one(node: TreeNode, x: Sequence[float]) -> int:
    if node.is_leaf:
        assert node.prediction is not None
        return node.prediction
    assert node.feat_index is not None and node.threshold is not None
    child = node.left if x[node.feat_index] <= node.threshold else node.right
    assert child is not None
    return predict_one(child, x)


def predict_tree(node: TreeNode, X: List[List[float]]) -> List[int]:
    return [predict_one(node, row) for row in X]


# =============================================================================
# § BOOTSTRAP & OOB
# =============================================================================


def draw_bootstrap_row_indices(n_train: int, rng: random.Random, max_samples_ratio: float) -> List[int]:
    k = n_train if max_samples_ratio >= 1.0 else max(1, int(round(max_samples_ratio * n_train)))
    return [rng.randrange(n_train) for _ in range(k)]


def indices_never_drawn(n_train: int, bootstrap_indices: List[int]) -> List[int]:
    """OOB = chỉ số hàng train không xuất hiện trong list bootstrap (đếm có hoàn lại)."""
    seen = Counter(bootstrap_indices)
    return [j for j in range(n_train) if seen[j] == 0]


# =============================================================================
# § METRICS
# =============================================================================


def accuracy(y_true: Sequence[int], y_pred: Sequence[int]) -> float:
    n = len(y_true)
    if n == 0:
        return 0.0
    return sum(1 for a, b in zip(y_true, y_pred) if a == b) / n


@dataclass
class SingleTreeBaggingMetrics:
    """Kết quả huấn luyện một cây trong vòng Bagging — dễ in và phân tích."""

    tree: TreeNode
    max_depth_used: int
    bootstrap_length: int
    n_oob_points: int
    acc_inbag: float
    acc_oob: float  # nan nếu quá ít điểm OOB


def train_one_bagged_tree(
    X_train: List[List[float]],
    y_train: List[int],
    cfg: ExperimentConfig,
    tree_rng: random.Random,
) -> SingleTreeBaggingMetrics:
    n = len(X_train)
    depth = (
        tree_rng.randint(cfg.max_depth_min, cfg.max_depth_max)
        if cfg.randomize_depth_per_tree
        else cfg.max_depth_default
    )
    boot_idx = draw_bootstrap_row_indices(n, tree_rng, cfg.bagging_max_samples)
    X_b = [X_train[i] for i in boot_idx]
    y_b = [y_train[i] for i in boot_idx]
    tree = build_tree(
        X_b, y_b, 0, depth, cfg.min_samples_leaf, cfg.min_samples_split, tree_rng
    )
    acc_in = accuracy(y_b, predict_tree(tree, X_b))

    oob_idx = indices_never_drawn(n, boot_idx)
    if len(oob_idx) >= cfg.min_oob_samples_for_metric:
        y_oob = [y_train[j] for j in oob_idx]
        acc_out = accuracy(y_oob, predict_tree(tree, [X_train[j] for j in oob_idx]))
    else:
        acc_out = float("nan")

    return SingleTreeBaggingMetrics(
        tree=tree,
        max_depth_used=depth,
        bootstrap_length=len(boot_idx),
        n_oob_points=len(oob_idx),
        acc_inbag=acc_in,
        acc_oob=acc_out,
    )


def _print_bagging_intro(cfg: ExperimentConfig, n_train: int) -> None:
    approx_boot = int(round(cfg.bagging_max_samples * n_train))
    print("\n" + "=" * 70)
    print("BƯỚC 1–2: BOOTSTRAP + HUẤN LUYỆN TỪNG MODEL (M1, M2, …)")
    print("=" * 70)
    print(f"In-bag: đúng trên multiset bootstrap (~{approx_boot} lần rút / cây).")
    print("OOB: đúng trên điểm train không nằm trong bootstrap của cây đó.")
    if cfg.randomize_depth_per_tree:
        print(
            f"Depth mỗi cây: random [{cfg.max_depth_min}, {cfg.max_depth_max}], "
            f"leaf≥{cfg.min_samples_leaf}, split≥{cfg.min_samples_split}."
        )
    else:
        print(f"Mọi cây max_depth={cfg.max_depth_default}.")


def _print_one_tree_line(model_index: int, m: SingleTreeBaggingMetrics) -> None:
    oob_txt = f"{m.acc_oob * 100:6.2f}%" if not math.isnan(m.acc_oob) else " n/a  "
    print(
        f"  M{model_index:<3} |  in-bag: {m.acc_inbag * 100:6.2f}%  |  OOB: {oob_txt}  "
        f"|  |OOB|={m.n_oob_points:3d}  |  depth={m.max_depth_used}  "
        f"|  len(bootstrap)={m.bootstrap_length}"
    )


def train_bagging(
    X_train: List[List[float]],
    y_train: List[int],
    cfg: ExperimentConfig,
    base_rng: random.Random,
    verbose: bool = True,
) -> Tuple[List[TreeNode], List[float], List[float], List[int]]:
    trees: List[TreeNode] = []
    inbag, oob, depths = [], [], []
    n_train = len(X_train)

    if verbose:
        _print_bagging_intro(cfg, n_train)

    for b in range(cfg.n_estimators):
        tree_rng = random.Random(base_rng.randint(0, 2**30))
        m = train_one_bagged_tree(X_train, y_train, cfg, tree_rng)
        trees.append(m.tree)
        inbag.append(m.acc_inbag)
        oob.append(m.acc_oob)
        depths.append(m.max_depth_used)
        if verbose:
            _print_one_tree_line(b + 1, m)

    return trees, inbag, oob, depths


def predict_bagging(trees: List[TreeNode], X: List[List[float]]) -> List[int]:
    if not trees:
        raise ValueError("Chưa có cây")
    per_tree = [predict_tree(t, X) for t in trees]
    n_samples = len(X)
    n_trees = len(trees)
    out: List[int] = []
    for i in range(n_samples):
        votes = [per_tree[t][i] for t in range(n_trees)]
        out.append(Counter(votes).most_common(1)[0][0])
    return out


def votes_for_one_sample(
    trees: List[TreeNode], x: Sequence[float]
) -> Tuple[List[int], int, Counter]:
    votes = [predict_one(t, x) for t in trees]
    ctr = Counter(votes)
    return votes, ctr.most_common(1)[0][0], ctr


def pick_test_index_most_disagreement(
    trees: List[TreeNode],
    X_test_s: List[List[float]],
    y_test: Optional[List[int]] = None,
    y_pred_ensemble: Optional[List[int]] = None,
    prefer_correct_ensemble: bool = True,
) -> Tuple[int, List[int], int, Counter]:
    def sort_key_for_row(i: int) -> Tuple[int, int, int]:
        _, _, ctr = votes_for_one_sample(trees, X_test_s[i])
        c0, c1 = ctr.get(0, 0), ctr.get(1, 0)
        margin = abs(c0 - c1)
        if c0 > 0 and c1 > 0:
            return (0, margin, -min(c0, c1))
        return (1, margin + 10_000, 0)

    n_t = len(X_test_s)
    candidates = list(range(n_t))
    if prefer_correct_ensemble and y_test is not None and y_pred_ensemble is not None:
        ok = []
        for i in range(n_t):
            if y_pred_ensemble[i] != y_test[i]:
                continue
            _, _, ctr = votes_for_one_sample(trees, X_test_s[i])
            if ctr.get(0, 0) > 0 and ctr.get(1, 0) > 0:
                ok.append(i)
        if ok:
            candidates = ok

    best_i = min(candidates, key=sort_key_for_row)
    votes, _, ctr = votes_for_one_sample(trees, X_test_s[best_i])
    margin = abs(ctr.get(0, 0) - ctr.get(1, 0))
    return best_i, votes, margin, ctr


# =============================================================================
# § HÌNH ẢNH
# =============================================================================


def draw_overview(
    inbag_accs: List[float],
    oob_accs: List[float],
    ensemble_test_acc: float,
    single_tree_test_acc: Optional[float],
    out_path: str,
) -> None:
    if plt is None:
        print("Không có matplotlib — bỏ qua vẽ. Cài: pip install matplotlib")
        return

    n = len(inbag_accs)
    names = [f"M{k}" for k in range(1, n + 1)]
    fig, axes = plt.subplots(1, 3, figsize=(16, 5))

    # Panel A — in-bag
    ax0 = axes[0]
    ax0.bar(names, [a * 100 for a in inbag_accs], color="#3498db", edgecolor="black", linewidth=0.4)
    ax0.axhline(y=sum(inbag_accs) / n * 100, color="crimson", linestyle="--", label="TB in-bag")
    ax0.set_ylabel("Độ chính xác (%)")
    ax0.set_xlabel("Cây")
    ax0.set_title("A) In-bag (trên bootstrap của từng cây)")
    ax0.set_ylim(0, 105)
    ax0.legend(fontsize=8)
    ax0.tick_params(axis="x", rotation=45)
    ax0.grid(axis="y", alpha=0.3)

    # Panel B — OOB
    ax1 = axes[1]
    oob_pct = [a * 100 if not math.isnan(a) else 0.0 for a in oob_accs]
    colors_oob = ["#e67e22" if not math.isnan(a) else "#bdc3c7" for a in oob_accs]
    ax1.bar(names, oob_pct, color=colors_oob, edgecolor="black", linewidth=0.4)
    finite = [a for a in oob_accs if not math.isnan(a)]
    if finite:
        m_oob = sum(finite) / len(finite) * 100
        ax1.axhline(y=m_oob, color="darkgreen", linestyle="--", linewidth=1.5, label="TB OOB")
        if len(finite) > 1:
            var = sum((a * 100 - m_oob) ** 2 for a in finite) / (len(finite) - 1)
            ax1.text(
                0.02,
                0.98,
                f"TB OOB ≈ {m_oob:.1f}%\nđộ lệch ≈ {math.sqrt(var):.1f}%",
                transform=ax1.transAxes,
                va="top",
                fontsize=9,
                bbox=dict(boxstyle="round", facecolor="wheat", alpha=0.8),
            )
    ax1.set_ylabel("Độ chính xác (%)")
    ax1.set_xlabel("Cây")
    ax1.set_title("B) OOB (train không vào bootstrap)")
    ax1.set_ylim(max(0, min(oob_pct) - 10 if oob_pct else 50), 105)
    ax1.legend(fontsize=8, loc="lower right")
    ax1.tick_params(axis="x", rotation=45)
    ax1.grid(axis="y", alpha=0.3)

    # Panel C — test
    ax2 = axes[2]
    labels = ["Ensemble\n(vote)"]
    vals = [ensemble_test_acc * 100]
    colors = ["#27ae60"]
    if single_tree_test_acc is not None:
        labels.append("1 cây\nfull train")
        vals.append(single_tree_test_acc * 100)
        colors.append("#c0392b")
    ax2.bar(labels, vals, color=colors, edgecolor="black", linewidth=0.6)
    ax2.set_ylim(0, 105)
    ax2.set_ylabel("Độ chính xác (%)")
    ax2.set_title("C) So sánh trên tập test")
    for i, v in enumerate(vals):
        ax2.text(i, v + 1.5, f"{v:.1f}%", ha="center", fontsize=11, fontweight="bold")
    ax2.grid(axis="y", alpha=0.3)

    fig.suptitle("Bagging: in-bag vs OOB từng cây → vote trên test", fontsize=13, fontweight="bold")
    fig.tight_layout()
    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"\nĐã lưu sơ đồ: {out_path}")


# =============================================================================
# § MAIN — 5 bước
# =============================================================================


def _configure_stdout_utf8_windows() -> None:
    if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass


def _print_config_line(cfg: ExperimentConfig) -> None:
    depth_s = (
        f"random {cfg.max_depth_min}..{cfg.max_depth_max}"
        if cfg.randomize_depth_per_tree
        else str(cfg.max_depth_default)
    )
    print(
        f"\nCấu hình: n_estimators={cfg.n_estimators}, depth={depth_s}, "
        f"min_samples_leaf={cfg.min_samples_leaf}, min_samples_split={cfg.min_samples_split}, "
        f"bootstrap max_samples={cfg.bagging_max_samples}"
    )


def _print_vote_demo(
    demo_i: int,
    votes: List[int],
    vote_margin: int,
    ctr: Counter,
    y_test: List[int],
) -> None:
    final = ctr.most_common(1)[0][0]
    print(
        f"\nMẫu test #{demo_i} (|#0−#1|={vote_margin}; nhỏ = nhiều tranh luận):"
    )
    print(f"  Nhãn thật: {y_test[demo_i]} ({LABEL_NAME[y_test[demo_i]]})")
    per_line = 10
    for start in range(0, len(votes), per_line):
        chunk = votes[start : start + per_line]
        parts = [f"M{start + j + 1}→{chunk[j]}" for j in range(len(chunk))]
        print("  Phiếu    : " + ", ".join(parts))
    print("  Chuỗi 0/1: " + "".join(map(str, votes)) + "  (0=M, 1=B)")
    parts_ct = ", ".join(
        f"{LABEL_NAME[lab]}: {c}" for lab, c in sorted(ctr.items(), key=lambda x: -x[1])
    )
    print(f"  Đếm     : {parts_ct}")
    ok = "ĐÚNG" if final == y_test[demo_i] else "SAI"
    print(f"  Vote    : {final} ({LABEL_NAME[final]})  {ok}")


def main() -> None:
    _configure_stdout_utf8_windows()
    cfg = CFG
    rng = random.Random(cfg.random_state)

    # Bước 1 — dữ liệu
    print("Đang tải UCI wdbc.data …")
    X, y = load_wdbc_from_url(cfg.data_url)
    print(f"Mẫu={len(X)}, đặc trưng={len(X[0])} | B={sum(y)} M={len(y)-sum(y)}")
    X_train, X_test, y_train, y_test = stratified_train_test_split(
        X, y, cfg.test_fraction, rng
    )
    print(f"Train={len(X_train)} | Test={len(X_test)}")

    # Bước 2 — chuẩn hóa (chỉ thống kê từ train)
    means, stds = fit_zscore(X_train)
    X_train_s = apply_zscore(X_train, means, stds)
    X_test_s = apply_zscore(X_test, means, stds)

    _print_config_line(cfg)

    # Bước 3 — Bagging (bootstrap + huấn luyện + in từng cây)
    trees, inbag_accs, oob_accs, _depths = train_bagging(
        X_train_s, y_train, cfg, base_rng=rng, verbose=True
    )

    # Bước 4 — Aggregating trên test
    y_pred = predict_bagging(trees, X_test_s)
    print("\n" + "=" * 60)
    print("BƯỚC 3 (tiếp): AGGREGATING — đa số phiếu trên test")
    print("=" * 60)

    demo_i, votes, vote_margin, ctr = pick_test_index_most_disagreement(
        trees, X_test_s, y_test, y_pred, prefer_correct_ensemble=True
    )
    _print_vote_demo(demo_i, votes, vote_margin, ctr, y_test)

    acc = accuracy(y_test, y_pred)
    print(f"\nAccuracy Bagging (test): {acc * 100:.2f}%")

    # Baseline: một cây trên full train (cùng siêu tham số lá/split, depth mặc định)
    single = build_tree(
        X_train_s,
        y_train,
        0,
        cfg.max_depth_default,
        cfg.min_samples_leaf,
        cfg.min_samples_split,
        rng,
    )
    acc_single = accuracy(y_test, predict_tree(single, X_test_s))
    print(f"Accuracy 1 cây full train (test): {acc_single * 100:.2f}%")

    # Bước 5 — hình + tóm tắt số
    draw_overview(inbag_accs, oob_accs, acc, acc_single, cfg.output_figure)

    oob_finite = [a for a in oob_accs if not math.isnan(a)]
    oob_mean = sum(oob_finite) / len(oob_finite) if oob_finite else float("nan")
    oob_std = (
        math.sqrt(
            sum((a - oob_mean) ** 2 for a in oob_finite) / (len(oob_finite) - 1)
        )
        if len(oob_finite) > 1
        else float("nan")
    )

    print("\n" + "=" * 60)
    print("Tóm tắt")
    print("=" * 60)
    print(f"  TB in-bag: {sum(inbag_accs)/len(inbag_accs)*100:.2f}%")
    if not math.isnan(oob_mean):
        print(f"  TB OOB:   {oob_mean*100:.2f}%  (σ giữa các cây ≈ {oob_std*100:.2f}%)")
    print(f"  Test vote:{acc*100:.2f}%")
    print("=" * 60)


if __name__ == "__main__":
    main()
