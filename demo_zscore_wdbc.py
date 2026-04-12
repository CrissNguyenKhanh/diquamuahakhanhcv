# -*- coding: utf-8 -*-
"""Demo Z-score trên WDBC giống bagging_breast_cancer_pure_python.py (in ra số liệu thật)."""

import random
import sys

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from bagging_breast_cancer_pure_python import (
    CFG,
    LABEL_NAME,
    apply_zscore,
    fit_zscore,
    load_wdbc_from_url,
    stratified_train_test_split,
)

FEATURES = [
    "mean radius",
    "mean texture",
    "mean perimeter",
    "mean area",
    "mean smoothness",
    "mean compactness",
    "mean concavity",
    "mean concave points",
    "mean symmetry",
    "mean fractal dimension",
    "radius SE",
    "texture SE",
    "perimeter SE",
    "area SE",
    "smoothness SE",
    "compactness SE",
    "concavity SE",
    "concave points SE",
    "symmetry SE",
    "fractal dimension SE",
    "worst radius",
    "worst texture",
    "worst perimeter",
    "worst area",
    "worst smoothness",
    "worst compactness",
    "worst concavity",
    "worst concave points",
    "worst symmetry",
    "worst fractal dimension",
]


def main() -> None:
    X, y = load_wdbc_from_url(CFG.data_url)
    rng = random.Random(CFG.random_state)
    X_train, _X_test, y_train, _y_test = stratified_train_test_split(
        X, y, CFG.test_fraction, rng
    )
    means, stds = fit_zscore(X_train)
    Z_train = apply_zscore(X_train, means, stds)

    n = len(X_train)
    print(f"Train n = {n} | test_fraction = {CFG.test_fraction}")
    print("Z = (x - mean_train) / std_train — mean/std chỉ từ train.\n")
    print("Ví dụ: 5 đặc trưng đầu (mean radius … mean smoothness).\n")

    cols_show = [0, 1, 2, 3, 4]
    for row_i in range(3):
        print(
            f"--- Mẫu train hàng {row_i} | nhãn y = {y_train[row_i]} "
            f"({LABEL_NAME[y_train[row_i]]}) ---"
        )
        for j in cols_show:
            xj = X_train[row_i][j]
            zj = Z_train[row_i][j]
            print(
                f"  {FEATURES[j]:28}  x = {xj:12.6f}  "
                f"mu = {means[j]:10.4f}  std = {stds[j]:10.4f}  z = {zj:8.3f}"
            )
        print()

    print(
        "Ý nghĩa: mean area (x ~ hàng trăm) và mean radius (x ~ 10–20) "
        "cùng được đưa về thang z quanh 0 để so sánh độ lệch so với train."
    )


if __name__ == "__main__":
    main()
