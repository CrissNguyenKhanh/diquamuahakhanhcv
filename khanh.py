"""
=============================================================
Lab 4c: Classification Techniques - SVM từ đầu bằng Python
=============================================================
Không dùng sklearn, scipy cho SVM - tự implement hoàn toàn
"""

import math
import random
import numpy as np  # chỉ dùng numpy cho array/matrix ops cơ bản
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from matplotlib.colors import ListedColormap
import warnings
warnings.filterwarnings('ignore')

# ─────────────────────────────────────────────────────────────
# BƯỚC 1: TẠO DỮ LIỆU SYNTHETIC (không dùng sklearn)
# ─────────────────────────────────────────────────────────────

def make_moons(n_samples=200, noise=0.1, random_state=42):
    """
    Tạo dữ liệu hình trăng lưỡi liềm (make_moons) thủ công.
    
    Ý tưởng:
      - Nửa vòng tròn trên: class 0
      - Nửa vòng tròn dưới: class 1, dịch chuyển sang phải và xuống
    
    Args:
        n_samples   : tổng số điểm dữ liệu
        noise       : độ nhiễu Gaussian thêm vào
        random_state: seed ngẫu nhiên để tái tạo kết quả
    
    Returns:
        X : array (n_samples, 2) - tọa độ các điểm
        y : array (n_samples,)  - nhãn 0 hoặc 1
    """
    random.seed(random_state)
    np.random.seed(random_state)
    
    n_each = n_samples // 2
    
    # Nửa vòng tròn trên (class 0): góc từ 0 → π
    angles_0 = np.linspace(0, math.pi, n_each)
    X0 = np.column_stack([
        np.cos(angles_0),
        np.sin(angles_0)
    ])
    
    # Nửa vòng tròn dưới (class 1): góc từ 0 → π, dịch (1, -0.5)
    angles_1 = np.linspace(0, math.pi, n_each)
    X1 = np.column_stack([
        1 - np.cos(angles_1),
        -np.sin(angles_1) + 0.5
    ])
    
    # Ghép lại
    X = np.vstack([X0, X1])
    y = np.array([0] * n_each + [1] * n_each)
    
    # Thêm nhiễu Gaussian
    X += np.random.randn(*X.shape) * noise
    
    # Shuffle dữ liệu
    idx = np.random.permutation(n_samples)
    return X[idx], y[idx]


def make_circles(n_samples=200, noise=0.05, factor=0.5, random_state=42):
    """
    Tạo dữ liệu hai vòng tròn đồng tâm (make_circles) thủ công.
    
    Ý tưởng:
      - Vòng tròn ngoài (bán kính = 1): class 0
      - Vòng tròn trong (bán kính = factor): class 1
    
    Args:
        n_samples   : tổng số điểm
        noise       : độ nhiễu Gaussian
        factor      : tỉ lệ bán kính vòng trong / vòng ngoài (0 < factor < 1)
        random_state: seed ngẫu nhiên
    
    Returns:
        X : array (n_samples, 2)
        y : array (n_samples,)
    """
    np.random.seed(random_state)
    
    n_each = n_samples // 2
    
    # Vòng tròn ngoài
    angles_0 = np.linspace(0, 2 * math.pi, n_each)
    X0 = np.column_stack([np.cos(angles_0), np.sin(angles_0)])
    
    # Vòng tròn trong
    angles_1 = np.linspace(0, 2 * math.pi, n_each)
    X1 = factor * np.column_stack([np.cos(angles_1), np.sin(angles_1)])
    
    X = np.vstack([X0, X1])
    y = np.array([0] * n_each + [1] * n_each)
    
    X += np.random.randn(*X.shape) * noise
    
    idx = np.random.permutation(n_samples)
    return X[idx], y[idx]


# ─────────────────────────────────────────────────────────────
# KERNEL FUNCTIONS
# ─────────────────────────────────────────────────────────────

def kernel_linear(xi, xj):
    """
    Kernel tuyến tính: K(xi, xj) = xi · xj
    
    Tương đương với SVM trong không gian gốc (không biến đổi).
    Chỉ tạo ra decision boundary là đường thẳng.
    """
    return np.dot(xi, xj)


def kernel_rbf(xi, xj, gamma=1.0):
    """
    Kernel RBF (Radial Basis Function) / Gaussian:
      K(xi, xj) = exp(-gamma * ||xi - xj||^2)
    
    Ý tưởng Kernel Trick:
      - Thay vì biến đổi x sang không gian chiều cao φ(x) rồi tính dot product,
        ta tính trực tiếp K(xi, xj) = φ(xi)·φ(xj) mà không cần biết φ.
      - RBF kernel ứng với không gian vô hạn chiều → phân loại phi tuyến.
    
    Args:
        xi, xj : vector đặc trưng
        gamma  : tham số kiểm soát "độ rộng" của Gaussian
                 - gamma lớn → kernel hẹp → model phức tạp (dễ overfit)
                 - gamma nhỏ → kernel rộng → model đơn giản (dễ underfit)
    """
    diff = xi - xj
    return math.exp(-gamma * np.dot(diff, diff))


def build_kernel_matrix(X, kernel_func):
    """
    Xây dựng ma trận Gram (kernel matrix) K ∈ R^{n×n}
    
    K[i][j] = kernel(X[i], X[j])
    
    Ma trận này được dùng trong bài toán tối ưu dual của SVM.
    
    Args:
        X           : dữ liệu huấn luyện (n, d)
        kernel_func : hàm kernel nhận 2 vector, trả về scalar
    
    Returns:
        K : numpy array (n, n)
    """
    n = len(X)
    K = np.zeros((n, n))
    for i in range(n):
        for j in range(i, n):  # tận dụng tính đối xứng K[i][j] = K[j][i]
            val = kernel_func(X[i], X[j])
            K[i][j] = val
            K[j][i] = val
    return K


# ─────────────────────────────────────────────────────────────
# SMO (Sequential Minimal Optimization) - Thuật toán huấn luyện SVM
# ─────────────────────────────────────────────────────────────

class SVMFromScratch:
    """
    Support Vector Machine tự implement bằng thuật toán SMO.
    
    Bài toán tối ưu Dual của SVM (Soft Margin):
      Maximize: Σ αi - (1/2) Σi Σj αi αj yi yj K(xi, xj)
      Subject to:
        0 ≤ αi ≤ C   (ràng buộc box)
        Σ αi yi = 0  (ràng buộc bằng không)
    
    Sau khi tìm được α*, decision function:
      f(x) = Σ αi yi K(xi, x) + b
      Dự đoán: sign(f(x))
    
    Support Vectors: các điểm có αi > 0
    """
    
    def __init__(self, C=1.0, kernel='rbf', gamma=1.0,
                 max_iter=200, tol=1e-3, random_state=42):
        """
        Args:
            C           : tham số soft margin
                          - C nhỏ: cho phép nhiều lỗi → margin rộng → underfitting
                          - C lớn: ít lỗi → margin hẹp → overfitting
            kernel      : 'linear' hoặc 'rbf'
            gamma       : tham số của RBF kernel
            max_iter    : số vòng lặp tối đa SMO
            tol         : ngưỡng hội tụ (tolerance)
            random_state: seed
        """
        self.C = C
        self.kernel_name = kernel
        self.gamma = gamma
        self.max_iter = max_iter
        self.tol = tol
        self.random_state = random_state
        
        # Sẽ được gán sau khi train
        self.alphas = None      # hệ số Lagrange
        self.b = 0.0            # bias
        self.X_train = None
        self.y_train = None     # nhãn dạng {-1, +1}
        self.K = None           # kernel matrix
    
    def _kernel(self, xi, xj):
        """Gọi kernel function tương ứng."""
        if self.kernel_name == 'linear':
            return kernel_linear(xi, xj)
        else:
            return kernel_rbf(xi, xj, self.gamma)
    
    def _decision_function_precomputed(self, i):
        """
        Tính f(xi) sử dụng kernel matrix đã tính sẵn.
        f(xi) = Σj αj yj K(xj, xi) + b
        
        Dùng khi training (tối ưu tốc độ).
        """
        return float(np.dot(self.alphas * self.y_train, self.K[:, i])) + self.b
    
    def decision_function(self, X_test):
        """
        Tính f(x) cho tập test.
        f(x) = Σi αi yi K(xi, x) + b
        
        Chỉ dùng Support Vectors (αi > 0) để tính → hiệu quả hơn.
        """
        sv_mask = self.alphas > 1e-5
        sv_alphas = self.alphas[sv_mask]
        sv_y = self.y_train[sv_mask]
        sv_X = self.X_train[sv_mask]
        
        scores = []
        for x in X_test:
            k_vals = np.array([self._kernel(sv_X[j], x)
                               for j in range(len(sv_X))])
            score = float(np.dot(sv_alphas * sv_y, k_vals)) + self.b
            scores.append(score)
        return np.array(scores)
    
    def _compute_bounds(self, i, j):
        """
        Tính giới hạn L (lower) và H (upper) cho αj trong bước SMO.
        
        Công thức:
          Nếu yi ≠ yj: L = max(0, αj - αi),       H = min(C, C + αj - αi)
          Nếu yi = yj: L = max(0, αi + αj - C),   H = min(C, αi + αj)
        
        Đảm bảo ràng buộc 0 ≤ α ≤ C và Σ αi yi = 0.
        """
        if self.y_train[i] != self.y_train[j]:
            L = max(0, self.alphas[j] - self.alphas[i])
            H = min(self.C, self.C + self.alphas[j] - self.alphas[i])
        else:
            L = max(0, self.alphas[i] + self.alphas[j] - self.C)
            H = min(self.C, self.alphas[i] + self.alphas[j])
        return L, H
    
    def fit(self, X, y):
        """
        Huấn luyện SVM bằng thuật toán SMO (John Platt, 1998).
        
        SMO chia bài toán QP lớn thành nhiều bài toán nhỏ 2 biến,
        giải analytic từng bước → không cần solver QP nặng.
        
        Thuật toán:
          1. Khởi tạo α = 0, b = 0
          2. Lặp:
             a. Chọn cặp (i, j) vi phạm KKT condition
             b. Tối ưu αi, αj analytic
             c. Cập nhật b
          3. Dừng khi không còn vi phạm KKT
        
        KKT conditions:
          αi = 0    ↔  yi * f(xi) ≥ 1
          0 < αi < C ↔  yi * f(xi) = 1  (Support Vector trên margin)
          αi = C    ↔  yi * f(xi) ≤ 1
        """
        np.random.seed(self.random_state)
        n = len(X)
        
        # Chuyển nhãn từ {0,1} sang {-1, +1}
        self.X_train = np.array(X, dtype=float)
        self.y_train = np.where(y == 0, -1.0, 1.0)
        
        # Tính kernel matrix một lần (O(n²) nhưng tránh tính lại)
        print("  Đang tính kernel matrix...", end=" ")
        self.K = build_kernel_matrix(self.X_train,
                                     lambda a, b: self._kernel(a, b))
        print("xong!")
        
        # Khởi tạo
        self.alphas = np.zeros(n)
        self.b = 0.0
        
        num_changed = 0
        examine_all = True
        iteration = 0
        
        # Vòng lặp chính SMO
        while (num_changed > 0 or examine_all) and iteration < self.max_iter:
            num_changed = 0
            
            if examine_all:
                indices = range(n)
            else:
                # Chỉ xét các điểm vi phạm KKT (0 < α < C)
                indices = np.where((self.alphas > 0) &
                                   (self.alphas < self.C))[0]
            
            for i in indices:
                num_changed += self._examine_example(i, n)
            
            if examine_all:
                examine_all = False
            elif num_changed == 0:
                examine_all = True
            
            iteration += 1
        
        print(f"  Hội tụ sau {iteration} vòng lặp")
        print(f"  Số Support Vectors: {np.sum(self.alphas > 1e-5)}")
        return self
    
    def _examine_example(self, i2, n):
        """
        Kiểm tra và cập nhật αi2.
        
        Chọn αi1 tốt nhất (heuristic: max |Ei1 - Ei2|)
        rồi gọi _take_step để tối ưu cặp (i1, i2).
        """
        y2 = self.y_train[i2]
        alph2 = self.alphas[i2]
        E2 = self._decision_function_precomputed(i2) - y2
        
        r2 = E2 * y2
        
        # Vi phạm KKT?
        if (r2 < -self.tol and alph2 < self.C) or \
           (r2 > self.tol and alph2 > 0):
            
            # Heuristic 1: chọn i1 có |E1 - E2| lớn nhất
            sv_indices = np.where((self.alphas > 0) &
                                  (self.alphas < self.C))[0]
            if len(sv_indices) > 1:
                E_vals = np.array([
                    self._decision_function_precomputed(k) - self.y_train[k]
                    for k in sv_indices
                ])
                if E2 >= 0:
                    i1 = sv_indices[np.argmin(E_vals)]
                else:
                    i1 = sv_indices[np.argmax(E_vals)]
                if self._take_step(i1, i2, E2):
                    return 1
            
            # Heuristic 2: duyệt random qua support vectors
            if len(sv_indices) > 0:
                start = np.random.randint(len(sv_indices))
                for k in range(len(sv_indices)):
                    i1 = sv_indices[(start + k) % len(sv_indices)]
                    if self._take_step(i1, i2, E2):
                        return 1
            
            # Heuristic 3: duyệt toàn bộ
            start = np.random.randint(n)
            for k in range(n):
                i1 = (start + k) % n
                if self._take_step(i1, i2, E2):
                    return 1
        
        return 0
    
    def _take_step(self, i1, i2, E2):
        """
        Tối ưu analytic cặp (α1, α2).
        
        Công thức cập nhật:
          η = K11 + K22 - 2*K12  (second derivative âm của objective)
          α2_new = α2 + y2*(E1-E2) / η
          α2_new = clip(α2_new, L, H)
          α1_new = α1 + y1*y2*(α2 - α2_new)
        
        Cập nhật bias b:
          b1 = b - E1 - y1*(α1_new-α1)*K11 - y2*(α2_new-α2)*K12
          b2 = b - E2 - y1*(α1_new-α1)*K12 - y2*(α2_new-α2)*K22
        """
        if i1 == i2:
            return False
        
        alph1 = self.alphas[i1]
        alph2 = self.alphas[i2]
        y1 = self.y_train[i1]
        y2 = self.y_train[i2]
        E1 = self._decision_function_precomputed(i1) - y1
        
        L, H = self._compute_bounds(i1, i2)
        if abs(H - L) < 1e-10:
            return False
        
        # η = K11 + K22 - 2*K12
        k11 = self.K[i1, i1]
        k12 = self.K[i1, i2]
        k22 = self.K[i2, i2]
        eta = k11 + k22 - 2 * k12
        
        if eta > 0:
            a2 = alph2 + y2 * (E1 - E2) / eta
            a2 = max(L, min(H, a2))  # clip vào [L, H]
        else:
            # Trường hợp degenerate: tính trực tiếp objective tại L và H
            f1 = self._decision_function_precomputed(i1)
            f2 = self._decision_function_precomputed(i2)
            v1 = f1 - self.b - y1 * alph1 * k11 - y2 * alph2 * k12
            v2 = f2 - self.b - y1 * alph1 * k12 - y2 * alph2 * k22
            
            s = y1 * y2
            gamma_ = alph1 + s * alph2
            
            Lobj = (gamma_ - s * L) + L - 0.5 * k11 * (gamma_ - s * L) ** 2 \
                   - 0.5 * k22 * L ** 2 \
                   - s * k12 * (gamma_ - s * L) * L \
                   - y1 * (gamma_ - s * L) * v1 - y2 * L * v2
            Hobj = (gamma_ - s * H) + H - 0.5 * k11 * (gamma_ - s * H) ** 2 \
                   - 0.5 * k22 * H ** 2 \
                   - s * k12 * (gamma_ - s * H) * H \
                   - y1 * (gamma_ - s * H) * v1 - y2 * H * v2
            
            if Lobj > Hobj + 1e-12:
                a2 = L
            elif Lobj < Hobj - 1e-12:
                a2 = H
            else:
                a2 = alph2
        
        # Kiểm tra thay đổi đủ lớn không
        if abs(a2 - alph2) < 1e-8 * (a2 + alph2 + 1e-8):
            return False
        
        a1 = alph1 + y1 * y2 * (alph2 - a2)
        
        # Cập nhật bias
        b1 = self.b - E1 - y1 * (a1 - alph1) * k11 - y2 * (a2 - alph2) * k12
        b2 = self.b - E2 - y1 * (a1 - alph1) * k12 - y2 * (a2 - alph2) * k22
        
        if 0 < a1 < self.C:
            self.b = b1
        elif 0 < a2 < self.C:
            self.b = b2
        else:
            self.b = (b1 + b2) / 2
        
        self.alphas[i1] = a1
        self.alphas[i2] = a2
        return True
    
    def predict(self, X_test):
        """
        Dự đoán nhãn: sign(f(x))
        Trả về nhãn gốc {0, 1}.
        """
        scores = self.decision_function(X_test)
        y_pred = np.where(scores >= 0, 1, -1)
        return np.where(y_pred == 1, 1, 0)
    
    def score(self, X_test, y_test):
        """Tính accuracy."""
        return np.mean(self.predict(X_test) == y_test)
    
    def get_support_vectors(self):
        """
        Lấy Support Vectors: các điểm có αi > threshold.
        
        Support Vectors là những điểm:
          - Nằm trên margin (0 < αi < C): "margin support vectors"
          - Vi phạm margin (αi = C): "bound support vectors"
        """
        sv_mask = self.alphas > 1e-5
        return self.X_train[sv_mask], self.y_train[sv_mask], self.alphas[sv_mask]


# ─────────────────────────────────────────────────────────────
# VISUALIZATION HELPERS
# ─────────────────────────────────────────────────────────────

def make_meshgrid(X, h=0.05, margin=0.5):
    """
    Tạo lưới điểm 2D để vẽ decision boundary.
    
    Args:
        X      : dữ liệu để xác định phạm vi
        h      : bước lưới (nhỏ hơn → mịn hơn)
        margin : khoảng mở rộng ngoài biên dữ liệu
    
    Returns:
        xx, yy : meshgrid 2D
    """
    x_min = X[:, 0].min() - margin
    x_max = X[:, 0].max() + margin
    y_min = X[:, 1].min() - margin
    y_max = X[:, 1].max() + margin
    
    xx = np.arange(x_min, x_max, h)
    yy = np.arange(y_min, y_max, h)
    return np.meshgrid(xx, yy)


def predict_meshgrid(model, xx, yy):
    """
    Dự đoán toàn bộ lưới điểm và reshape lại.
    
    Args:
        model  : SVM model đã train
        xx, yy : meshgrid từ make_meshgrid
    
    Returns:
        Z : decision scores dạng 2D (cùng shape với xx)
    """
    grid_points = np.c_[xx.ravel(), yy.ravel()]
    Z = model.decision_function(grid_points)
    return Z.reshape(xx.shape)


def plot_decision_boundary(ax, model, X, y, title,
                           show_sv=True, h=0.08):
    """
    Vẽ decision boundary + margin + support vectors lên axes.
    
    Args:
        ax      : matplotlib axes
        model   : SVM đã train
        X, y    : dữ liệu
        title   : tiêu đề subplot
        show_sv : có highlight Support Vectors không
        h       : độ mịn lưới
    """
    COLORS = ['#FF6B6B', '#4ECDC4']
    
    xx, yy = make_meshgrid(X, h=h)
    Z = predict_meshgrid(model, xx, yy)
    
    # Vùng màu nền theo decision scores
    ax.contourf(xx, yy, Z, alpha=0.25, levels=50,
                cmap=plt.cm.RdYlGn)
    
    # Decision boundary (Z=0) và margin (Z=±1)
    ax.contour(xx, yy, Z, levels=[-1, 0, 1],
               linestyles=['--', '-', '--'],
               colors=['#E74C3C', '#2C3E50', '#3498DB'],
               linewidths=[1.5, 2.5, 1.5])
    
    # Vẽ điểm dữ liệu
    for cls, color, marker in zip([0, 1], COLORS, ['o', 's']):
        mask = y == cls
        ax.scatter(X[mask, 0], X[mask, 1],
                   c=color, s=30, marker=marker,
                   edgecolors='white', linewidths=0.5,
                   alpha=0.8, zorder=3)
    
    # Highlight Support Vectors
    if show_sv and model.alphas is not None:
        sv_X, sv_y, sv_a = model.get_support_vectors()
        ax.scatter(sv_X[:, 0], sv_X[:, 1],
                   s=120, facecolors='none',
                   edgecolors='gold', linewidths=2,
                   zorder=4, label=f'SVs: {len(sv_X)}')
        ax.legend(fontsize=8, loc='upper right')
    
    ax.set_title(title, fontsize=11, fontweight='bold', pad=8)
    ax.set_xlim(xx.min(), xx.max())
    ax.set_ylim(yy.min(), yy.max())
    ax.tick_params(labelsize=8)
    
    # Thêm accuracy
    acc = model.score(X, y)
    ax.text(0.02, 0.02, f'Acc: {acc:.1%}',
            transform=ax.transAxes, fontsize=8,
            bbox=dict(boxstyle='round,pad=0.3',
                      facecolor='white', alpha=0.7))


# ─────────────────────────────────────────────────────────────
# MAIN: CHẠY TOÀN BỘ LAB
# ─────────────────────────────────────────────────────────────

def plot_sv_detail(ax, model, X, y, title):
    """Vẽ decision boundary + highlight support vectors (margin vs bound)."""
    COLORS = ['#E74C3C', '#3498DB']
    xx, yy = make_meshgrid(X, h=0.07)
    Z = predict_meshgrid(model, xx, yy)

    ax.contourf(xx, yy, Z, alpha=0.15, levels=50, cmap=plt.cm.RdBu_r)
    ax.contour(xx, yy, Z, levels=[-1, 0, 1],
               linestyles=['--', '-', '--'],
               colors=['#E74C3C', '#333333', '#3498DB'],
               linewidths=[1.2, 2.0, 1.2])

    for cls, color in zip([0, 1], COLORS):
        mask = y == cls
        ax.scatter(X[mask, 0], X[mask, 1], c=color, s=25,
                   edgecolors='white', linewidths=0.4, alpha=0.75, zorder=3)

    sv_X, sv_y, sv_a = model.get_support_vectors()
    on_margin = sv_a < model.C - 1e-5
    bounded   = ~on_margin
    if np.any(on_margin):
        ax.scatter(sv_X[on_margin, 0], sv_X[on_margin, 1],
                   s=120, facecolors='none', edgecolors='gold',
                   linewidths=1.8, zorder=5, label=f'Margin SV ({on_margin.sum()})')
    if np.any(bounded):
        ax.scatter(sv_X[bounded, 0], sv_X[bounded, 1],
                   s=120, facecolors='none', edgecolors='orange',
                   linewidths=1.8, zorder=5, label=f'Bound SV ({bounded.sum()})')

    ax.set_title(title, fontsize=10)
    ax.legend(fontsize=8, loc='upper right')
    ax.grid(True, alpha=0.3)
    acc = model.score(X, y)
    ax.text(0.02, 0.02, f'Acc: {acc:.1%}', transform=ax.transAxes,
            fontsize=8, bbox=dict(boxstyle='round,pad=0.2', fc='white', alpha=0.8))


def run_lab():
    print("=" * 60)
    print("Lab 4c: SVM từ đầu - Không dùng sklearn")
    print("=" * 60)

    # Tạo dữ liệu
    print("\n[Bước 1] Tạo dữ liệu...")
    X, y             = make_moons(n_samples=200, noise=0.15, random_state=42)
    X_circ, y_circ   = make_circles(200, noise=0.05, factor=0.5)

    # Reset style về mặc định (trắng, sạch)
    plt.rcdefaults()
    plt.rcParams.update({'figure.facecolor': 'white', 'axes.facecolor': 'white'})

    # ── Layout: 5 hàng ──────────────────────────────────────
    fig, axes = plt.subplots(5, 4, figsize=(16, 20))
    fig.suptitle('Lab 4c: SVM Classification (Python thuần)', fontsize=14, fontweight='bold', y=0.98)

    COLORS = ['#E74C3C', '#3498DB']

    # ── Hàng 1: Dữ liệu thô (2 ô, merge bằng cách bỏ 2 ô còn lại) ─
    for ax in axes[0, 2:]:
        ax.set_visible(False)

    ax_m = axes[0, 0]
    ax_c = axes[0, 1]
    for cls, color in zip([0, 1], COLORS):
        ax_m.scatter(X[y==cls, 0], X[y==cls, 1], c=color, s=25,
                     edgecolors='white', linewidths=0.4, alpha=0.8,
                     label=f'Class {cls}')
        ax_c.scatter(X_circ[y_circ==cls, 0], X_circ[y_circ==cls, 1],
                     c=color, s=25, edgecolors='white', linewidths=0.4, alpha=0.8,
                     label=f'Class {cls}')
    ax_m.set_title('Bước 1: make_moons (phi tuyến)', fontsize=10)
    ax_c.set_title('Bước 1: make_circles (phi tuyến)', fontsize=10)
    ax_m.legend(fontsize=8); ax_m.grid(True, alpha=0.3)
    ax_c.legend(fontsize=8); ax_c.grid(True, alpha=0.3)

    # ── Hàng 2: Linear vs RBF (2 ô) ─────────────────────────
    for ax in axes[1, 2:]:
        ax.set_visible(False)

    print("\n[Bước 2] Linear SVM...")
    svm_lin = SVMFromScratch(C=1.0, kernel='linear', max_iter=100, random_state=42)
    svm_lin.fit(X, y)
    plot_decision_boundary(axes[1, 0], svm_lin, X, y,
                           'Bước 2: Linear SVM (thất bại)', h=0.08)
    axes[1, 0].grid(True, alpha=0.3)

    print("\n[Bước 3] RBF SVM...")
    svm_rbf = SVMFromScratch(C=1.0, kernel='rbf', gamma=1.0, max_iter=200, random_state=42)
    svm_rbf.fit(X, y)
    plot_decision_boundary(axes[1, 1], svm_rbf, X, y,
                           'Bước 3: RBF Kernel SVM (C=1, γ=1)', h=0.08)
    axes[1, 1].grid(True, alpha=0.3)

    # ── Hàng 3: Ảnh hưởng C (4 ô) ───────────────────────────
    C_values = [0.1, 1, 10, 100]
    C_desc   = ['C=0.1 (underfit)', 'C=1', 'C=10', 'C=100 (overfit)']
    print("\n[Bước 4] Thử nghiệm C...")
    for idx, (C_val, desc) in enumerate(zip(C_values, C_desc)):
        print(f"  C={C_val}...", end="")
        m = SVMFromScratch(C=C_val, kernel='rbf', gamma=1.0, max_iter=200, random_state=42)
        m.fit(X, y)
        print(" done")
        plot_decision_boundary(axes[2, idx], m, X, y,
                               f'Bước 4: {desc}\n(γ=1.0 cố định)', h=0.10)
        axes[2, idx].grid(True, alpha=0.3)

    # ── Hàng 4: Ảnh hưởng gamma (3 ô) ───────────────────────
    for ax in [axes[3, 3]]:
        ax.set_visible(False)

    gamma_values = [0.1, 1, 10]
    gamma_desc   = ['γ=0.1 (underfit)', 'γ=1', 'γ=10 (overfit)']
    print("\n[Bước 5] Thử nghiệm gamma...")
    for idx, (g_val, desc) in enumerate(zip(gamma_values, gamma_desc)):
        print(f"  gamma={g_val}...", end="")
        m = SVMFromScratch(C=1.0, kernel='rbf', gamma=g_val, max_iter=200, random_state=42)
        m.fit(X, y)
        print(" done")
        plot_decision_boundary(axes[3, idx], m, X, y,
                               f'Bước 5: {desc}\n(C=1.0 cố định)', h=0.10)
        axes[3, idx].grid(True, alpha=0.3)

    # ── Hàng 5: Support Vectors (2 ô) ────────────────────────
    for ax in axes[4, 2:]:
        ax.set_visible(False)

    print("\n[Bước 6] Support Vectors...")
    svm_sv1 = SVMFromScratch(C=10, kernel='rbf', gamma=1.0, max_iter=200, random_state=42)
    svm_sv1.fit(X, y)
    plot_sv_detail(axes[4, 0], svm_sv1, X, y,
                   'Bước 6: Support Vectors — make_moons (C=10, γ=1)')

    svm_sv2 = SVMFromScratch(C=10, kernel='rbf', gamma=1.0, max_iter=200, random_state=42)
    svm_sv2.fit(X_circ, y_circ)
    plot_sv_detail(axes[4, 1], svm_sv2, X_circ, y_circ,
                   'Bước 6: Support Vectors — make_circles (C=10, γ=1)')

    plt.tight_layout(rect=[0, 0, 1, 0.97])

    import os
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lab4c_svm_results.png')
    plt.savefig(output_path, dpi=120, bbox_inches='tight')
    plt.close()

    print(f"\n✅ Đã lưu: {output_path}")
    return output_path


if __name__ == '__main__':
    run_lab() 