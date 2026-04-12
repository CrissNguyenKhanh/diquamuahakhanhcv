# -*- coding: utf-8 -*-
"""
Chạy trên Google Colab: Runtime → Run all (hoặc dán toàn bộ vào 1 cell).
Cần upload kaggle.json khi được hỏi (lần chạy đầu).

Dataset: https://www.kaggle.com/datasets/javidmohammadi/wine-quality-red-and-white-merged-csv
So sánh: Decision Tree | Bagging (bootstrap=True) | Pasting (bootstrap=False)
"""

# ---------------------------------------------------------------------------
# 0) Setup môi trường Colab
# ---------------------------------------------------------------------------
import sys

IN_COLAB = "google.colab" in sys.modules

if IN_COLAB:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "-q", "install", "kaggle"])

import os
import numpy as np
import pandas as pd

from sklearn.model_selection import (
    StratifiedKFold,
    cross_validate,
    train_test_split,
)
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

DATA_DIR = "/content/data" if IN_COLAB else os.path.join(os.path.dirname(__file__), "data")

# ---------------------------------------------------------------------------
# 1) Kaggle API: Colab upload kaggle.json; local dùng ~/.kaggle nếu có
# ---------------------------------------------------------------------------
if IN_COLAB:
    from google.colab import files

    os.makedirs("/root/.kaggle", exist_ok=True)
    if not os.path.exists("/root/.kaggle/kaggle.json"):
        print("=== Chọn file kaggle.json từ máy bạn ===")
        uploaded = files.upload()
        if "kaggle.json" not in uploaded:
            raise RuntimeError("Cần file kaggle.json trong upload.")
        with open("/root/.kaggle/kaggle.json", "wb") as f:
            f.write(uploaded["kaggle.json"])
        os.chmod("/root/.kaggle/kaggle.json", 0o600)
    else:
        print("Đã có /root/.kaggle/kaggle.json — bỏ qua bước upload.")

    import subprocess

    os.makedirs(DATA_DIR, exist_ok=True)
    subprocess.check_call(
        [
            "kaggle",
            "datasets",
            "download",
            "-d",
            "javidmohammadi/wine-quality-red-and-white-merged-csv",
            "-p",
            DATA_DIR,
            "--unzip",
        ]
    )
else:
    os.makedirs(DATA_DIR, exist_ok=True)
    csv_paths = [f for f in os.listdir(DATA_DIR) if f.lower().endswith(".csv")]
    if not csv_paths:
        raise RuntimeError(
            "Chưa có CSV trong ./data. Tải dataset Kaggle vào thư mục data/ hoặc chạy trên Colab."
        )

# ---------------------------------------------------------------------------
# 2) Đọc CSV
# ---------------------------------------------------------------------------
csv_files = [f for f in os.listdir(DATA_DIR) if f.lower().endswith(".csv")]
if not csv_files:
    raise FileNotFoundError(f"Không thấy file .csv trong {DATA_DIR}")

csv_path = os.path.join(DATA_DIR, csv_files[0])
print("Dùng file:", csv_path)
df = pd.read_csv(csv_path)
df.columns = [c.strip() for c in df.columns]

if "quality" not in df.columns:
    raise ValueError(f"Cột 'quality' không tồn tại. Các cột: {df.columns.tolist()}")

# ---------------------------------------------------------------------------
# 3) Target nhị phân: good wine (quality >= 7)
# ---------------------------------------------------------------------------
df["target"] = (df["quality"] >= 7).astype(int)
X = df.drop(columns=["quality", "target"])
y = df["target"]
X = pd.get_dummies(X, drop_first=True)

print("Shape X:", X.shape)
print("y (%):\n", (y.value_counts(normalize=True) * 100).round(2))

# ---------------------------------------------------------------------------
# 4) Train / test
# ---------------------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=RANDOM_STATE,
)

N_ESTIMATORS = 200
MAX_SAMPLES = 0.7

base_tree = DecisionTreeClassifier(random_state=RANDOM_STATE)

bagging_model = BaggingClassifier(
    estimator=DecisionTreeClassifier(random_state=RANDOM_STATE),
    n_estimators=N_ESTIMATORS,
    max_samples=MAX_SAMPLES,
    bootstrap=True,
    oob_score=True,
    n_jobs=-1,
    random_state=RANDOM_STATE,
)

pasting_model = BaggingClassifier(
    estimator=DecisionTreeClassifier(random_state=RANDOM_STATE),
    n_estimators=N_ESTIMATORS,
    max_samples=MAX_SAMPLES,
    bootstrap=False,
    n_jobs=-1,
    random_state=RANDOM_STATE,
)


def metrics_row(y_true, y_pred):
    return {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred, zero_division=0),
        "recall": recall_score(y_true, y_pred, zero_division=0),
        "f1": f1_score(y_true, y_pred, zero_division=0),
    }


# ---------------------------------------------------------------------------
# 5) Fit & đánh giá trên test
# ---------------------------------------------------------------------------
print("\n=== Baseline: một cây quyết định ===")
base_tree.fit(X_train, y_train)
y_pred_base = base_tree.predict(X_test)
print(metrics_row(y_test, y_pred_base))
print(classification_report(y_test, y_pred_base, digits=4))

print("\n=== Bagging (bootstrap=True), có OOB ===")
bagging_model.fit(X_train, y_train)
y_pred_bag = bagging_model.predict(X_test)
print("OOB score:", bagging_model.oob_score_)
print(metrics_row(y_test, y_pred_bag))
print(classification_report(y_test, y_pred_bag, digits=4))

print("\n=== Pasting (bootstrap=False) ===")
pasting_model.fit(X_train, y_train)
y_pred_pas = pasting_model.predict(X_test)
print(metrics_row(y_test, y_pred_pas))
print(classification_report(y_test, y_pred_pas, digits=4))

compare = pd.DataFrame(
    {
        "DecisionTree": metrics_row(y_test, y_pred_base),
        "Bagging": metrics_row(y_test, y_pred_bag),
        "Pasting": metrics_row(y_test, y_pred_pas),
    }
).T
print("\n=== Bảng so sánh (test set) ===")
print(compare.sort_values("f1", ascending=False).to_string())

# ---------------------------------------------------------------------------
# 6) Cross-validation (5-fold) — ổn định hơn một lần chia
# ---------------------------------------------------------------------------
print("\n=== Cross-validation 5-fold (F1, Accuracy, …) ===")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
scoring = ["accuracy", "precision", "recall", "f1"]

models = {
    "DecisionTree": DecisionTreeClassifier(random_state=RANDOM_STATE),
    "Bagging": BaggingClassifier(
        estimator=DecisionTreeClassifier(random_state=RANDOM_STATE),
        n_estimators=N_ESTIMATORS,
        max_samples=MAX_SAMPLES,
        bootstrap=True,
        n_jobs=-1,
        random_state=RANDOM_STATE,
    ),
    "Pasting": BaggingClassifier(
        estimator=DecisionTreeClassifier(random_state=RANDOM_STATE),
        n_estimators=N_ESTIMATORS,
        max_samples=MAX_SAMPLES,
        bootstrap=False,
        n_jobs=-1,
        random_state=RANDOM_STATE,
    ),
}

cv_rows = []
for name, model in models.items():
    scores = cross_validate(model, X, y, cv=cv, scoring=scoring, n_jobs=-1)
    cv_rows.append(
        {
            "model": name,
            "acc_mean": scores["test_accuracy"].mean(),
            "f1_mean": scores["test_f1"].mean(),
            "precision_mean": scores["test_precision"].mean(),
            "recall_mean": scores["test_recall"].mean(),
        }
    )

cv_df = pd.DataFrame(cv_rows).sort_values("f1_mean", ascending=False)
print(cv_df.to_string(index=False))

print("\nXong. Bagging dùng bootstrap=True + có thể xem OOB; Pasting dùng bootstrap=False.")
