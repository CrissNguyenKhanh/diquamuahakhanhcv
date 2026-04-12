# Thuyết trình: Bagging (Bootstrap Aggregating)

> Gợi ý trình chiếu: mỗi khối `---` có thể tách thành một slide (Marp / Reveal.js) hoặc giữ nguyên một tài liệu dài.

---

## 1. Mở đầu: Bias–Variance (đọc đúng vai trò)

- **Bias (độ lệch)**  
  Mức độ mô hình **hiểu sai có hệ thống** so với quy luật thật của dữ liệu.  
  **Càng thấp càng tốt** (trong giới hạn tránh overfit).

- **Variance (phương sai / độ “rung lắc”)**  
  Mức độ mô hình **nhạy** với dữ liệu huấn luyện: đổi train một chút là dự đoán đổi mạnh.

- **Không nhầm:** “Variance cao = học càng tốt.”
  - Variance **cao quá** thường gắn với **học cả nhiễu (noise)** → overfitting, test kém.
  - Trong **ensemble**, ta muốn các mô hình con **khác nhau một cách hữu ích** (đa dạng), rồi **gộp** để **làm mượt** dao động — đó là chỗ Bagging can thiệp: **giảm variance của dự đoán tổng hợp**, không phải “càng lung tung càng hay.”

**Câu gọn:** Bias thấp là mục tiêu hiểu đúng bản chất; variance cần được **kiểm soát** — Bagging giúp **ổn định** kết quả bằng trung bình / bỏ phiếu.

---

## 2. Tên gọi: BAGGING = **Bootstrap** + **Aggregating**

| Phần            | Ý nghĩa                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------- |
| **Bootstrap**   | Lấy nhiều mẫu con từ dữ liệu gốc (thường **có hoàn lại**), mỗi mẫu huấn luyện một mô hình con. |
| **Aggregating** | Gộp dự đoán: **trung bình** (hồi quy) hoặc **bỏ phiếu đa số** (phân loại).                     |

---

## 3. Nguồn gốc (không bắt đầu từ “deep learning”)

- **1979 — Bradley Efron:** _Bootstrap Methods: Another Look at the Jackknife._  
  Bootstrap trong **thống kê**: resampling để ước lượng sai số, phân phối lấy mẫu, phương sai…  
  Đây là nền tảng để sau này **Leo Breiman** hình thành **Bagging**.

---

## 4. Cơ chế cốt lõi (không phải thuật toán “mới” hoàn toàn)

- Dùng **một loại mô hình gốc (base learner / estimator)** — ví dụ cùng là cây quyết định.
- **Không** phải lúc nào cũng “phát minh” một learner mới; Bagging **lặp** learner đó trên **nhiều tập bootstrap khác nhau**, rồi **gộp** kết quả.

**Pipeline trực giác:**  
`Bootstrap sample 1 → train model 1`  
`Bootstrap sample 2 → train model 2`  
… → `Vote / Average` → dự đoán cuối.

---

## 5. Estimator là gì? (trong ngữ cảnh ensemble)

- **Estimator** = mô hình học máy **gốc** mà bạn **lặp lại** nhiều lần (cùng kiểu), mỗi lần học trên một tập con khác nhau.

**Ví dụ scikit-learn:**

```python
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

model = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100,
    n_jobs=-1,
)
```

- `estimator=DecisionTreeClassifier()`: đó chính là **estimator** — Bagging tạo **nhiều cây**, mỗi cây học trên **một bootstrap khác**, cuối cùng **bỏ phiếu** (phân loại).

---

## 6. Training song song — vì sao Bagging làm được?

**Ý:** Các mô hình con **độc lập**, **không** cần chờ nhau.

- Bootstrap 1 → cây 1; bootstrap 2 → cây 2; …
- Cây 1 **không** sửa theo lỗi của cây 2.
- Có thể train **đồng thời** nhiều lõi CPU / nhiều máy.

**`n_jobs=-1`:** nhờ thư viện chia việc train các estimator ra nhiều lõi.

**Song song thường mạnh ở:**

1. Bước **train** từng estimator.
2. Có thể tối ưu cả bước **predict** (mỗi cây dự đoán riêng rồi gom).

**Một câu nhớ:** Bagging song song được vì **học độc lập trên các mẫu khác nhau**, không phụ thuộc chuỗi như boosting.

---

## 7. So với Boosting (hay ra đề)

|                | **Bagging**                                   | **Boosting**                                                             |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| Thứ tự         | Các model **độc lập**, có thể **song song**.  | Model sau **phụ thuộc** model trước (sai chỗ nào → tập trung sửa).       |
| Gộp            | Vote / trung bình sau khi mọi thứ train xong. | Chuỗi chỉnh trọng số / residual — thường **tuần tự** hơn.                |
| Mục tiêu chính | **Giảm variance** (ổn định).                  | Thường hướng tới **giảm bias** / tăng độ chính xác qua các vòng sửa lỗi. |

**Ví dụ tài nguyên:** 100 cây, 10 lõi → mỗi lõi gánh một phần cây, xoay vòng đến hết.

---

## 8. Dòng thời gian (Breiman và kế thừa)

- **1994:** Breiman — technical report _Bagging Predictors_.
- **1996:** Xuất bản chính thức trên _Machine Learning_, Vol. 24, pp. 123–140.
- **1996/1997:** Phát triển **out-of-bag (OOB)** để ước lượng lỗi tổng quát hóa.
- **1999:** _Pasting Small Votes…_ — dữ liệu lớn / học trực tuyến.
- **2001:** Hướng **Random Forest**: bootstrap + **ngẫu nhiên hóa đặc trưng** ở mỗi split → giảm variance mạnh hơn nữa.

---

## 9. Ensemble Learning vs Bagging

- **Ensemble learning** = khái niệm **rộng**: nhiều model giống hoặc khác, train song song hoặc tuần tự, gộp bằng vote / average / meta-model…
- **Bagging** = **một trường hợp đặc biệt** của ensemble:
  - Cùng **một kiểu** base learner,
  - **Bootstrap** để tạo đa dạng,
  - **Độc lập**,
  - Mục tiêu thiết kế: **giảm variance một cách “sạch”** (dễ phân tích).

**Vì sao thường dùng cùng một loại model?**  
Nếu trộn Tree + SVM + Neural Net, sai số **không cùng bản chất** → khó nói đang giảm variance hay bias hay “may mắn”. Bagging **kiểm soát** được hành vi lỗi khi các base learner **cùng học**.

_(Bagging “không thể” dùng nhiều model khác — **không phải** bất khả thi kỹ thuật, mà **định nghĩa cổ điển** chọn cùng estimator để đạt mục tiêu variance.)_

---

## 10. Mục tiêu chính của Bagging: **giảm variance**

- **Bias:** mức độ **lệch có hệ thống** so với quy luật thật.
- **Variance:** độ **nhạy** với dữ liệu train — đổi mẫu là đổi mạnh dự đoán.

Bagging **trung bình / vote** nhiều dự đoán → **làm mượt** dao động ngẫu nhiên giữa các model con → **ổn định** hơn so với một model đơn lẻ “may gặp mẫu xấu.”

**Trực giác số (ví dụ hồi quy):**  
5 model dự đoán: 10, 14, 9, 13, 11 → trung bình **11.4** ổn định hơn so với **chỉ chọn một** (vd. nhầm chọn 14).

---

## 11. Phương sai cao → mô hình “thất thường”

- Phương sai cao → **rất nhạy** với train: hôm nay cây này, mai đổi vài điểm là cây khác.
- Liên hệ **overfitting**: khớp train kể cả nhiễu → test lung lay.
- Có thể nối với **phương sai của dự đoán** (suy biến) → lý do cần **ổn định hóa** bằng ensemble.

---

## 12. “Ranh giới quyết định bị rung lắc” (Decision boundary)

- **Decision boundary** = ranh giới tách lớp (một phía lớp A, một phía lớp B).
- Với **cây quyết định**, ranh giới thường là các **cắt trục** dạng \(x_1 < 5\), \(x_2 > 2.3\) (thẳng đứng / ngang).
- **Rung lắc:** chỉ cần dữ liệu train đổi nhẹ → **ngưỡng split** đổi → ranh giới **dịch chuyển** → dự đoán lung lay.

---

## 13. Vì sao Decision Tree “high variance”?

- Cây chọn **feature / ngưỡng tốt nhất** từng bước; đổi dữ liệu nhẹ có thể:
  - đổi **split đầu tiên** (vd. lần 1: theo **tuổi**, lần 2: theo **thu nhập**),
  - **gốc khác → toàn bộ nhánh sau khác → luật phân loại khác → output khác.**
- Không chỉ ngưỡng rung — **cả cấu trúc cây** có thể đổi.

**Ví dụ điểm số:** Luật đậu/rớt theo điểm toán; thêm vài điểm nhiễu → split tốt nhất nhảy từ `< 5.0` sang `< 5.4` → học sinh khoảng 5.0–5.4 bị **đảo nhãn** → đó là **variance / rung lắc**.

---

## 14. Bagging xử lý “rung lắc” thế nào?

- Mỗi cây học trên **một bootstrap** → lệch theo **hướng nhiễu khác nhau**.
- **Trung bình / vote** → các lệch **triệt tiêu một phần** → ranh giới **tổng thể mượt và ổn định** hơn.
- Cây đơn thường dễ **overfit** (variance cao); Bagging **giảm variance** của ensemble.

**Lưu ý:** Bagging **không làm “thông minh hơn”** một cách có chủ đích về bias — nó **làm mượt kết quả**.

---

## 15. Vì sao Bagging **không** (chủ yếu) giảm bias?

- Nếu base learner **sai bản chất** (vd. dữ liệu là \(y = x^2\) mà chỉ dùng **đường thẳng** \(y = ax + b\)):  
  train 100 đường thẳng rồi **trung bình** vẫn là **đường thẳng** — **không học được đường cong** → **bias vẫn cao.**
- **Boosting** (học từ lỗi, tuần tự sửa) phù hợp hơn cho kiểu **giảm bias** có chủ đích.
- Bagging: **học độc lập**, không vòng “M1 sai A → M2 sửa A.”

**Đôi khi** performance tổng thể tốt lên khiến **cảm giác** bias giảm — thực chất thường là **variance giảm → lỗi giảm**, không phải cơ chế chính của Bagging.

**Khi nào bias có thể giảm nhẹ?** Base model **không quá yếu**, bootstrap tạo **đa dạng đủ** — vẫn **không** phải định nghĩa cốt lõi của Bagging.

---

## 16. Bootstrap có hoàn lại — vì sao quan trọng?

- Từ tập gốc, mỗi lần lấy **có hoàn lại** → các tập con **khác nhau** (có lặp, có thiếu điểm).
- **Không tạo** điểm mới ngoài phân phối quan sát — chỉ **tổ hợp lại** để mỗi model thấy một **“góc nhìn”** khác → lỗi không hoàn toàn đồng pha → khi gộp, **phần ngẫu nhiên triệt tiêu** → **giảm variance**.

_(Nếu ví dụ trong ghi chú có ký tự lạ như `[a,c,d,e]` trong khi tập chỉ có `a,b,c,d` — đó là lỗi đánh máy; đúng là chỉ **resample từ tập gốc**.)_

---

## 17. Pasting và sklearn: `bootstrap=True` / `False`

- **Pasting** (trong tài liệu hiện đại, vd. sklearn): lấy mẫu con **không hoàn lại** (hoặc cơ chế tương đương “pasting” so với bagging).
- **Bagging:** `bootstrap=True` — có hoàn lại → có **OOB** (xem dưới).
- **Breiman** còn mô tả biến thể kiểu **Rvotes / Ivotes** trong bài về pasting / bỏ phiếu trên dữ liệu lớn.

**Góc học thuật:** Bagging & Pasting đều thuộc **perturb-and-combine** — làm nhiễu quy trình / dữ liệu để có nhiều predictor rồi kết hợp.

---

## 18. So sánh với kNN (Breiman & trực giác)

- Trong bài gốc, với **cây**, Bagging giảm lỗi test đáng kể (classification ~20–47% tùy bộ; regression MSE ~22–46% trong các thí nghiệm của Breiman).
- Với **kNN**, Bagging **gần như không cải thiện** — vì kNN tương đối **ổn định** (variance thấp hơn cây trong nhiều tình huống), ít “chất” để bagging làm mượt.

**Trực giác:** Bootstrap chủ yếu **thay đổi tập điểm**, còn **không gian đặc trưng / khoảng cách tương đối** giữa các điểm vẫn gần như cũ → với kNN, nhiều bản bootstrap cho **dự đoán rất giống nhau** → gộp ít lợi. (Một số trường hợp biên vẫn có thể tăng nhẹ performance, nhưng **không** phải đối tượng điển hình như cây.)

---

## 19. Out-of-Bag (OOB) — là gì và dùng để “test” thế nào?

- Với \(n\) điểm, lấy bootstrap \(n\) lần có hoàn lại: xác suất một điểm **không** xuất hiện trong một bootstrap khoảng **\(e^{-1} \approx 36.8\%\)**.
- Những điểm **không nằm** trong mẫu bootstrap của cây \(k\) là **OOB** đối với cây đó.

**Đánh giá giống validation:**  
Với điểm dữ liệu \(x\), chỉ dùng các **cây đã không train trên \(x\)** để dự đoán \(x\) → gần như **“chưa thấy”** \(x\) lúc train → tương tự một tập kiểm tra nội bộ, không cần tách hold-out riêng (tiện nhưng có giới hạn so với test độc lập hoàn toàn).

---

## 20. Tóm tắt một trang

| Nội dung        | Ý chính                                                            |
| --------------- | ------------------------------------------------------------------ |
| Tên             | **Bootstrap** + **Aggregating**                                    |
| Mục tiêu        | **Giảm variance**, ổn định dự đoán                                 |
| Base learner    | Thường **cùng loại** (vd. cây) để **kiểm soát** phân tích lỗi      |
| So với Boosting | Bagging **độc lập / song song**; Boosting **chuỗi / học lỗi**      |
| So với kNN      | kNN **ổn định** → Bagging ít tác dụng; **cây** nhạy → Bagging mạnh |
| Bias            | **Không** sửa sai “bản chất” của mô hình quá đơn giản              |
| OOB             | ~36.8% điểm “thiếu” trong một bootstrap — dùng để ước lượng lỗi    |

---

## 21. Gợi ý hình minh họa (từ tài liệu của bạn)

- Trung bình 5 dự đoán → kết quả **mượt** hơn một model đơn.
- Đường thẳng vs parabol → Bagging **không** thay đổi họ **sai cấu trúc**.
- Ensemble rộng vs Bagging hẹp — slide “Bagging là trường hợp đặc biệt.”
- Decision boundary dạng cắt trục **rung** khi đổi dữ liệu.

---

_File soạn cho thuyết trình — có thể chuyển sang PowerPoint/Google Slides bằng cách mỗi `---` = một slide._
