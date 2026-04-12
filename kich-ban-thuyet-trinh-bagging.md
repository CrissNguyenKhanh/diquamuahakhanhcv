# Kịch bản thuyết trình: Bagging (tuần tự)

> Dùng song song với `thuyet-trinh-bagging.md`. Mỗi **Bước** ≈ một nhịp trình bày; có thể ghép/bớt tùy thời lượng (gợi ý: cả bài ~15–25 phút nếu đọc đủ; rút gọn bỏ bước 8 hoặc 17–18).

---

## Bước 0 — Chào & dẫn nhập (~30 giây)

Hôm nay mình nói về **Bagging** — tức *Bootstrap Aggregating*. Trước khi vào thuật toán, mình cần **cùng thống nhất** hai khái niệm: **bias** và **variance**, vì hiểu nhầm chỗ này thì dễ tưởng Bagging là “làm mô hình thông minh hơn” theo nghĩa không đúng.

---

## Bước 1 — Bias và Variance: nói cho rõ (~1,5–2 phút)

**Bias** — hay **độ lệch** — là mức mà mô hình **hiểu sai có hệ thống** so với quy luật thật của dữ liệu. Nói ngắn gọn: **bias càng thấp càng tốt**, vì ta muốn bám sát “bản chất” đúng của bài toán.

**Variance** — **phương sai**, trực giác là độ **“rung lắc”**: chỉ cần đổi tập train một chút mà **cấu trúc mô hình hoặc dự đoán đổi mạnh**, thì variance đang cao. Variance **cao quá** thường đi kèm việc mô hình **học cả nhiễu**, train rất tốt nhưng **test thất thường** — tức overfitting.

Mình **không** nói “variance cao thì học càng tốt.” Đúng hơn: ta cần **kiểm soát** variance. Trong Bagging, ý tưởng là **gộp nhiều dự đoán** để **làm mượt** dao động ngẫu nhiên — **giảm variance của kết quả tổng hợp**, chứ không phải cổ vũ mô hình “càng lung tung càng hay.”

**Câu gối đầu giường:** Bias thấp là hiểu đúng bản chất; Bagging chủ yếu giúp **ổn định** bằng **trung bình** hoặc **bỏ phiếu**.

---

## Bước 2 — Vì sao tên là Bagging? (~45 giây)

**Bagging** tách ra là hai từ: **Bootstrap** và **Aggregating**.

- **Bootstrap:** từ dữ liệu gốc, ta **lấy mẫu nhiều lần**, thường **có hoàn lại**, mỗi lần ra một tập con — mỗi tập **huấn luyện một mô hình con**.

- **Aggregating:** sau đó **gộp** lại: hồi quy thì **trung bình**, phân loại thì **bỏ phiếu đa số**.

Tên đã nói gần hết pipeline.

---

## Bước 3 — Nguồn gốc: không phải “AI hiện đại” mới có (~45 giày–1 phút)

Nguồn gốc **xa nhất** của ý tưởng **bootstrap** là **thống kê**. Năm **1979**, Bradley Efron giới thiệu bootstrap trong bài *Bootstrap Methods: Another Look at the Jackknife* — dùng **resampling** để ước lượng sai số, phân phối, phương sai… Sau này **Leo Breiman** đưa bootstrap vào học máy và hình thành **Bagging**. Như vậy Bagging **bắt nguồn từ tư duy thống kê**.

---

## Bước 4 — Cơ chế: không “phát minh” learner mới (~1 phút)

Bagging **không** bắt buộc phải là một thuật toán học hoàn toàn mới. Ta chọn **một loại mô hình gốc** — ví dụ **cây quyết định** — gọi là **base learner** hay **estimator**. Sau đó **lặp** nó nhiều lần trên **các bootstrap khác nhau**, rồi **vote** hoặc **average**.

Nói một dòng: **nhiều mẫu → nhiều mô hình cùng kiểu → một kết quả gộp**.

---

## Bước 5 — Estimator là gì? (~45 giây)

Trong ensemble, **estimator** là mô hình **gốc** mà mình **sao chép ý tưởng** nhiều lần — cùng **class**, mỗi lần train trên **data khác**.

Ví dụ trong scikit-learn mình truyền `estimator=DecisionTreeClassifier()`: thư viện sẽ tạo **nhiều cây**, mỗi cây một bootstrap, cuối cùng **bỏ phiếu**. Tham số `n_estimators` là số mô hình con; `n_jobs=-1` là nhờ máy **chia ra nhiều lõi** để train.

---

## Bước 6 — Training song song: vì sao Bagging làm được? (~1,5 phút)

Trong Bagging, **training song song** nghĩa là: các mô hình con **huấn luyện độc lập**, **không chờ** nhau.

Bootstrap 1 → cây 1; bootstrap 2 → cây 2. Cây 1 **không** cần biết cây 2 học gì, **không** sửa theo lỗi của cây 2. Vì vậy ta có thể bắt **mười cây cùng lúc trên mười lõi**, rồi tiếp tục đợt sau — **thời gian train giảm rõ**.

**Vì sao song song được?** Vì **độc lập**. Không có kiểu “model sau học từ lỗi model trước.”

**So với Boosting** — đây chỗ hay ra đề: Boosting thường **chuỗi** vì model sau **phụ thuộc** model trước, phải biết **chỗ nào sai** để tăng trọng hoặc sửa residual — nên **khó song song hoàn toàn** bằng Bagging.

---

## Bước 7 — Dòng thời gian Breiman (tùy chọn, ~45 giây–1 phút)

**1994:** Breiman, báo cáo *Bagging Predictors*.  
**1996:** bài báo chính thức trên *Machine Learning*.  
**1996–1997:** **Out-of-bag** để ước lượng lỗi tổng quát hóa.  
**1999:** bài về **Pasting** / bỏ phiếu khi dữ liệu rất lớn.  
**2001:** **Random Forest** — bootstrap **cộng** với **random hóa đặc trưng** mỗi lần split, giảm variance mạnh hơn nữa.

Mình chỉ cần nhớ: Bagging là **một mắt xích**, Random Forest là **mở rộng tự nhiên**.

---

## Bước 8 — Ensemble Learning vs Bagging (~1 phút)

**Ensemble learning** là khái niệm **rất rộng**: nhiều model **giống hoặc khác**, train **song song hoặc tuần tự**, gộp bằng vote, average, hay meta-model…

**Bagging** chỉ là **một biến thể đặc biệt**: cùng **một kiểu** base learner, **bootstrap** để tạo đa dạng, train **độc lập**, mục tiêu thiết kế là **giảm variance một cách gọn — dễ phân tích**.

Có bạn hỏi: “Sao không trộn Tree + SVM + Neural Net cho ensemble?” — **làm được**, nhưng **không còn là Bagging cổ điển**. Lúc đó sai số **không cùng bản chất**, khó nói đang giảm variance hay bias. Bagging chọn **cùng estimator** để **kiểm soát** được lời hứa của phương pháp.

---

## Bước 9 — Trọng tâm: Bagging giảm variance (~1 phút)

**Bias** là lệch **hệ thống**. **Variance** là **nhạy** với dữ liệu train.

Bagging **trung bình** hoặc **vote** nhiều dự đoán → các lệch ngẫu nhiên **triệt tiêu một phần** → kết quả **mượt**, **ổn định** hơn một model đơn.

**Ví dụ số:** Năm model dự đoán 10, 14, 9, 13, 11. Nếu **tình cờ** chỉ dùng một model và gặp **14**, có thể lệch nhiều. **Trung bình** là 11,4 — **ổn định hơn**. Đó chính là trực giác “**làm mượt**.”

---

## Bước 10 — Phương sai cao: mô hình thất thường (~45 giây)

Phương sai cao thì hôm nay train ra **cây này**, mai đổi vài điểm là **cây khác** — dự đoán trên data mới **lung lay**. Gần với overfitting: khớp train quá sát, kể cả nhiễu.

---

## Bước 11 — “Ranh giới quyết định bị rung lắc” (~1 phút)

**Decision boundary** là ranh giới phân lớp. Với **cây quyết định**, ranh giới thường là **các cắt trục** — kiểu “x1 nhỏ hơn 5”, “x2 lớn hơn 2 phẩy 3.”

**Rung lắc** nghĩa là: dữ liệu train đổi **một chút** → **ngưỡng split** đổi → ranh giới **dịch** → cùng một điểm có thể **đổi dự đoán**. Đó là hình ảnh trực quan của **high variance**.

---

## Bước 12 — Vì sao Decision Tree đặc biệt nhạy? (~1 phút)

Cây xây bằng cách chọn **feature và ngưỡng tốt nhất** từng bước. Chỉ cần data đổi nhẹ, **thứ tự feature tốt nhất** có thể đổi — ví dụ lần một split đầu theo **tuổi**, lần hai lại theo **thu nhập**. **Gốc đổi** thì **toàn bộ nhánh sau đổi** — không chỉ số lẻ mà **cả cấu trúc cây**.

Ví dụ điểm toán: lúc đầu ngưỡng 5.0, thêm vài điểm nhiễu thành 5.4 — vùng 5.0 đến 5.4 **đảo nhãn**. Đó là **rung lắc**. Vì vậy người ta nói **cây quyết định thường high variance** — **đối tượng lý tưởng** cho Bagging.

---

## Bước 13 — Bagging “chữa” rung lắc ra sao? (~45 giây–1 phút)

Mỗi cây học trên **một bootstrap** — nhiễu **không cùng hướng**. Khi **vote** hoặc **average**, phần dao động **xấp xỉ triệt tiêu** — ranh giới **tổng thể** ổn định hơn.

Nhưng nhấn mạnh: Bagging **làm mượt**, **không** tự nhiên biến mô hình **hiểu sâu hơn** về bias nếu base learner **quá sai cấu trúc**.

---

## Bước 14 — Vì sao Bagging **không** chủ đích giảm bias? (~1,5 phút)

Ví dụ kinh điển: quy luật thật là **parabol** y bằng x bình, mà ta chỉ dùng **đường thẳng** y bằng a x cộng b. Dù train **trăm** đường thẳng trên **trăm** bootstrap rồi **trung bình**, kết quả vẫn là **một đường thẳng** — **không** thành đường cong. Đó là **bias cao**; Bagging **không sửa** được **sai bản chất** đó.

**Boosting** khác: **học tuần tự từ lỗi** — model một sai chỗ A, model hai tập trung sửa A… — thường phù hợp hơn cho kịch bản **giảm bias** có chủ đích.

Đôi khi sau Bagging **accuracy tăng** khiến ta **tưởng** bias giảm — nhiều khi thực chất là **variance giảm** nên lỗi tổng thể giảm. Trong một số trường hợp base model **không quá yếu**, bias có thể giảm **nhẹ** — nhưng **không** phải định nghĩa cốt lõi của Bagging.

---

## Bước 15 — Bootstrap có hoàn lại: ý nghĩa (~1 phút)

Từ một tập gốc, mỗi bootstrap **lấy có hoàn lại** → các tập con **khác nhau**: có **lặp** điểm, có **thiếu** điểm. **Không** phải tạo điểm mới ngoài vũ trụ dữ liệu — chỉ **tái tổ hợp** mẫu quan sát.

Mỗi mô hình con thấy một **“góc nhìn”** khác → lỗi **không đồng bộ** → khi gộp, phần ngẫu nhiên **triệt tiêu** → **giảm variance**. Câu “một tập dữ liệu như một thế giới nhỏ” dùng để **nhớ trực giác** nhiều phiên bản mẫu khác nhau từ cùng nguồn.

---

## Bước 16 — Pasting và scikit-learn (~45 giây)

**Pasting** hiện đại thường hiểu gần Bagging nhưng **không hoàn lại** khi lấy subsample. Trong sklearn, **`bootstrap=True`** là Bagging và có **OOB**; **`bootstrap=False`** thường gắn với kiểu **pasting**. Cả hai đều thuộc tư duy **perturb-and-combine**: làm nhiễu cách lấy dữ liệu rồi **kết hợp** predictor.

---

## Bước 17 — So với kNN — vì sao Breiman thấy Bagging “không ăn thua” mấy? (~1 phút)

Trong paper gốc, với **cây**, Bagging giảm lỗi test **đáng kể** trên nhiều bộ dữ liệu. Với **k-nearest neighbors**, cải thiện **gần như không có** — vì kNN thường **ổn định** hơn cây, **variance** không phải vấn đề chính như cây.

Trực giác: bootstrap chủ yếu **đổi tập điểm**; **vị trí tương đối** trong không gian đặc trưng ít đổi → các bản kNN từ các bootstrap thường **dự đoán giống nhau** → **gộp ít lợi**. Cây thì **đổi cấu trúc** dễ → Bagging **phát huy**.

---

## Bước 18 — Out-of-Bag (OOB): giải thích nhanh (~1 phút)

Với n điểm, lấy n lần **có hoàn lại**: xác suất một điểm **không** được chọn trong **một** bootstrap khoảng **một phần e**, tức **khoảng 36,8 phần trăm**.

Điểm “không nằm” trong mẫu huấn luyện của cây k là **OOB** đối với cây đó. Khi đánh giá điểm x, ta chỉ lấy **những cây chưa từng thấy x trong tập train của chúng** để dự đoán x — gần như **giữ lại x làm test nội bộ**. Gom lại cả tập → có **ước lượng lỗi** mà không cần tách validation riêng — **tiện**, nhưng vẫn cần hiểu **giới hạn** so với test độc lập hoàn toàn.

---

## Bước 19 — Kết luận (~45 giày–1 phút)

**Bagging** = **Bootstrap** + **Aggregating**. **Mục tiêu chính:** **giảm variance**, **ổn định** dự đoán, đặc biệt mạnh với **cây quyết định** vì cây **high variance**, ranh giới **dễ rung**. **Không** thay thế việc chọn đúng **độ phức tạp** và **đúng họ** mô hình để giảm **bias**. So với **Boosting**: Bagging **độc lập**, **song song**; Boosting **chuỗi**, **học lỗi**. **OOB** tận dụng ~36,8% điểm “out” mỗi bootstrap để **đánh giá nhanh**.

Cảm ơn mọi người — nếu có câu hỏi về **Random Forest** hoặc **so sánh thêm với Stacking**, mình có thể nối tiếp.

---

## Gợi ý điều tiết thời gian

| Nếu chỉ có ~10 phút | Bỏ hoặc rất ngắn: Bước 7, 16, 18; gộp Bước 11–12. |
|---------------------|-----------------------------------------------------|
| Nếu có ~20 phút     | Giữ đủ Bước 1–6, 8–15, 19. |
| Nếu có ~25+ phút    | Đọc full, nhấn Bước 6 (Boosting), 14 (bias), 17 (kNN), 18 (OOB). |
