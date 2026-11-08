# Ôn thi HC-KT 2026 — web app luyện thi Đội tuyển

Ứng dụng web ôn luyện cho **Thi Đội tuyển** trong Hội thi tập trung ngành Hậu cần –
Kỹ thuật năm 2026: ghi nhớ **244 câu hỏi trắc nghiệm** (8 ngành), ôn trọng tâm
**80 câu nguyên văn của 4 "Bộ đề" mô phỏng thi Đội tuyển**, và mô phỏng đúng
cấu trúc, thời gian, cách tính điểm của **Vòng sơ khảo** và **Vòng chung khảo**
theo Quy chế Hội thi (Điều 12–15).

**URL công khai:** http://139.180.211.252/

> VPS trước đó (80.241.217.122) đã mất; dự án được khôi phục từ GitHub
> (`https://github.com/imtoiteu/HCKT.git`) sang VPS mới ngày 05/11/2026. Không
> có bản sao cục bộ nào mới hơn commit `990b8c6` trên GitHub, nên phần sửa quy
> chế/nội dung kể từ 31/10/2026 (nếu có) được thực hiện lại trong lần khôi phục
> này — xem mục "Nhật ký khôi phục 05/11/2026" bên dưới.

> **Phạm vi:** ứng dụng phục vụ riêng phần **Thi Đội tuyển**. Quy chế còn mô tả
> "Thi Chủ nhiệm HC-KT" (bảo vệ kế hoạch cá nhân, không phải trắc nghiệm) và chấm
> điểm đơn vị (Mục I) — hai phần này **chưa** được xây dựng vì nằm ngoài phạm vi đã
> xác nhận và/hoặc thiếu căn cứ văn bản đầy đủ, xem mục "Quy chế & giới hạn dữ liệu"
> bên dưới.

---

## Nguồn dữ liệu

| Tệp gốc | Vai trò |
|---|---|
| `Bo_cau_hoi_Hoi_thi_0001.pdf` (53 trang) | 228 câu trắc nghiệm gốc + đáp án |
| `Thang_cham_diem_Hoi_thi_0001.pdf` (23 trang) | Phụ lục thang điểm chấm **đơn vị chính quy** (Mục I) — không áp dụng trực tiếp cho Đội tuyển, đưa vào tab "Quy chế" dưới dạng ảnh quét đầy đủ để tham khảo |
| `CamScanner 31-10-26 12.43.pdf` (5 trang, đánh số gốc 4–8) | Trích Điều 11–15 Quy chế Hội thi — căn cứ duy nhất cho cấu trúc/thời gian/cách tính điểm của tab "Đội tuyển"; ảnh quét ở `public/ref/dt-01..05.jpg` |
| `CamScanner 5-11-26 07.17.pdf` (16 trang, không nằm trong repo — chỉ xử lý cục bộ trên VPS) | 4 "Bộ đề" mô phỏng thi Đội tuyển (mỗi bộ 20 câu: Khởi động 5 + Tăng tốc 5 + Gói riêng 5 + Gói chung 5). Đối chiếu từng câu với 228 câu trên cho thấy **64/80 câu trùng nội dung/đáp án** với ngân hàng cũ (chỉ khác cách rút gọn câu hỏi) — không nhập lại các câu này để tránh trùng lặp; **16 câu thực sự mới** đã được thêm vào ngân hàng (xem "Nhật ký khôi phục 05/11/2026"). Bản bóc tách đầy đủ cả 80 câu (kèm chú thích câu nào trùng `dupOf`/`addedAs` câu nào) nằm ở `data/raw/dethi-doituyen-2026-11-05.json` để đối chiếu sau này. |

Cả 3 PDF câu hỏi là bản quét (không có lớp văn bản), nội dung được bóc tách thủ
công theo từng trang/ảnh. Đáp án đúng trong tài liệu gốc được đánh dấu bằng
**gạch chân** (mục I–VII, và toàn bộ `CamScanner 5-11-26`) hoặc dòng
**"\* Đáp án đúng: x"** (mục VIII của `Bo_cau_hoi_Hoi_thi_0001.pdf`).

### Phân bố câu hỏi

| Mục | Ngành | Số câu |
|---|---|---|
| I | Tham mưu | 16 |
| II | Quân nhu | 32 |
| III | Quân y | 22 |
| IV | Doanh trại | 37 |
| V | Xăng dầu | 21 |
| VI | Xe máy – Vận tải | 20 |
| VII | Các chuyên ngành Kỹ thuật | 63 |
| VIII | Truyền thống ngành HC, KT | 33 |
| | **Tổng** | **244** |

### Lưu ý về dữ liệu

- **9 câu có nhiều đáp án đúng** (tài liệu gốc gạch chân/đánh dấu từ 2 ý trở lên):
  I‑10, VII‑1, VII‑34, VII‑43, VII‑49, VII‑53, VIII‑26, VIII‑29, VIII‑30.
  Ứng dụng đánh dấu "Chọn nhiều đáp án" và chỉ tính đúng khi chọn đủ.
- **1 câu không có đáp án trong tài liệu gốc**: **VII‑12**
  (*"Quy định khám sức khỏe định kỳ đối với người lao động làm nghề, công việc
  nặng nhọc, độc hại, nguy hiểm ít nhất?"* — trang 37–38 không gạch chân ý nào).
  Câu này **được loại khỏi mọi lượt luyện tập/thi thử**, chỉ hiển thị trong tab
  "Tra cứu" kèm cảnh báo. Nếu có đáp án chính thức, sửa trường `ans` của
  `VII-12` trong `public/data/questions.json`.
- 16 câu mới từ `CamScanner 5-11-26 07.17.pdf` (ID: VIII‑33, VII‑53..VII‑63,
  II‑31, II-32, IV‑36, IV‑37) hiển thị nguồn là **"Bộ đề Đội tuyển số N (bổ sung
  5/11/2026)"** thay vì "Trang X tài liệu gốc", vì chúng không nằm trong
  `Bo_cau_hoi_Hoi_thi_0001.pdf` 53 trang.
- Toàn bộ 80/80 câu trong `CamScanner 5-11-26 07.17.pdf` đã được đối chiếu lại
  **trực tiếp với từng trang ảnh quét** (không chỉ tra từ khoá) ngày 05/11/2026:
  64 câu trùng chính xác với ngân hàng cũ (`dupOf`), 16 câu mới đã thêm
  (`addedAs`) — không còn câu nào chưa xác định trùng/mới. Xem mục "Ôn 4 đề
  trọng tâm" bên dưới để biết cách toàn bộ 80 câu gốc (kể cả 64 câu trùng) vẫn
  được giữ nguyên, không bị loại bỏ, trong một khu vực ôn tập riêng.

## Tính năng

### Đội tuyển (mô phỏng Hội thi) — tab mới
- **Vòng sơ khảo**: Khởi động (5 câu tự luận, 90s/câu — tính cả thời gian trả
  lời, **chấm tự động**) + Tăng tốc (5 câu trắc nghiệm, 60s/câu) → **Điểm
  ĐT1**/100. Đúng theo Điều 13.2.b, 14.2.a (trang 5–7).
- **Vòng chung khảo**: Gói câu hỏi riêng + Gói câu hỏi chung (mỗi gói 5 câu)
  → cộng vào mốc Điểm ĐT1 gần nhất thành **Điểm ĐT2 ước tính**/100. Đúng theo
  Điều 13.2.b, 14.2.b (trang 6–8). **Điều 13.2.b gọi 2 phần này là "trả lời
  trực tiếp"**, không mô tả là trắc nghiệm/trên máy tính như Khởi động/Tăng
  tốc — mặc định ứng dụng dùng **ô nhập tự do** (không hiện sẵn phương án),
  chấm tự động bằng cùng tiêu chí so khớp chữ ở mục dưới (trừ câu nhiều đáp
  án đúng — tự chấm thủ công). Có thể bật tuỳ chọn **"Ôn có gợi ý"** để hiện
  lại các phương án A/B/C/D in trong bộ đề dưới dạng trắc nghiệm — ứng dụng
  ghi rõ đây **là lựa chọn mô phỏng hỗ trợ học**, quy chế không mô tả hình
  thức chọn đáp án cho 2 phần này nên không được gọi là "đúng quy chế".
- **Đồng hồ đếm ngược bắt buộc, theo đúng quy chế, tính riêng từng câu** (Điều
  13.2.b quy định thời gian theo mỗi câu, không phải cho cả phần thi, nên mỗi
  câu mới hợp lệ có đồng hồ riêng — không phải "reset để gian lận"):
  - Khởi động: 90s/câu, **tính cả thời gian trả lời** (trang 5–6) — không đổi.
  - Tăng tốc: 60s/câu (trang 6) — không đổi.
  - **Gói câu hỏi riêng: 20s là thời gian CHUẨN BỊ trước khi trả lời**, không
    phải hạn nộp bài (trang 6). Màn hình hiện pha "Đang chuẩn bị…" (không có ô
    nhập), hết 20s tự chuyển sang ô trả lời — hoặc bấm "Trả lời ngay" để vào
    sớm hơn. Sau đó **không giới hạn thêm thời gian trả lời** vì quy chế không
    nêu thời lượng trình bày câu trả lời.
  - **Gói câu hỏi chung: 20s là cửa sổ GIÀNH QUYỀN trả lời** (bấm chuông),
    không phải hạn nộp bài (trang 6). Màn hình hiện nút **"🔔 Bấm chuông"**;
    bấm trong 20s để chuyển sang ô trả lời (không giới hạn thêm giờ); hết 20s
    mà chưa bấm thì coi là **không giành được quyền trả lời câu đó** (0đ) —
    quy chế không mô tả bước giành lại quyền cho trường hợp không ai bấm
    chuông, nên không tự suy ra một bước như vậy.
  - Hiển thị cạnh số câu trên thanh điều hướng của bài làm (đổi màu cảnh báo
    khi còn dưới 1/3 thời gian). Hết giờ tự khoá câu, lưu lại bài đã
    làm/đã chọn và tự chuyển bước đúng như khi bấm nộp tay — không mất câu trả
    lời đã nhập. Không bị chậm/dừng khi chuyển tab hay thu nhỏ trình duyệt
    (tính theo mốc thời gian tuyệt đối, không cộng dồn theo số lần tick). Tải
    lại trang giữa lượt mô phỏng không lấy thêm được giờ — toàn bộ trạng thái
    chỉ ở bộ nhớ trình duyệt, tải lại sẽ mất luôn lượt làm đó (có hộp thoại
    cảnh báo trước khi rời/tải lại trang để tránh mất bài do vô ý).
- **Pha "giành lại quyền trả lời" (10s) KHÔNG bị biến thành lượt thử lại của
  chính đội vừa trả lời sai** — Điều 13.2.b mô tả đây là cơ hội cho MỘT ĐỘI
  KHÁC, không phải thêm giờ cho đội đã trả lời sai, nên ứng dụng không tự
  cộng nối 20s + 10s thành 30s cho cùng một lượt. Có tuỳ chọn riêng **"Luyện
  thêm tình huống Giành quyền trả lời (10s)"**: sau khi trả lời sai/không có
  câu trả lời, nếu bật tuỳ chọn này sẽ hiện thêm một bài tập **tách biệt, cần
  bấm mới bắt đầu**, có đồng hồ 10s riêng — kết quả hiển thị riêng, **không**
  cộng vào điểm hay thời gian của câu chính.
- Vì quy chế mô tả thi đấu **nhiều đội cùng lúc** (xếp hạng theo tốc độ, bấm
  chuông giành quyền trả lời), khi luyện một mình ứng dụng chỉ mô phỏng được nội
  dung, thời gian và đúng/sai của riêng người dùng — **không** mô phỏng việc
  tranh chuông/trừ điểm giữa các đội thật sự cùng lúc. Mọi điểm số trong tab
  này là **điểm luyện tập cá nhân**, ứng dụng luôn ghi chú rõ đây không phải
  điểm thi chính thức.
- Câu hỏi được ưu tiên chọn theo hộp Leitner thấp nhất (câu còn yếu) trước.
- Tab "Quy chế" hiển thị nguyên văn bản quét 5 trang làm căn cứ, kèm trích dẫn
  điều/trang cho từng quy tắc hiển thị trong tab Đội tuyển.

#### Chấm tự luận tự động — so khớp CHÍNH XÁC, nhị phân

Áp dụng cho **Khởi động** (Vòng sơ khảo, và phần Khởi động trong mỗi "Bộ đề"
ở tab "Ôn 4 đề trọng tâm") và **Gói câu hỏi riêng/Gói câu hỏi chung** khi
không bật "Ôn có gợi ý" (trừ câu nhiều đáp án đúng — quy chế không mô tả cách
xác định đáp án chuẩn khi phải ghép nhiều ý trắc nghiệm rời rạc thành 1 câu
trả lời tự do, nên các câu này **tự chấm thủ công** bằng 2 nút Đúng/Sai, như
Khởi động từng làm với câu nhiều đáp án).

**Quan trọng — đây là tiêu chí luyện thuộc của ứng dụng, không phải cách BGK
chấm chính thức**: Điều 14.2.a/b chỉ quy định **cơ cấu điểm nhị phân** (đúng
= 10đ, sai = 0đ, không có điểm một phần) — quy chế **không** quy định thuật
toán xác định "đúng/sai" cho câu trả lời trực tiếp bằng lời nói (BGK thực tế
là giám khảo con người, có thể chấp nhận cách diễn đạt khác nghĩa tương
đương). Việc dùng tiêu chí "khớp chính xác từng chữ" dưới đây là **lựa chọn
của ứng dụng** để luyện nhớ đúng câu chữ, được ghi chú rõ trong giao diện.

**Công thức** (xem `normWords`, `lcsAlign`, `wordsEqual`, `gradeRecall` trong
`app.js` — dùng chung cho cả tab "Đội tuyển" và tab "Ôn 4 đề trọng tâm"):
1. Chuẩn hoá cả đáp án chuẩn và câu trả lời: Unicode NFC → chữ thường → bỏ dấu
   câu (`\p{P}`: `. , ; : ! ? ( ) " ' …`, thay bằng khoảng trắng để dấu câu
   dùng ngăn cách từ không làm dính hai từ) → gộp khoảng trắng/tab/xuống dòng
   thừa. **Không bỏ dấu tiếng Việt, không sửa chính tả, không đoán nghĩa.**
2. Tách thành mảng từ theo khoảng trắng, giữ nguyên thứ tự.
3. **Kết quả Đúng/Sai = so khớp CHÍNH XÁC toàn bộ mảng từ** (cùng số từ, cùng
   từng từ, cùng thứ tự) với đáp án chuẩn. Thiếu từ, thừa từ, sai từ, hoặc đảo
   thứ tự từ — tất cả đều tính **Sai**, không có điểm một phần. **Điểm câu hỏi
   = Đúng → 10đ theo đúng cơ cấu điểm nhị phân của Điều 14.2.a/b / Sai → 0đ.**
4. Song song đó, vẫn tính thêm **dãy con chung dài nhất (LCS)** giữa đáp án
   chuẩn và câu trả lời (thuật toán quy hoạch động O(n·m), giữ đúng thứ tự từ,
   không cho từ đảo vị trí hay từ thừa làm tăng tỷ lệ) để ra **tỷ lệ khớp (%)**
   — tỷ lệ này **chỉ hiển thị làm phản hồi tham khảo** giúp người học thấy
   mình còn thiếu/sai/thừa từ nào, **không** được dùng để thay thế kết quả
   Đúng/Sai nhị phân ở bước 3.
- Câu hỏi nhiều đáp án đúng (9/244 câu, mục "chọn nhiều đáp án") bị **loại khỏi
  Khởi động** vì nối nhiều đáp án trắc nghiệm rời rạc thành 1 chuỗi "đáp án
  chuẩn" sẽ không đáng tin cậy — các câu này vẫn xuất hiện bình thường ở Tăng
  tốc (trắc nghiệm, không đổi). Câu VII-12 (không có đáp án trong tài liệu gốc)
  tiếp tục bị loại khỏi mọi vòng như từ trước.
- Hỗ trợ kỹ thuật nhiều đáp án chuẩn cho 1 câu (ưu tiên biến thể khớp chính
  xác; nếu không biến thể nào khớp chính xác, hiển thị biến thể có tỷ lệ LCS
  cao nhất để so sánh), tuy hiện ngân hàng câu hỏi chỉ có đúng 1 cách diễn
  đạt/câu nên tạm thời luôn dùng 1 biến thể.
- Màn hình kết quả hiển thị **Đúng/Sai**, đáp án chuẩn, câu trả lời của bạn,
  tỷ lệ khớp (%, chỉ tham khảo), và highlight từng từ: xanh = khớp, đỏ gạch
  ngang = thiếu (có ở đáp án chuẩn nhưng bạn chưa viết), đỏ gạch chân =
  sai/thừa. Đáp án chuẩn **không** hiển thị trước khi nộp bài hoặc hết giờ. Có
  nút "Thử lại câu này" để luyện đến khi thuộc chính xác — kết quả giữ lại ưu
  tiên **Đúng** nếu đã từng trả lời đúng ít nhất 1 lần, nếu chưa bao giờ đúng
  thì giữ lần có tỷ lệ khớp cao nhất để xem phản hồi.

### Ôn 4 đề trọng tâm — tab mới, khu vực nổi bật trên Trang chủ

Ôn đúng **nguyên văn 80 câu** trong **4 "Bộ đề"** mô phỏng thi Đội tuyển, trích
từ `CamScanner 5-11-26 07.17.pdf` (xem `public/data/dethi4.json`), **giữ
nguyên toàn bộ câu hỏi, đúng phần thi và thứ tự gốc trong từng đề** — kể cả 64
câu trùng nội dung với 228 câu cũ hoặc trùng giữa các đề với nhau (không loại
bỏ/không bỏ qua câu nào chỉ vì trùng). Mỗi câu gắn ID riêng dạng
`DT{số đề}-{KD|TT|GR|GC}-{số câu gốc}` (ví dụ `DT2-GR-4` = Bộ đề 2, Gói câu
hỏi riêng, câu 4), tách biệt hoàn toàn khỏi 244 câu ngân hàng chính và khỏi
tab "Đội tuyển" — tiến độ ghi nhớ (hộp Leitner) của 80 câu này được theo dõi
riêng.

**Lọc theo vòng** (chọn "Vòng" trên màn hình thiết lập — độc lập với đề/chế độ
ôn bên dưới, kết hợp tự do với cả hai):
- **Sơ khảo** — chỉ lấy câu thuộc phần Khởi động + Tăng tốc (đúng vòng 1 theo
  Điều 13.2.a).
- **Chung khảo** — chỉ lấy câu thuộc Gói câu hỏi riêng + Gói câu hỏi chung
  (đúng vòng 2). Vào thẳng Chung khảo được, **không cần hoàn thành Sơ khảo
  trước**.
- **Toàn bộ** — cả 80 câu như trước.
- Áp dụng được cả khi ôn riêng 1 đề lẫn khi trộn/đảo cả 4 đề — ví dụ "Sơ khảo"
  + "Cả 4 đề" + "Đảo thứ tự" = trộn luân phiên đúng 40 câu Khởi động/Tăng tốc
  của cả 4 đề, không lẫn câu Gói riêng/Gói chung vào. Đã kiểm tra bằng script
  độc lập: 0 câu lọt sai vòng trên toàn bộ 15 tổ hợp (5 phạm vi đề × 3 vòng).

**3 chế độ ôn** (chọn "Đề" + "Chế độ ôn" trên màn hình thiết lập):
- **Theo thứ tự gốc** — ôn riêng 1 đề, đúng thứ tự gốc trong phạm vi vòng đã
  chọn (Khởi động → Tăng tốc → Gói riêng → Gói chung, hoặc chỉ nửa đầu/nửa sau
  nếu đã lọc vòng).
- **Đảo thứ tự câu** — xáo trộn thứ tự câu trong 1 đề đã chọn; chọn đề = "Cả 4
  đề" để **trộn luân phiên cả 4 đề**, vẫn giữ nguyên từng lượt xuất hiện của
  câu trùng (một câu xuất hiện ở 2 đề thì vẫn được hỏi 2 lần riêng biệt).
- **Chỉ câu sai / chưa thuộc** — lọc theo tiến độ ghi nhớ của riêng 80 câu
  này (đã từng trả lời sai, hoặc hộp Leitner ≤ 2), trong phạm vi đề/vòng đã
  chọn.
- Màn hình kết quả ghi rõ mỗi câu **thuộc đề nào, phần nào, số câu gốc** (ví
  dụ "Đề 3 · Gói câu hỏi riêng · Câu 2 gốc").
- **Không tính vào Điểm ĐT1/ĐT2** — đây là khu vực ôn luyện, tách biệt khỏi
  tab "Đội tuyển" (mô phỏng mới là nơi giữ đúng cấu trúc/thời gian/cách tính
  điểm chính thức *bắt buộc* của quy chế).
- **Hình thức Khởi động/Tăng tốc không đổi** (tự luận chấm tự động / trắc
  nghiệm). **Gói câu hỏi riêng/Gói câu hỏi chung mặc định dùng ô nhập tự do**
  (không hiện sẵn phương án) để đúng với "trả lời trực tiếp" theo Điều
  13.2.b — chấm tự động bằng cùng tiêu chí so khớp chữ (trừ câu nhiều đáp án
  đúng — tự chấm thủ công). Bật tuỳ chọn **"Ôn có gợi ý"** trên màn hình thiết
  lập để quay lại hiện phương án A/B/C/D như trước, có ghi chú rõ đây là lựa
  chọn mô phỏng hỗ trợ học, không phải hình thức thi thật.
- **Đồng hồ đếm ngược ở đây là tuỳ chọn** (gạt công tắc "Thời gian" trên màn
  hình thiết lập, mặc định **tắt** để ôn chậm không giới hạn giờ). Khi bật,
  dùng đúng thời lượng/cách tính của Điều 13.2.b như tab "Đội tuyển": Khởi
  động 90s/câu (tính cả thời gian trả lời), Tăng tốc 60s/câu, **Gói câu hỏi
  riêng 20s CHUẨN BỊ trước khi trả lời** (nút "Trả lời ngay" để vào sớm hơn,
  không giới hạn thêm giờ trả lời), **Gói câu hỏi chung 20s GIÀNH QUYỀN** (nút
  "Bấm chuông"; hết giờ chưa bấm = không giành được quyền, 0đ; sau khi bấm thì
  không giới hạn thêm giờ trả lời) — áp dụng theo đúng `stage` của từng câu,
  không phụ thuộc đề/vòng/chế độ ôn đã chọn. Hết giờ tự khoá và chấm bằng bài
  đã làm (không mất câu trả lời), không bị chậm khi chuyển tab, và chuyển câu
  không reset "để gian lận" vì quy chế vốn tính theo từng câu chứ không theo
  cả phần thi.
- **Tuỳ chọn "Luyện thêm tình huống Giành quyền trả lời" (10s)**: sau khi trả
  lời sai/không có câu trả lời ở Gói riêng/chung, nếu bật sẽ hiện thêm một bài
  tập tách biệt (cần bấm mới bắt đầu, đồng hồ 10s riêng) mô phỏng việc một đội
  khác giành quyền (Điều 13.2.b) — kết quả hiển thị riêng, **không** cộng vào
  điểm/thời gian của câu chính, không tự động nối tiếp thành 30 giây.
- Toàn bộ 80 câu đã được đối chiếu trực tiếp với ảnh quét 16 trang ngày
  05/11/2026 — **0 câu còn chưa xác minh được đáp án**; nếu phát hiện sai sót,
  sửa `public/data/dethi4.json` (và `data/raw/dethi-doituyen-2026-11-05.json`
  để giữ bản đối chiếu đồng bộ).

### Ôn tập nền tảng (không đổi)
- **Luyện tập** — chọn ngành, số câu, xáo trộn đáp án; biết đúng/sai ngay; lọc
  theo *câu đến hạn ôn / câu từng sai / câu đã đánh dấu ★*.
- **Luyện tốc độ** (trước gọi là "Thi thử") — 15/30/50 câu có đồng hồ đếm
  ngược, nộp bài, chấm điểm, xem lại. Bài tập bổ sung để ôn rộng, không phải
  định dạng chính thức của Hội thi.
- **Thẻ ghi nhớ** — lật thẻ, tự đánh giá "đã nhớ / chưa thuộc".
- **Lặp lại ngắt quãng** (Leitner 5 hộp: 0 → 1 → 3 → 7 → 21 ngày). Trả lời đúng
  đẩy câu ra xa, trả lời sai đưa về hộp 1 để gặp lại ngay — áp dụng cho cả
  Luyện tập và phần Tăng tốc trong tab Đội tuyển.
- **Tra cứu** — tìm kiếm không dấu trên toàn bộ câu hỏi & đáp án, lọc theo ngành.
- **Tiến độ** — % thông thạo từng ngành, phân bố 5 hộp, chuỗi ngày học, lịch sử,
  điểm ĐT1/ĐT2 cao nhất.
- **Quy chế** — bản quét gốc thể lệ Đội tuyển (5 trang) + phụ lục thang điểm
  chấm đơn vị (23 trang, chỉ để tham khảo).
- Giao diện sáng/tối, responsive cho điện thoại (thanh điều hướng dưới),
  phím tắt trên máy tính (`1–9` hoặc `a–e` chọn ý, `Enter` tiếp, `S` đánh dấu).

Tiến độ học lưu tại **localStorage** của trình duyệt — không có backend, không
gửi dữ liệu đi đâu. Mỗi thiết bị có tiến độ riêng.

## Quy chế & giới hạn dữ liệu

- File quy chế được cung cấp (`CamScanner 31-10-26 12.43.pdf`) chỉ có **5 trang,
  đánh số gốc 4–8**. Không có trang 1–3 (nhiều khả năng chứa Mục I, Điều 1–10).
  Điều 15 (Cách tính thành tích) đọc được **trọn vẹn đến hết mục "Thành tích cá
  nhân"** ở cuối trang 8 (câu cuối kết thúc bằng dấu chấm, không bị cắt giữa
  chừng) — nhưng tiêu đề Chương III là "CÁCH TÍNH THÀNH TÍCH, **XẾP LOẠI, KHEN
  THƯỞNG**" trong khi 5 trang hiện có chỉ chứa nội dung "cách tính thành tích";
  nhiều khả năng còn Điều 16+ về xếp loại/khen thưởng ở (các) trang sau trang 8
  mà tài liệu hiện có không bao gồm. Phần "Thi Đội tuyển" (Điều 12–14, phạm vi
  ứng dụng) đã đọc được đầy đủ. Ứng dụng **chỉ dùng đúng phần đã đọc được** và
  không suy đoán thêm nội dung thiếu.
- Phạm vi đã xác nhận với người dùng: **chỉ xây dựng cho "Thi Đội tuyển"**
  (Điều 12 khoản 2). "Thi Chủ nhiệm HC-KT" (Điều 12 khoản 1 — bảo vệ kế hoạch cá
  nhân trước BGK) và phần chấm điểm đơn vị (Mục I) có trong quy chế nhưng
  **chưa được xây dựng** trong ứng dụng.
- Giả định (không phải quy định minh thị trong quy chế): 228 câu trong
  `Bo_cau_hoi_Hoi_thi_0001.pdf` là nguồn câu hỏi BGK sử dụng cho Khởi động/Tăng
  tốc/gói câu hỏi — quy chế không nêu rõ nguồn câu hỏi. Nếu có bộ câu hỏi chính
  thức khác cho các phần thi này, cần cập nhật lại.
- Cơ chế **xếp hạng theo tốc độ giữa nhiều đội** (Tăng tốc) và **giành
  chuông/trừ điểm** (Vòng chung khảo) không thể mô phỏng khi luyện một mình —
  ứng dụng chỉ tính đúng/sai cho phần trả lời của người dùng và luôn ghi chú rõ
  đây là điểm luyện tập, không phải điểm thi chính thức.

## Kiến trúc

Static SPA thuần (không framework, không bước build) + một static server Node
không phụ thuộc thư viện ngoài.

```
quiz-app/
├── server.js                 # static server (gzip, cache, SPA fallback), 0 dependency
├── public/
│   ├── index.html
│   ├── app.js                # router, quiz engine, SRS, Đội tuyển (mô phỏng), Ôn 4 đề, thống kê
│   ├── styles.css
│   ├── data/questions.json   # 244 câu — ngân hàng chính (Luyện tập/Thẻ nhớ/Tra cứu/Luyện tốc độ/Đội tuyển)
│   ├── data/dethi4.json      # 80 câu nguyên văn 4 "Bộ đề" — riêng cho tab "Ôn 4 đề trọng tâm"
│   └── ref/
│       ├── tcd-01..23.jpg    # ảnh quét phụ lục thang điểm chấm đơn vị
│       └── dt-01..05.jpg     # ảnh quét thể lệ Đội tuyển (Điều 11–15, trang gốc 4–8)
├── data/raw/chunk-*.json              # bản bóc tách gốc 228 câu theo từng cụm trang (để đối chiếu)
├── data/raw/dethi-doituyen-2026-11-05.json  # bản bóc tách đầy đủ 80 câu từ CamScanner 5-11-26 (nguồn của dethi4.json, kèm dupOf/addedAs để đối chiếu với ngân hàng chính)
└── deploy/k8s-ingress.yaml   # route k3s/Traefik của VPS cũ — không áp dụng trên VPS mới, giữ lại để tham khảo
```

## Vận hành

Chạy như một systemd service, tự khởi động lại và tự bật khi reboot:

```bash
systemctl status hckt-quiz      # trạng thái
systemctl restart hckt-quiz     # khởi động lại
journalctl -u hckt-quiz -f      # log
```

Cấu hình: `/etc/systemd/system/hckt-quiz.service` (`PORT=80`, `HOST=0.0.0.0`).
Trên VPS mới (139.180.211.252), cổng 80 đang rảnh (không có nginx/k3s/docker
nào chiếm dụng — đã kiểm tra bằng `ss -tlnp` trước khi cấu hình), nên dùng
thẳng cổng 80 để có URL gọn `http://139.180.211.252/`, không cần ingress/k3s
như cấu hình VPS cũ (`deploy/k8s-ingress.yaml` chỉ còn mang tính tham khảo).

## Cập nhật nội dung câu hỏi

- Ngân hàng chính: sửa `public/data/questions.json` (hoặc sửa
  `data/raw/chunk-*.json` rồi dựng lại), sau đó tăng số phiên bản `?v=` trong
  `public/index.html` **và** trong lệnh gọi `fetch('data/questions.json?v=N')`
  ở `public/app.js`.
- 4 Bộ đề trọng tâm: sửa `public/data/dethi4.json` (giữ đúng cấu trúc
  `sets[].stages.{khoidong,tangtoc,rieng,chung}[]`, giữ thứ tự gốc), đồng thời
  sửa `data/raw/dethi-doituyen-2026-11-05.json` tương ứng để hai file không
  lệch nhau, rồi tăng số phiên bản `?v=` trong lệnh gọi
  `fetch('data/dethi4.json?v=N')` ở `public/app.js`.
- Dù sửa file nào, cũng cần tăng số phiên bản `app.js?v=N` trong
  `public/index.html` nếu có sửa `app.js`, để trình duyệt tải lại cache (mọi
  file tĩnh được server cache 7 ngày). Không cần khởi động lại service sau khi
  sửa nội dung — chỉ cần khởi động lại khi sửa `server.js`.

## Nhật ký khôi phục 05/11/2026

- VPS cũ (80.241.217.122) mất; khôi phục bằng `git clone` từ
  `https://github.com/imtoiteu/HCKT.git` (nhánh `main`, commit `990b8c6`) vào
  `/root/imtoiteu/HCKT` trên VPS mới (139.180.211.252) — không có dữ liệu cục
  bộ nào mới hơn để giữ lại, không có thay đổi chưa commit nào bị mất.
- Đối chiếu lại Điều 11–15 quy chế (đọc trực tiếp ảnh quét, không dựa vào
  README cũ) — nội dung Đội tuyển (TEAM_RULES, hạn mức thời gian, số câu từng
  phần) trong `app.js` đã khớp chính xác với bản quét. Một chỗ **được bổ
  sung**: công thức tính điểm chi tiết từng câu của Điều 14.2.a (nhị phân
  10đ/0đ cho Khởi động; `10 − (n−1)×1,0` cho Tăng tốc; trừ 5,0đ khi giành
  chuông sai ở Gói riêng/chung) có trong bản quét (trang 7–8) nhưng trước đó
  chưa được trích dẫn trong tab "Đội tuyển" — đã thêm rule `diem_ct` vào
  `TEAM_RULES` trong `app.js` kèm trích dẫn điều/trang.
- Nạp thêm bộ đề mới `CamScanner 5-11-26 07.17.pdf` (4 "Bộ đề", 80 câu dạng mô
  phỏng Đội tuyển): đối chiếu từng câu với 228 câu cũ, phát hiện 64/80 câu
  trùng nội dung + đáp án (chỉ khác cách rút gọn văn bản câu hỏi) — không nhập
  lại để tránh trùng lặp theo đúng yêu cầu. 16 câu là nội dung mới, đã thêm
  vào `questions.json` (ID mới: `VIII-33`, `VII-53`..`VII-63`, `II-31`,
  `II-32`, `IV-36`, `IV-37`), nâng tổng số câu từ 228 lên 244. Không có câu
  nào bị bỏ ngỏ đáp án trong số 16 câu mới được thêm. **4 câu** còn chưa xác
  nhận được là trùng hay mới hoàn toàn sau khi tra từ khoá thủ công — **chưa
  đưa vào** ngân hàng chính, giữ nguyên trong file bóc tách kèm ghi chú để
  người có bản gốc đầy đủ đối chiếu lại sau. *(Lưu ý: dòng này mô tả đúng
  trạng thái tại thời điểm viết — xem mục "05/11/2026 (tiếp) — đối chiếu lại
  toàn bộ 80 câu với ảnh quét" bên dưới để biết các sửa đổi tiếp theo trong
  cùng ngày, trong đó câu Bộ đề 3/Tăng tốc/câu 1 hoá ra CÓ gạch chân rõ chứ
  không phải suy luận từ câu `I-2` như ghi chú ban đầu.)*
  - *Kiểm tra lại sau khi nhập:* đối chiếu độc lập toàn bộ 20 câu được đánh
    dấu "không trùng" trong lần bóc tách đầu tiên với 244 câu hiện có bằng
    tra từ khoá theo từng câu — phát hiện 4 câu trong số đó thực ra **trùng
    chính xác** với câu đã có (`VIII-4`, `VII-25`, `V-13`, `VII-17`) nhưng bị
    bỏ sót cờ `dupOf` ở lần bóc tách đầu, và 1 câu (`II-32`, về hệ số ăn thêm
    ngày lễ/tết theo Nghị định 02/2026/NĐ-CP) là **câu mới thật sự nhưng bị bỏ
    sót, chưa được thêm** — đã bổ sung câu này vào `questions.json` sau khi
    đối chiếu lại trực tiếp với ảnh trang 5 của bản quét. Đã cập nhật cờ
    `dupOf`/`addedAs` tương ứng trong file bóc tách.
- Toàn bộ 80 câu bóc tách (kể cả 64 câu trùng, có ghi chú `dupOf`, và câu đã
  thêm có ghi chú `addedAs`) được lưu ở `data/raw/dethi-doituyen-2026-11-05.json`
  để đối chiếu/kiểm tra lại sau này, không bị xoá.

### 05/11/2026 (tiếp) — đối chiếu lại toàn bộ 80 câu với ảnh quét, xây khu vực "Ôn 4 đề trọng tâm"

Yêu cầu tiếp theo trong ngày: ưu tiên cao nhất là ôn tập **đầy đủ và chính
xác cả 4 bộ đề**, giữ nguyên mọi câu kể cả câu trùng (không loại bỏ như cách
tiếp cận gộp vào ngân hàng chính ở trên), và tách hẳn khỏi chế độ mô phỏng
thi chính thức.

- **Đối chiếu lại trực tiếp cả 16 trang ảnh quét** (không chỉ tra từ khoá) cho
  toàn bộ 80 câu của 4 "Bộ đề" — từng câu, từng phương án, từng đáp án gạch
  chân. Kết quả: 79/80 câu khớp chính xác với lần bóc tách trước; phát hiện
  **1 lỗi thật sự**: câu Bộ đề 3/Tăng tốc/câu 1 ("Chủ đề thực hiện nhiệm vụ
  chủ yếu... Kế hoạch số 160/KH-HCKT...") bị ghi nhầm là "không có ý nào gạch
  chân" ở lần bóc tách trước, trong khi ảnh trang 9–10 thực ra có gạch chân rõ
  ở phương án b ("Quyết tâm nghiên cứu, sản xuất vũ khí trang bị tiên tiến,
  hiện đại.") — đã sửa lại `uncertain:false`, `ans:["b"]` trong
  `data/raw/dethi-doituyen-2026-11-05.json`, không còn câu nào `uncertain`
  trong 80 câu.
- Xây `public/data/dethi4.json`: toàn bộ 80 câu, giữ nguyên thứ tự gốc (Khởi
  động → Tăng tốc → Gói riêng → Gói chung, câu 1→5 mỗi phần) trong từng Bộ đề
  1–4, **không loại bỏ câu trùng**, ID riêng `DT{đề}-{KD|TT|GR|GC}-{câu}` tách
  biệt khỏi 244 câu ngân hàng chính.
- Thêm tab/khu vực nổi bật **"Ôn 4 đề trọng tâm"** trên Trang chủ và thanh điều
  hướng (`V.dethi4` trong `app.js`) — 3 chế độ ôn (thứ tự gốc / đảo thứ tự
  trong 1 đề hoặc trộn luân phiên cả 4 đề / chỉ câu sai-chưa thuộc), không có
  đồng hồ đếm ngược, không tính vào Điểm ĐT1/ĐT2, màn hình kết quả ghi rõ
  "Đề N · Phần · Câu M gốc" cho từng câu.
- **Đổi cách chấm Khởi động sang nhị phân chính xác** (áp dụng cho cả tab
  "Đội tuyển" lẫn "Ôn 4 đề trọng tâm", dùng chung một hàm `gradeRecall`):
  trước đây tính điểm theo tỷ lệ % khớp LCS (được điểm một phần); nay **chỉ
  tính Đúng (10đ) khi khớp chính xác toàn bộ** sau chuẩn hoá — thiếu/thừa/sai
  từ hoặc đảo thứ tự đều tính Sai (0đ). Tỷ lệ khớp % vẫn hiển thị nhưng chỉ để
  tham khảo, không dùng để tính điểm — đúng theo yêu cầu "chỉ tính khớp hoàn
  toàn khi hai câu trả lời giống nhau sau chuẩn hoá" và đúng với cách chấm
  nhị phân chính thức của Điều 14.2.a tại tab "Đội tuyển".
- **Kiểm thử**: viết test độc lập bằng Node (ngoài trình duyệt) xác nhận hàm
  chấm nhị phân đúng mọi trường hợp biên (dấu câu không làm dính từ, giữ dấu
  tiếng Việt, từ đảo thứ tự → Sai, từ thừa → Sai, câu trống → Sai). Vì VPS
  không có trình duyệt/X server, đã cài tạm `jsdom` qua `npm` để mô phỏng DOM
  thật, tải trang qua HTTP từ chính service đang chạy, và **click qua toàn bộ
  80 câu** ở chế độ "Cả 4 đề · Theo thứ tự gốc" bằng câu trả lời đúng xác
  minh — 0 lỗi, kết quả 100%, tag "Đề N · Phần · Câu M gốc" khớp đúng từng
  câu; kiểm thêm luồng trả lời sai (cả tự luận lẫn trắc nghiệm, kể cả câu
  nhiều đáp án) hiển thị đúng "Sai"/đáp án đúng. Gói `jsdom`/`npm` cài thêm
  trong lần kiểm thử này chỉ phục vụ việc này, không phải phụ thuộc runtime
  của ứng dụng (ứng dụng vẫn 0 dependency, chạy bằng `node server.js` thuần).

### 05/11/2026 (tiếp 2) — lọc theo Vòng (Sơ khảo / Chung khảo) trong "Ôn 4 đề trọng tâm"

- Thêm bộ lọc **"Chọn vòng"** (Sơ khảo / Chung khảo / Toàn bộ) vào màn hình
  thiết lập của tab "Ôn 4 đề trọng tâm", độc lập và kết hợp tự do với bộ lọc
  "Chọn đề" và "Chế độ ôn" đã có — không đổi giao diện/bố cục các phần khác
  (`d4Pool`, `D4_ROUND_STAGES` trong `app.js`: Sơ khảo = `khoidong+tangtoc`,
  Chung khảo = `rieng+chung`, đúng cách chia vòng của Quy chế Điều 13.2.a và
  đúng cách tab "Đội tuyển" đã chia từ trước).
- Vào thẳng "Chung khảo" được, không cần hoàn thành "Sơ khảo" trước — không
  có cổng chặn nào được thêm.
- Giữ nguyên hoàn toàn nội dung câu hỏi, đáp án, cách chấm (nhị phân chính xác
  cho Khởi động) và việc giữ câu trùng — bộ lọc chỉ chọn tập con câu hỏi theo
  `stage`, không sửa dữ liệu.
- **Kiểm tra không lẫn câu giữa hai vòng**: viết script Node độc lập duyệt cả
  15 tổ hợp (5 phạm vi đề × 3 lựa chọn vòng), xác nhận đúng số câu kỳ vọng
  (10/40 cho Sơ khảo hoặc Chung khảo theo phạm vi 1-đề/4-đề, 20/80 cho Toàn
  bộ) và **0 câu lọt sai `stage`**; xác nhận tập Sơ khảo và Chung khảo không
  giao nhau và hợp lại đúng bằng tập Toàn bộ, với mọi phạm vi đề. Lặp lại kiểm
  tra bằng `jsdom` bấm qua giao diện thật (5 tổ hợp phạm vi×vòng×chế độ) qua
  HTTP tới service đang chạy — 0 câu bị gắn sai "Đề N · Phần · Câu M gốc"
  trong toàn bộ các lượt duyệt.

### 05/11/2026 (tiếp 3) — đồng hồ đếm ngược theo quy chế

- **Đọc lại Điều 13.2.b** (trang 5–6 bản quét) để xác nhận thời lượng chính
  xác trước khi code: quy chế tính thời gian **theo từng câu**, không phải
  cho cả phần thi — Khởi động "tổng thời gian đọc câu hỏi và trả lời của mỗi
  câu: 90s", Tăng tốc "...mỗi câu: 60s", Gói riêng "Thời gian chuẩn bị tối đa
  của mỗi câu hỏi là 20s", Gói chung "...trong vòng 20s". Không có mốc thời
  gian nào tính cho cả vòng/phần thi trong văn bản — nên yêu cầu "chuyển câu
  không được reset thời gian nếu tính cho cả phần" không áp dụng ở đây: mỗi
  câu có đồng hồ riêng là đúng quy chế.
- Tab **"Đội tuyển"** đã có sẵn đồng hồ đúng các mốc trên từ trước (không
  phải xây mới); lần này kiểm tra/siết lại cho khớp các yêu cầu mới: chỉ bắt
  đầu đếm khi câu đã hiển thị (đồng hồ khởi động bằng `setTimeout` trễ 1 nhịp
  sau khi gắn vào DOM, không tính giờ "chết" trước khi hiển thị), tính theo
  mốc `Date.now()` tuyệt đối nên không chậm khi chuyển tab/thu nhỏ cửa sổ,
  hết giờ tự khoá + lưu bài đã làm (giữ nguyên câu đã gõ/đã chọn, không mất),
  và bổ sung chặn **nộp bài hai lần** (xem dưới).
- Thêm đồng hồ **tuỳ chọn** (mặc định tắt) vào tab "Ôn 4 đề trọng tâm" — dùng
  lại đúng hàm `startTeamTimer`/`teamSeconds` của tab "Đội tuyển" (chỉ thêm
  tham số `elId` để dùng chung 1 cơ chế đếm giờ cho cả hai tab, vì chúng không
  bao giờ hiển thị đồng thời), cùng thời lượng/trích dẫn Điều 13.2.b, áp dụng
  đúng cho mọi tổ hợp đề/vòng/chế độ ôn đã chọn (thời gian theo `stage` của
  từng câu, độc lập với các bộ lọc khác).
- **Phát hiện khi kiểm thử**: bấm rất nhanh 2 lần vào nút "Câu tiếp theo"
  (bằng tham chiếu DOM cũ, qua `jsdom`) có thể gọi `d4Advance()`/`teamAdvance()`
  hai lần, nhảy 2 câu thay vì 1. Không tái hiện được bằng thao tác thật của
  người dùng trong trình duyệt (nút cũ đã bị `render()` gỡ khỏi màn hình
  trước khi trình duyệt kịp gửi sự kiện click thứ 2), nhưng vẫn sửa cho chắc:
  thêm hàm bọc `once()` cho mọi nút nộp bài/chuyển câu có tác dụng phụ (nộp tự
  luận, nộp trắc nghiệm tự chấm, "Câu tiếp theo"/"Xem kết quả" ở cả tab "Đội
  tuyển" lẫn "Ôn 4 đề trọng tâm") và thêm chặn tái vào ở `gradeAndReveal`/
  `doGrade` (`if (it.revealed) return`) — chạy lại kiểm thử sau khi sửa: bấm
  đúp không còn nhảy câu nữa.
- **Kiểm thử** (qua `jsdom`, bấm thật trên service đang chạy, giả lập trôi
  thời gian bằng cách ghi đè `Date.now` thay vì chờ thật 90s): xác nhận đồng
  hồ hiện đúng 01:30/01:00/00:20 kèm đúng chú thích điều/trang cho từng phần;
  xác nhận hết giờ tự khoá câu tự luận và chấm "Sai" dựa trên bài đã gõ (rỗng
  → Sai, đúng theo cách chấm nhị phân); xác nhận câu hỏi tiếp theo luôn có
  đồng hồ mới đúng thời lượng phần đó; xác nhận bật/tắt đồng hồ hoạt động cả
  hai chiều ở "Ôn 4 đề trọng tâm"; chạy lại toàn bộ bộ kiểm thử cũ (80 câu
  đúng → 100%, bộ lọc vòng không lẫn câu, tab "Đội tuyển"/"Luyện tập") để xác
  nhận không có hồi quy.
- Thêm cảnh báo `beforeunload` khi đang có lượt mô phỏng Đội tuyển hoặc lượt
  ôn 4 đề có bật giờ còn dang dở — tải lại/đóng tab giữa chừng vẫn **không lấy
  thêm được giờ** (toàn bộ trạng thái chỉ ở bộ nhớ, tải lại mất hết lượt làm,
  không phải "được reset đồng hồ"); cảnh báo chỉ để tránh mất bài do vô ý.

### 05/11/2026 (tiếp 4) — sửa lại hình thức Gói câu hỏi riêng/chung: không phải trắc nghiệm

Người dùng đặt câu hỏi: "Chung khảo có thực sự là trắc nghiệm, mỗi câu 20
giây không?" sau khi thấy tab "Ôn 4 đề trọng tâm" hiển thị trắc nghiệm cho
Gói câu hỏi riêng/chung. **Đọc lại trực tiếp cả hai PDF** (không dựa vào code
hiện có làm bằng chứng) cho kết quả: **không** — Điều 13.2.a–b (trang 5–6)
gọi 2 phần này là **"trả lời trực tiếp"**, dùng cụm "đưa ra câu trả lời" /
"bấm chuông giành quyền trả lời" — khác hẳn cách diễn đạt "trên máy tính
(soạn thảo đáp án)" của Khởi động và "trắc nghiệm trên máy tính (lựa chọn
đáp án đúng)" của Tăng tốc ngay trên cùng trang. Chính `CamScanner 5-11-26`
cũng tự đặt tiêu đề mục này là *"Vòng chung khảo (Trả lời trực tiếp, nếu sai
các đội bấm chuông giành quyền trả lời)"* ở cả 4 Bộ đề. "20 giây" có thật
nhưng là 2 ý nghĩa khác nhau (chuẩn bị ở Gói riêng, giành quyền/bấm chuông ở
Gói chung), không phải thời hạn chọn đáp án, và còn thiếu một pha 10 giây
"giành lại quyền trả lời" mà bản trước chưa có. Các phương án A/B/C/D in
trong bộ đề nhiều khả năng là tài liệu chuẩn bị/đối chiếu cho BGK chứ không
phải lựa chọn hiển thị cho thí sinh — nhưng quy chế không khẳng định minh thị
điều này, nên README chỉ ghi là suy luận có căn cứ, không phải sự thật đã xác
nhận 100%.

**Thay đổi đã triển khai** (áp dụng nhất quán cho cả tab "Đội tuyển" và "Ôn 4
đề trọng tâm", giữ nguyên giao diện/bố cục tổng thể, giữ nguyên bộ lọc Sơ
khảo-Chung khảo, chức năng đảo câu, câu trùng):
1. Gói câu hỏi riêng/chung mặc định dùng ô nhập tự do, không hiện sẵn phương
   án; nộp bài mới hiện đáp án chuẩn. Thêm tuỳ chọn **"Ôn có gợi ý"** (tắt
   theo mặc định) để quay lại hiện trắc nghiệm, ghi rõ đây là mô phỏng hỗ trợ
   học, không phải hình thức thi thật — dùng lại `teamMCView`/`d4RenderMC` đã
   có, chỉ tổng quát hoá để nhận đúng thời lượng theo `stage` thay vì cố định
   cho Tăng tốc.
2. Vẫn dùng đáp án gạch chân đã đối chiếu từng câu với ảnh quét (0/40 câu Gói
   riêng/chung còn chưa rõ đáp án — xem log "tiếp 2") để chấm theo tiêu chí so
   khớp chữ đã thống nhất; 2 câu nhiều đáp án đúng (`DT1-GC-2`, `DT4-GC-1`)
   không tự chấm được theo cách này nên chuyển sang tự chấm thủ công (2 nút
   Đúng/Sai), như cách Khởi động đã làm với câu nhiều đáp án từ trước. Diễn
   giải trong giao diện (`teamAutoGradeBox`) nay ghi rõ: cơ cấu điểm nhị phân
   là theo Điều 14.2.a/b, còn **cách xác định đúng/sai bằng so khớp chữ là
   lựa chọn của ứng dụng để luyện thuộc, không phải cách BGK thực tế chấm**.
3. Sửa lại ý nghĩa đồng hồ: thêm `rcPhaseUI` — Gói riêng vẽ pha "Đang chuẩn
   bị…" (nút "Trả lời ngay" để vào sớm), Gói chung vẽ pha "Giành quyền trả
   lời" với nút "🔔 Bấm chuông"; sau khi vào ô trả lời thì **không đặt thêm
   giới hạn giờ nào** vì quy chế không nêu thời lượng trình bày câu trả lời.
   Hết 20s mà Gói chung chưa bấm chuông → `rcMissedBox()` báo "Không giành
   được quyền trả lời", không tự chuyển sang ô trả lời.
4. Thêm `renderStealPractice` (tuỳ chọn, tắt theo mặc định): sau khi trả lời
   sai/không có câu trả lời ở Gói riêng/chung, hiện nút riêng để luyện tình
   huống "Giành quyền trả lời (10s)" — phải bấm mới bắt đầu, có đồng hồ 10s
   và ô nhập riêng, kết quả hiển thị tách biệt (`it.steal`), **không** cộng
   vào `it.points`/`it.ok` của câu chính.
5. README không còn khẳng định các phương án A/B/C/D "chỉ dành cho BGK" như
   một sự thật — đã nêu rõ đây là suy luận từ cách hành văn, tách bạch phần
   quy chế nêu trực tiếp (hình thức "trả lời trực tiếp", bấm chuông, mốc thời
   gian, cách cộng/trừ điểm) với phần là lựa chọn mô phỏng của ứng dụng (ô
   nhập mặc định, chế độ gợi ý, tiêu chí chấm so khớp chữ, bài tập giành
   quyền luyện thêm).

**Kiểm thử** bằng `jsdom` bấm thật qua service đang chạy: chạy lại trọn vẹn
80 câu ở chế độ mặc định (ô nhập tự do, không giờ) — 0 lỗi, điểm 100%, bao
gồm cả 2 câu nhiều đáp án qua luồng tự chấm thủ công mới; xác nhận chế độ có
giờ cho Gói riêng hiện đúng pha "chuẩn bị" (không có ô nhập) rồi nút "Trả lời
ngay" chuyển đúng sang ô nhập và chấm đúng; xác nhận Gói chung hiện đúng nút
"Bấm chuông", và giả lập hết 20s không bấm (ghi đè `Date.now`) cho đúng kết
quả "Không giành được quyền trả lời"; xác nhận bật "Ôn có gợi ý" quay lại
đúng giao diện trắc nghiệm có ghi chú rõ là mô phỏng; xác nhận tuỳ chọn luyện
"Giành quyền trả lời" hiện đúng bài tập tách biệt và **không** làm thay đổi
điểm của câu chính sau khi nộp; lặp lại ở tab "Đội tuyển" (luôn bắt buộc có
giờ) với cùng các kịch bản, xác nhận trích dẫn đổi đúng giữa Điều 14.2.a
(Khởi động) và 14.2.b (Gói riêng/chung); chạy lại bộ lọc Sơ khảo/Chung khảo
(15 tổ hợp phạm vi×vòng) — vẫn 0 câu lẫn vòng; chạy lại luồng "Luyện tập" cũ
— không hồi quy.

### 05/11/2026 (tiếp 5) — sửa đáp án chuẩn tham chiếu cho chế độ trả lời tự do

Lỗi được báo: Đề 3 → Khởi động → Câu 3 gốc ("Theo Nghị định số 02/2026/NĐ-CP,
tiêu chuẩn diện tích nhà trong quân đội được quy định theo?") dùng **"Cả hai
phương án trên."** làm đáp án chuẩn để chấm ở chế độ nhập tự do, trong khi
người học không nhìn thấy các phương án a)/b) để biết "hai phương án trên" là
gì — không thể gõ đúng được.

**Rà soát toàn bộ 80 câu** (không chỉ câu được báo) tìm mọi đáp án đúng có
dạng tham chiếu ("Cả…", "Tất cả…", "…trên", "A và B đúng"…) bằng regex quét cả
2 lượt (hẹp rồi mở rộng, cùng kết quả) rồi đối chiếu thủ công — phát hiện
đúng **4 câu** đáp án đúng là tham chiếu kiểu này (loại các trường hợp cụm từ
"cả"/"tất cả" chỉ xuất hiện trong phương án SAI, không phải đáp án đúng, nên
không cần sửa):

| Đề | Phần | Câu gốc | ID | Đáp án trước (chỉ tham chiếu) | Đáp án sau dùng để chấm/hiển thị ở chế độ tự do |
|---|---|---|---|---|---|
| 3 | Khởi động | 3 | `DT3-KD-3` | "Cả hai phương án trên." | "Cấp bậc quân hàm và chức vụ." |
| 2 | Gói câu hỏi chung | 1 | `DT2-GC-1` | "Cả a, b, c, d." | "Lần đầu trước khi đưa đối tượng kiểm định vào sử dụng; định kỳ khi đối tượng kiểm định đến hạn kiểm định lại; sau khi lắp đặt lại đối tượng kiểm định hoặc có cải tạo, sửa chữa làm thay đổi kết cấu, thông số kỹ thuật của đối tượng kiểm định; theo yêu cầu của đơn vị sử dụng hoặc theo yêu cầu của Cơ quan An toàn, bảo hộ lao động quân đội." |
| 3 | Gói câu hỏi chung | 3 | `DT3-GC-3` | "Cả a, b, c." | "Kiểm tra tình trạng kỹ thuật và đồng bộ của trang bị kỹ thuật; bảo quản trang bị kỹ thuật và dụng cụ, thiết bị khác, sửa chữa hỏng hóc nếu có; kiểm tra hồ sơ, ghi chép sổ sách đăng ký thống kê." |
| 1 | Tăng tốc | 3 | `DT1-TT-3` | "Cả a, b, c" | *(không sửa — xem lý do bên dưới)* |

Nội dung mở rộng lấy nguyên văn các phương án được tham chiếu, ghép theo đúng
thứ tự gốc (a → b → c → d), không đổi số liệu/đơn vị/điều kiện, chỉ nối bằng
dấu `;` hoặc "và" cho liền mạch — không tự suy đoán hay bịa thêm nội dung.
`DT1-TT-3` **không cần sửa** vì Tăng tốc luôn là trắc nghiệm ở cả 2 tab (dù
bật/tắt "Ôn có gợi ý" cũng không đổi), người học luôn nhìn thấy đủ phương án
a/b/c nên tham chiếu "Cả a, b, c" không gây ra lỗi tương tự. Không gặp câu
nào dạng "Không phương án nào đúng" trong 80 câu — nếu phát sinh sau này,
quy ước là đánh dấu `uncertain` thay vì tự ghép các phương án sai lại.

**Triển khai**: thêm trường mới `ansFull` (mảng, có thể nhiều biến thể) vào
đúng 3 câu trên trong `public/data/dethi4.json` và bản đối chiếu
`data/raw/dethi-doituyen-2026-11-05.json` — **không đổi** `opts`/`ans` (khoá
đáp án gốc cho trắc nghiệm giữ nguyên, dùng nguyên khi bật "Ôn có gợi ý").
Thêm hàm `canonicalAnswers(q)` trong `app.js`: trả về `q.ansFull` nếu có,
nếu không thì trả về đúng nội dung phương án khoá đáp án gốc như trước — áp
dụng tại cả 3 nơi gọi `gradeRecall` cho chế độ trả lời tự do (chấm câu
chính, chấm "Thử tình huống" giành quyền trả lời, và hiển thị "Đáp án chuẩn"
+ highlight thiếu/thừa/sai từ, vì cả 3 đều dùng chung kết quả của
`gradeRecall`) — sửa một chỗ, áp dụng nhất quán cho mọi nơi hiển thị/chấm,
đúng yêu cầu không chỉ sửa phần hiển thị mà chấm vẫn theo chuỗi tham chiếu cũ.

**Kiểm thử** bằng hàm thật trích từ `app.js` (không phải viết lại logic để
test) và bằng `jsdom` bấm qua giao diện thật trên service đang chạy, cho cả
3 câu: gõ đúng nội dung đã mở rộng → **Đúng**; gõ nguyên văn cụm tham chiếu cũ
("Cả hai phương án trên.", "Cả a, b, c, d.", "Cả a, b, c.") → **Sai** (0%,
không còn được tính đúng); gõ thiếu một vế → **Sai**, từ còn thiếu được tô
đỏ gạch ngang đúng vị trí; "Đáp án chuẩn" hiển thị sau khi nộp cũng đổi sang
nội dung đã mở rộng, không còn hiện cụm tham chiếu cũ. Xác nhận chế độ trắc
nghiệm ("Ôn có gợi ý") vẫn hiện nguyên văn "Cả a, b, c." làm phương án, bấm
đúng khoá đáp án gốc vẫn được tính đúng bình thường — không đổi. Chạy lại bộ
kiểm thử 80-câu-đúng cũ: điểm giảm còn 96% nếu vẫn gõ 3 cụm tham chiếu cũ
(đúng như kỳ vọng, xác nhận lỗi đã được chặn), quay lại 100% khi gõ đúng nội
dung đã mở rộng — không có câu nào khác bị ảnh hưởng ngoài 3 câu trên.

### 05/11/2026 (tiếp 6) — sửa icon cảnh báo/kết quả bị phóng quá khổ

Lỗi: icon cảnh báo ở pha "Đang chuẩn bị" (Gói câu hỏi riêng) và icon
Đúng/Sai ở màn hình chấm kết quả (cả Khởi động lẫn Gói riêng/chung, cả 2 tab)
bị hiển thị rất lớn, đẩy ô trả lời/nút thao tác xuống dưới.

**Nguyên nhân** (SVG icon dùng chung `ICON.warn/check/x` trong `app.js` —
mỗi icon chỉ có `viewBox`, không có `width`/`height`, phải dựa hoàn toàn vào
CSS theo đúng ngữ cảnh chứa nó để định kích thước):
1. `rcPhaseUI` (pha "chuẩn bị" Gói riêng) gọi `${ICON.warn.replace('warn','')}`
   — lỗi gõ nhầm, chuỗi `"warn"` không hề xuất hiện trong mã SVG nên
   `.replace()` không có tác dụng gì, để lọt nguyên icon **không có class**
   vào một `<div class="lead">` chưa từng được định kiểu cho bối cảnh này
   (CSS `.lead` sẵn có chỉ áp dụng trong `.recall-ans`/`.flash .fa`) → trình
   duyệt tự giãn SVG theo kích thước mặc định, rất lớn.
2. `.gpts b{display:block;...}` (khung điểm Đúng/Sai dùng chung cho
   `teamAutoGradeBox`, khung "luyện thêm giành quyền trả lời", và
   `rcMissedBox`) **chưa từng có quy tắc CSS định cỡ `svg` con** — vẫn hoạt
   động "tạm ổn" ở các icon khác vì mọi nơi khác đều có `X svg{width;height}`
   riêng (`.note svg`, `.feedback svg`, `.btn svg`, `.mark`…), chỉ riêng
   `.gpts`/`.gpct` bị bỏ sót từ trước, lộ rõ hơn khi thêm các khung mới (Gói
   riêng/chung, luyện giành quyền trả lời) dùng cùng cấu trúc này.

**Sửa tại đúng phạm vi** (không đổi quy tắc `svg{...}` toàn cục, không ảnh
hưởng logo hay icon khác đang đúng):
- Bỏ `.replace()` sai, bọc icon + chữ trong `<div class="lead">${ICON.warn}
  <span>…</span></div>`; thêm CSS `.prep-box` (khung pha chuẩn bị/giành
  quyền) và `.prep-box .lead svg{width:18px;height:18px}` — icon cạnh chữ,
  đúng dải 20–24px theo yêu cầu (chọn 18px cho vừa cỡ chữ 15px của dòng tiêu
  đề ngắn này).
- Đổi `.gpct b,.gpts b` từ `display:block` sang `display:flex;align-items:
  center;justify-content:center;gap:5px` (vẫn căn giữa y hệt trước, chỉ đổi
  cơ chế để xếp icon + chữ cùng hàng) và thêm `.gpct b svg,.gpts b svg{
  width:22px;height:22px}` — áp dụng thống nhất cho mọi nơi dùng `.gpts`
  (Khởi động, Gói riêng/chung, "luyện thêm giành quyền trả lời", "không
  giành được quyền"), vì tất cả cùng chia sẻ một đoạn mã hiển thị kết quả.
- Không đổi `.note svg`, `.feedback svg`, `.btn svg`, `.mark`, `.tabs
  button svg`, `.star-btn svg`, `.ring svg` — những nơi này đã có quy tắc
  đúng từ trước, rà soát lại toàn bộ danh sách nơi dùng `ICON.warn/check/x`
  trong `app.js` xác nhận không còn chỗ nào thiếu CSS định cỡ `svg`.

**Kiểm thử**: dùng `jsdom` tải trang thật từ service đang chạy rồi đọc
`getComputedStyle` của icon — xác nhận icon pha chuẩn bị còn đúng 18×18px,
icon Đúng/Sai trong khung kết quả còn đúng 22×22px (trước đó không có quy
tắc CSS nào khớp, kích thước không xác định/giãn to). Chạy lại toàn bộ kiểm
thử trước đó (80 câu đúng → 100%, bộ lọc vòng không lẫn câu, kịch bản đáp án
mở rộng ở `DT3-KD-3`/`DT2-GC-1`/`DT3-GC-3`) — không hồi quy. **Không kiểm tra
được bằng mắt thật trên trình duyệt/điện thoại thật** vì VPS không có trình
duyệt hay màn hình — `jsdom` không dựng layout/CSS đầy đủ như trình duyệt
thật, chỉ xác nhận đúng quy tắc CSS được áp dụng; cần người dùng tự mở trang
để xác nhận hình ảnh cuối cùng.

### 06/11/2026 — tính năng "Đánh dấu câu hỏi cần ôn" (🔖) + tab "Cần ôn lại"

Thêm nút đánh dấu/bỏ đánh dấu 🔖 ở **mọi nơi hiển thị câu hỏi** (Luyện tập,
Luyện tốc độ, Thẻ ghi nhớ, Tra cứu, Đội tuyển, Ôn 4 đề trọng tâm) và một tab
mới **"Cần ôn lại"** gom toàn bộ câu đã đánh dấu từ mọi nơi lại một chỗ để
luyện tập trung.

**Thiết kế dữ liệu**: dùng chung `store.d.starred` (object dạng `{id: 1}`,
không phải mảng) — một ID chỉ có đúng một mục, nên bấm đánh dấu cùng 1 câu từ
Luyện tập, Tra cứu hay Đội tuyển đều ra cùng một trạng thái, không thể trùng
lặp. ID câu hỏi dùng khoá ổn định có sẵn (`I-1`… cho ngân hàng 244 câu,
`DT{đề}-{phần}-{số}` cho 80 câu "4 đề trọng tâm") — không dựa vào vị trí/thứ
tự hiển thị, nên xáo trộn đáp án hay đổi thứ tự danh sách không làm mất dấu.
Hai nguồn dữ liệu không trùng ID với nhau (đã kiểm tra), nên không cần hợp
nhất. Lưu cùng `localStorage` key `hckt2026.v1` như toàn bộ tiến độ/thống kê
khác — ứng dụng hiện không có hệ thống tài khoản nên không có nguy cơ mất dấu
khi "đăng nhập lại"; nếu sau này có tài khoản, chỉ cần đồng bộ hoá đối tượng
`starred` này như các trường `stats`/`history` khác.

**Đánh dấu**: hàm `starBtn(id, opts)` dựng sẵn nút 🔖 dùng chung cho mọi màn
hình, bấm được bất cứ lúc nào (đang làm bài, đã xem đáp án, đang xem lại kết
quả) — chỉ gọi `store.star(id)` và cập nhật class `.on`, không đụng vào
điểm số/đồng hồ/tiến độ Leitner của câu đó. Icon bookmark dùng lại đúng
`ICON.star` (đã đổi từ hình sao sang hình bookmark cho đúng yêu cầu), nút có
kích thước cố định 30×30px (CSS `.star-btn` có sẵn từ trước, không phình to
thẻ câu hỏi).

**Tab "Cần ôn lại"**: màn hình danh sách hiển thị tổng số câu đã đánh dấu, bộ
lọc theo loại (Tất cả/Trắc nghiệm/Tự luận) và theo chủ đề/ngành (ngân hàng
chính) hoặc theo đề (4 đề trọng tâm) — số lượng mỗi lựa chọn cập nhật theo bộ
lọc đang chọn. Có thể luyện từng câu riêng (nút "Luyện câu này" ngay trong
danh sách) hoặc "Ôn tất cả câu đã đánh dấu" (phù hợp bộ lọc hiện tại), theo
thứ tự gốc hoặc ngẫu nhiên. Khi luyện, mỗi câu được chấm **đúng theo hình
thức gốc của chính nó** — trắc nghiệm (một/nhiều đáp án) dùng lại UI chấm của
`V.quiz`, tự luận dùng lại UI chấm/so khớp từ của `teamRecallView`/`d4QuizView`
(bao gồm cả câu nhiều đáp án đúng phải tự đối chiếu) — không viết lại logic
chấm, chỉ tái dùng. Lượt luyện ở đây **không tính giờ** (không phải mô phỏng
thi) nhưng vẫn gọi `store.grade()` để cập nhật hộp Leitner như bình thường;
khác với mọi nơi khác, trả lời đúng ở đây **không tự bỏ đánh dấu** — đúng yêu
cầu "chỉ bỏ đánh dấu khi người học chủ động thực hiện". Có thể bỏ đánh dấu
ngay trong danh sách hoặc ngay trong lúc luyện/xem kết quả bằng cùng nút 🔖.
Khi danh sách trống, hiển thị hướng dẫn cách đánh dấu.

**Giao diện**: tái dùng toàn bộ class CSS đã có (`.chips`/`.chip`, `.field`,
`.card.pad`, `.empty`, `.review-list`/`.rev`, `.star-btn`) — chỉ thêm đúng 2
dòng CSS mới (`.flash{position:relative}` và `.flash .star-btn{position:
absolute}` để đặt nút 🔖 lên góc thẻ ghi nhớ không chiếm layout). Không cần
CSS mới cho giao diện di động vì toàn bộ `.chip`/`.btn`/`.star-btn` đã có quy
tắc responsive từ trước.

**Nối tab**: thêm nút `data-nav="review"` vào `<nav id="tabs">` trong
`index.html` — thanh điều hướng dưới cho di động (`buildBottomBar()`) tự
nhân bản từ `#tabs` nên không cần sửa thêm gì cho mobile; thêm nhãn rút gọn
"Cần ôn" vào bảng `SHORT` dùng riêng cho thanh dưới. Thêm quy tắc reset
`app.review` khi vào/ra tab (giống `app.team`/`app.d4`) để quay lại tab sau
khi xem kết quả không bị kẹt ở màn hình cũ.

**Kiểm thử** bằng Playwright (Chromium, 32 kịch bản, chạy qua
`node server.js` thật trên cổng cục bộ — không phải logic viết lại để test):
đánh dấu/bỏ đánh dấu và đổi trạng thái icon; đánh dấu từ Tra cứu rồi xác nhận
Thẻ ghi nhớ cũng có nút 🔖 (UI dùng chung) và tab "Cần ôn lại" chỉ liệt kê
**đúng 1 dòng** cho 1 ID (không trùng lặp); lưu `localStorage` sống sót qua
`page.reload()`; lọc theo loại hiển thị đủ 3 nhãn; luyện "Ôn tất cả câu đã
đánh dấu" tới màn kết quả, chấm điểm đúng, và xác nhận đánh dấu **không** bị
tự xoá sau khi trả lời; đánh dấu trong câu hỏi Đội tuyển (Gói riêng, đang
chạy đồng hồ pha "chuẩn bị") không làm đồng hồ dừng/nhảy số hay làm câu hỏi
tự chuyển tiếp; đánh dấu câu "Ôn 4 đề" ghi đúng ID dạng `DT…`; viewport
iPhone 12 — thanh điều hướng dưới có tab "Cần ôn", không tràn ngang trang ở
cả tab "Cần ôn lại" và Tra cứu, nút 🔖 giữ kích thước ≤36×36px. **32/32 đạt**.
Không kiểm thử được trên thiết bị di động thật (chỉ giả lập viewport bằng
Playwright) — cần người dùng tự mở trên điện thoại để xác nhận cảm giác chạm
cuối cùng.

**Giới hạn còn lại**: lọc theo "chủ đề/nhóm kiến thức" hiện dùng đúng 2 cấp
nhóm dữ liệu sẵn có (8 ngành của ngân hàng chính, 4 "đề" của khu vực trọng
tâm) — chưa có nhãn chủ đề chi tiết hơn vì dữ liệu nguồn không có trường này;
nếu cần nhóm nhỏ hơn (theo điều/nội dung) sẽ cần bổ sung trường phân loại mới
vào dữ liệu câu hỏi trước.

### 06/11/2026 (tiếp) — chia "Ôn 4 đề trọng tâm" thành Vòng sơ khảo/Vòng chung khảo riêng cho từng đề

Nâng cấp mục "Ôn 4 đề trọng tâm": mỗi đề trong 4 "Bộ đề" giờ có 2 nút nổi bật
**Vòng sơ khảo** và **Vòng chung khảo**, mô phỏng đúng cấu trúc/đồng hồ/cách
tính điểm của Điều 13–14 Quy chế Hội thi — giống cách tab "Đội tuyển" đã làm
— nhưng tính riêng cho đúng 10 câu gốc của từng đề (không lấy câu ngẫu nhiên
từ cả ngân hàng như tab "Đội tuyển"), lưu điểm cao nhất và lịch sử riêng theo
từng đề × từng vòng.

**Kiểm tra cấu trúc dữ liệu trước khi chia** (theo đúng yêu cầu bảo toàn nội
dung gốc): cả 4 đề trong `public/data/dethi4.json` đã có sẵn **đúng 5+5+5+5
câu** cho 4 giai đoạn `khoidong`/`tangtoc`/`rieng`/`chung` — đây là phân loại
**gốc từ tài liệu quét** (CamScanner 5-11-26, đã bóc tách thủ công theo đúng
cấu trúc in trong đề, không phải do ứng dụng tự suy đoán/phân loại lại) nên
**không cần và không áp dụng** bất kỳ quy tắc phân loại "hợp lý dựa trên dạng
câu" nào — mỗi đề đã đủ đúng 20 câu, chia thẳng thành 10 câu Vòng sơ khảo
(Khởi động + Tăng tốc) và 10 câu Vòng chung khảo (Gói riêng + Gói chung)
theo đúng Điều 13.2.a, không đề nào thiếu câu. Không sửa, xoá hay viết lại
bất kỳ câu hỏi/đáp án nào trong 2 file dữ liệu 4 đề.

**Đối chiếu lại Điều 12–14** (ảnh quét `public/ref/dt-01..05.jpg`, đã dùng
làm căn cứ từ trước cho tab "Đội tuyển", nay áp dụng lại đúng nguyên bản cho
từng đề): thời gian 90s/60s/20s tính **theo từng câu**, không phải cho cả
phần thi (Điều 13.2.b); Khởi động/Tăng tốc chấm nhị phân 10đ/câu, tổng vòng
sơ khảo 100đ = Điểm ĐT1 (Điều 14.2.a); Gói riêng 20s là **thời gian chuẩn bị
trước khi trả lời** (hết giờ tự mở ô trả lời, không bị tính sai), Gói chung
20s là **cửa sổ giành quyền trả lời/bấm chuông** (hết giờ mới coi là không
giành được quyền, tính 0đ) — quy chế không nêu thời lượng trình bày câu trả
lời sau khi đã giành quyền/qua pha chuẩn bị nên không tự đặt thêm giới hạn.
Đây là đúng cách hiểu đã áp dụng cho tab "Đội tuyển" từ trước (xem các mục
"Nhật ký khôi phục" và "tiếp 3/4" phía trên) — áp dụng lại y hệt cho từng đề,
không diễn giải khác.

**Tái sử dụng tối đa, không viết lại logic chấm**: hàm mới `d4StartRound(setNo,
round)` chỉ lấy đúng 10 câu gốc của đề đó (`d4Pool`, giữ nguyên thứ tự gốc,
không xáo trộn vị trí câu — chỉ xáo trộn thứ tự đáp án trắc nghiệm như mọi
nơi khác), bật đồng hồ bắt buộc (`timed:true`, không có lựa chọn tắt — khác
khu vực "Tuỳ chỉnh phạm vi ôn" vẫn giữ đồng hồ tuỳ chọn như trước), rồi dùng
lại nguyên vẹn `d4RenderRecall`/`d4RenderMC`/`rcPhaseUI`/`gradeRecall`/
`canonicalAnswers`/`teamAutoGradeBox`/`rcMissedBox`/`startTeamTimer` đã có
sẵn — chỉ thêm `it.points = it.ok ? 10 : 0` vào đúng 4 điểm chấm (đã thiếu so
với `teamMCView`/`teamRecallView` vì vùng "Ôn 4 đề" trước đây chỉ đếm đúng/sai,
không cộng điểm) để có thể tính tổng điểm/100 theo đúng công thức Điều 14.2.a,
không đổi hành vi chấm đúng/sai hiện có. Nút 🔖 đánh dấu cần ôn, tiến độ hộp
Leitner, và luồng chấm tự luận/trắc nghiệm giữ nguyên y hệt mọi nơi khác —
không viết thêm bản sao nào.

**Lưu điểm riêng theo đề và theo vòng**: thêm `store.d.best.d4[setNo] =
{so, chung}` (điểm cao nhất) và `store.d.d4last[setNo]` (điểm Sơ khảo **gần
nhất** của đề đó, dùng làm mốc xuất phát cho Chung khảo — tách biệt hoàn
toàn khỏi `store.d.best.dt1/dt2`/`store.d.lastDT1` của tab "Đội tuyển", vì đó
là 2 bài kiểm tra khác nhau: tab "Đội tuyển" lấy 5+5 câu ngẫu nhiên từ cả 244
câu ngân hàng, còn mỗi đề ở đây dùng đúng 10 câu cố định của riêng đề đó).
Công thức Điểm tương đương ĐT2 cho Chung khảo dùng lại đúng công thức đã có
ở tab "Đội tuyển" (`min(100, mốc Sơ khảo + điểm Chung khảo)`), áp dụng riêng
cho từng đề thay vì dùng `lastDT1` chung. Mỗi lượt hoàn thành ghi vào
`store.d.history` với `mode: d4r-{so|chung}-{setNo}` (tab "Tiến độ" đã cập
nhật để hiển thị đúng nhãn "4 đề #N · Sơ khảo/Chung khảo" cho các lượt này
thay vì rơi vào nhãn "Luyện tập" mặc định). Tất cả lưu trong cùng
`localStorage` key `hckt2026.v1` như trước — không có cơ chế tài khoản nên
không có rủi ro mất dữ liệu khi "đăng nhập lại"; toàn bộ `stats`/`starred`/
`history`/`best` cũ được giữ nguyên qua `Object.assign` khi tải trang.

**Giao diện**: trang "Ôn 4 đề trọng tâm" giờ có 3 phần theo đúng thứ tự: (1)
ô tuỳ chọn "Ôn có gợi ý"/"Giành quyền trả lời" dùng chung cho cả 2 luồng —
gộp về một chỗ duy nhất (trước đây chỉ có ở khu vực tuỳ chỉnh), mặc định tắt
cả hai, có ghi chú rõ đây là mô phỏng hỗ trợ học không phải hình thức thi
chính thức; (2) lưới 4 thẻ "Đề 1..4", mỗi thẻ 2 dòng Vòng sơ khảo/Vòng chung
khảo hiển thị điểm cao nhất ("Chưa luyện" nếu chưa làm) + nút "Bắt đầu" 1
chạm; (3) khu vực "Tuỳ chỉnh phạm vi ôn" giữ nguyên các tuỳ chọn cũ (chọn
vòng/đề linh hoạt, đảo thứ tự, chỉ ôn câu sai, đồng hồ tuỳ chọn), đổi tên và
ghi rõ đây là ôn tự do không tính điểm chính thức, không ảnh hưởng điểm 2
vòng ở trên. Tái dùng nguyên vẹn các class CSS đã có (`sec-grid`, `card.pad`,
`sw`, `sec-title`); chỉ thêm 1 class CSS mới `.d4-round-row` (9 dòng, dựa
theo đúng mẫu `.mastery-row` đã có) để xếp tên vòng + điểm + nút "Bắt đầu"
trên 1 dòng, tự xuống dòng (`flex-wrap`) trên màn hình hẹp, nút giữ cỡ nhỏ
gọn (padding 8×14px, không phình to).

**Kiểm thử** bằng Playwright (Chromium, chạy qua `node server.js` thật, 92
kịch bản tổng cộng — không phải logic viết lại để test):
- Toàn bộ **8 tổ hợp** (4 đề × 2 vòng) đều vào được, làm hết 10 câu, ra đúng
  màn kết quả, điểm tổng đúng công thức (test với toàn đúng → 100/100, điểm
  từng phần Khởi động/Tăng tốc hoặc Gói riêng/Gói chung đúng 50/50), và danh
  sách "Xem lại bài làm" của mỗi lượt **chỉ chứa câu của đúng đề đó** (không
  lẫn câu đề khác).
- Mốc xuất phát Chung khảo: làm Sơ khảo Đề 1 đạt 100 → `d4last[1]=100`; làm
  tiếp Chung khảo Đề 1 đạt 100 → hiển thị đúng "Mốc xuất phát: 100 + 100" và
  điểm tương đương ĐT2 = 100 (capped), lưu đúng vào `best.d4[1]`.
- Cả 4 kiểu đồng hồ dùng **Playwright Clock API** (giả lập thời gian, không
  phải chờ thật 90 giây) xác nhận đúng ngữ nghĩa đã đối chiếu ở trên: hết 90s
  Khởi động không gõ gì → tự chấm Sai (0đ), hiện khung kết quả ngay, không
  cần bấm Nộp; hết 60s Tăng tốc không chọn → tự chấm Sai; hết 20s Gói riêng
  không bấm "Trả lời ngay" → **tự mở ô trả lời** (không bị tính sai); hết 20s
  Gói chung không bấm chuông → tự tính "Không giành được quyền" (Sai).
- "Làm lại [vòng]" khởi động lại đúng đề/vòng đó; "Sang Vòng chung khảo"/"Về
  Vòng sơ khảo" chuyển đúng sang vòng còn lại của **cùng đề** (không nhảy đề).
- Đánh dấu 🔖 một câu bên trong lượt luyện Vòng sơ khảo/Chung khảo đồng bộ
  đúng sang tab "Cần ôn lại" (không trùng lặp, đúng 1 dòng), bỏ đánh dấu từ
  "Cần ôn lại" đồng bộ ngược lại khi mở lại đúng câu đó.
- Khu vực "Tuỳ chỉnh phạm vi ôn" (luồng cũ) vẫn khởi tạo phiên **không tính
  điểm** (`scored` falsy), đồng hồ vẫn tắt theo mặc định cũ, màn kết quả vẫn
  hiện đúng dạng % cũ (không phải điểm X/100 kiểu vòng thi) — xác nhận không
  hồi quy.
- Toàn bộ 32 kịch bản của tính năng "Cần ôn lại"/đánh dấu 🔖 (phiên trước) và
  việc vào tab "Đội tuyển" (đồng hồ, nút 🔖 không ảnh hưởng luồng) chạy lại —
  không hồi quy.
- Viewport iPhone 12: 4 thẻ đề + ô tuỳ chọn không tràn ngang trang, nút "Bắt
  đầu" trong mỗi dòng vòng thi nhỏ gọn (≤40×140px), vào màn hỏi/đáp cũng
  không tràn ngang. **92/92 đạt**. Không kiểm thử được trên thiết bị di động
  thật — chỉ giả lập viewport bằng Playwright.

**Giới hạn còn lại**: Tăng tốc (trắc nghiệm) theo Điều 13.2.b vốn chấm theo
tốc độ/thứ hạng **so với các đội khác** ("đúng và nhanh nhất được 10đ, đúng
và nhanh tiếp theo được điểm giảm dần") — không thể mô phỏng khi luyện một
mình, nên vẫn dùng đúng cách đơn giản hoá nhị phân (đúng=10đ, sai/không trả
lời=0đ) **đã áp dụng sẵn ở tab "Đội tuyển"** từ trước, áp dụng lại y hệt cho
từng đề, không phát sinh cách tính mới. Tương tự, việc đội khác giành chuông
ở Gói riêng/chung (trừ ½ điểm) không được mô phỏng — đã ghi chú rõ trong màn
kết quả Chung khảo ("ước tính cá nhân, không mô phỏng việc bị trừ điểm khi
đội khác giành chuông"), kế thừa đúng giới hạn đã công bố ở tab "Đội tuyển".

### 08/11/2026 — tab mới "Luyện tự luận": đo tốc độ gõ, độ chính xác, tự đề xuất độ dài câu theo năng lực

Thêm tab mới **"Luyện tự luận"** cho ngân hàng chính (244 câu): gõ trực tiếp
đáp án (không trắc nghiệm), hệ thống đo **tốc độ gõ thô**, **tốc độ gõ chính
xác**, **độ chính xác**, và chế độ **"Luyện theo năng lực"** tự chọn câu có
độ dài đáp án phù hợp, tăng/giảm dần theo kết quả thực tế.

**Trước khi áp dụng 90 giây/câu**: đối chiếu lại đúng đoạn trích Điều 13.2.b
đã dùng cho tab "Đội tuyển" (`TEAM_RULES.so_khoidong`, ảnh quét
`public/ref/dt-01..05.jpg`) — quy chế ghi rõ *"tổng thời gian đọc câu hỏi và
trả lời **mỗi câu**: 90 giây"* — **per câu**, không phải cho cả phần Khởi
động. "Luyện tự luận" dùng lại đúng hạn này cho mỗi câu
(`teamSeconds('khoidong')`, không đổi), ở **mọi chế độ** (Tự do/Luyện theo
năng lực) — chế độ thích ứng chỉ chọn CÂU HỎI khác nhau, không bao giờ đổi
đồng hồ thi hay cách chấm.

**2 đồng hồ độc lập**: đồng hồ thi (90s/câu, bắt buộc, không tắt được) chạy
ngay khi câu hỏi hiện ra, dùng lại nguyên `startTeamTimer`/`clearTeamTimer`
đã có (chỉ đổi `elId` thành `'essayTimer'` để không đụng `teamBar`). Đồng hồ
**đo tốc độ gõ** là biến riêng `it.typeStart`, chỉ được gán ở lần `oninput`
đầu tiên mà nội dung gõ không còn trống — thời gian đọc đề/suy nghĩ trước đó
không tính vào tốc độ gõ, dù vẫn bị tính vào đồng hồ thi.

**Sửa lỗi ẩn, nay mới phát sinh ảnh hưởng — `canonicalAnswers(q)`**: hàm này
trước đây chỉ lấy đúng **phương án đầu tiên** trong `q.ans` (`q.ans[0]`) làm
đáp án chuẩn cho chế độ trả lời tự do — không sai ở các nơi gọi hiện có (Đội
tuyển/4 đề/Cần ôn lại) vì cả 3 nơi đó đều **loại câu `multi:true`** trước khi
gọi hàm này. Nhưng yêu cầu #5 của tính năng này bắt buộc "Luyện tự luận" phải
chấm được cả câu nhiều đáp án đúng, nên đã sửa hàm để **ghép đầy đủ nội dung
tất cả phương án đúng** (`q.ans.map(k => ...).join('. ')`) khi không có
`ansFull`. Đã kiểm tra cả 9 câu `multi:true` thật của ngân hàng (`I-10`,
`VII-1`, `VII-34`, `VII-43`, `VII-49`, `VIII-26`, `VIII-29`, `VIII-30`,
`VII-53`) — không câu nào dùng cách tham chiếu kiểu "Cả a, b, c" (khác với 3
câu đã gặp ở `dethi4.json` trước đây), toàn bộ đều là nội dung phương án đầy
đủ nên **không cần sửa dữ liệu**, chỉ sửa hàm ghép. Với câu 1 đáp án, kết quả
giống hệt trước (`['x'].join('. ')` = `'x'`) — xác nhận không hồi quy ở Đội
tuyển/4 đề/Cần ôn lại bằng cách chạy lại đầy đủ bộ kiểm thử cũ của 3 tính
năng đó (92 kịch bản, không đổi).

**Công thức đo tốc độ gõ** (mỗi lần nộp bài, `recordTypingSample`):
- `typedWords` = số từ trong câu trả lời đã gõ (chuẩn hoá bằng `normWords`
  — bỏ dấu câu, gộp khoảng trắng, hạ chữ thường, giữ nguyên dấu tiếng Việt).
- `matchedWords` = số từ khớp đúng vị trí với đáp án chuẩn, tính bằng thuật
  toán so khớp dãy con chung dài nhất (LCS) đã có sẵn (`gradeRecall`/
  `lcsAlign`) — **không** phải cứ gõ trúng từ nào đó là tính, phải khớp theo
  đúng thuật toán đối chiếu hiện có để không thể "gõ bừa nhiều từ" làm tăng
  ảo kết quả.
- `typeMs` = mốc thời gian nộp bài − `it.typeStart` (ký tự gõ đầu tiên).
- **Tốc độ gõ thô** = `typedWords ÷ (typeMs/60000)` (từ/phút) — tính trên
  TỔNG số từ gõ ra, kể cả từ sai.
- **Tốc độ gõ chính xác** = `matchedWords ÷ (typeMs/60000)` (từ/phút) —
  CHỈ tính trên số từ khớp đúng; đây là chỉ số dùng để đánh giá năng lực và
  tính độ dài đề xuất, **không dùng tốc độ gõ thô** cho mục đích này, đúng
  yêu cầu "không để nhập bừa làm tăng kết quả đánh giá năng lực".
- **Tỷ lệ khớp đáp án (%)** = `matchedWords ÷ refWords × 100` — dùng lại
  đúng trường `pct` đã có trong `gradeRecall` (nhất quán với cách hiển thị
  "tỷ lệ khớp" ở mọi nơi khác trong ứng dụng).

**Phiên nào bị loại khỏi việc tính tốc độ gõ** (`speedValid=false` — vẫn
được chấm đúng/sai và tính vào Leitner bình thường, chỉ riêng chỉ số tốc độ
gõ không đáng tin):
- **Bỏ trống**: không gõ gì hoặc không xác định được thời gian gõ (`blank`).
- **Dán văn bản**: bắt bằng sự kiện `paste` trên ô nhập (`pasted`).
- **Tốc độ bất thường**: bắt bằng cách theo dõi độ tăng độ dài văn bản mỗi
  lần `oninput` — nếu một lần gõ làm độ dài tăng **hơn 12 ký tự trong chưa
  đầy 60ms** (kể cả lần `oninput` đầu tiên — người gõ tay luôn bắt đầu bằng
  đúng 1 ký tự), coi là dán/điền tự động lọt qua sự kiện `paste` (ví dụ gán
  `.value` bằng script, kéo-thả, tự điền của trình duyệt) (`abnormal`).
- **Thoát giữa chừng**: không nộp bài thì không có phiên nào được ghi nhận
  (không phải loại sau khi ghi — đơn giản là chưa từng tạo ra sample).
- *Xoá rồi gõ lại* KHÔNG bị loại — vẫn tính trong cùng khung thời gian từ ký
  tự gõ đầu tiên tới lúc nộp, đúng với tinh thần "đo thời gian thực tế để ra
  được câu trả lời cuối cùng".

**Đánh giá năng lực** (`typingCompetency`): trung bình tốc độ gõ
thô/chính xác/độ chính xác của **20 phiên hợp lệ gần nhất** (loại các phiên
ở trên) — trả về `null` cho từng chỉ số nếu chưa có phiên hợp lệ nào, **không
bịa số** khi hiển thị (đúng yêu cầu "không sử dụng giá trị giả định").

**Công thức đề xuất độ dài đáp án** (`typingSuggestedWords`, số từ):
1. Quỹ thời gian câu hỏi = 90s (Khởi động, không đổi).
2. Trừ phần dự trữ đọc đề + suy nghĩ = `8 + 0.3 × (độ dài trung bình câu hỏi
   trong ngân hàng, theo từ)` giây — hệ số 0.3s/từ ứng với tốc độ đọc thầm
   trung bình ~200 từ/phút; sàn tối thiểu còn lại cho việc gõ là 30 giây.
3. Số từ gõ được trong quỹ còn lại = `(quỹ gõ/60) × tốc độ gõ CHÍNH XÁC
   trung bình × 0.8` (hệ số an toàn 20%, không ép dùng hết 100% tốc độ đo
   được) `× hệ số phạt độ chính xác` (nếu độ chính xác trung bình < 85%,
   nhân thêm `max(0.5, độ_chính_xác/85)` — hay sai thì gợi ý ngắn hơn).
4. Nhân với **"mức" hiện tại** (1 trong 7 mức từ ×0.55 đến ×1.5, mức giữa
   ×1.0 đúng bằng kết quả bước 3) — mức này tăng/giảm 1 bậc mỗi khi có
   **3 lần liên tiếp** hoàn thành đúng & đúng giờ (tăng) hoặc sai/không kịp
   giờ (giảm), để tạo hiệu ứng "từng bước", không nhảy vọt sau 1 lần.
5. Chưa có ≥ 3 phiên hợp lệ: dùng độ dài **trung vị thật** của toàn bộ đáp
   án trong ngân hàng (~7 từ, tính trực tiếp từ dữ liệu, không phải số bịa)
   làm điểm khởi đầu, có ghi chú rõ "chưa đủ dữ liệu" trên giao diện.

Thử với ví dụ trong yêu cầu (32 từ/phút, 94% chính xác, câu hỏi ~15 từ): quỹ
gõ = 90 − (8+0.3×15) = 77,5s; đề xuất ≈ (77,5/60)×32×0,8×1,0 (94%>85% nên
không phạt) ≈ **33 từ/câu** — khớp với ví dụ "tối đa 30 từ/câu" trong yêu
cầu, xác nhận công thức cho kết quả hợp lý ở đúng mức năng lực nêu trong ví
dụ (ví dụ chỉ mang tính minh hoạ, không phải hằng số bắt buộc phải khớp).

**Chọn câu cho "Luyện theo năng lực"** (`essayStart`): lấy toàn bộ câu phù
hợp bộ lọc (ngành/câu yếu Leitner/câu đã đánh dấu 🔖 — cả 2 bộ lọc này đều
**tuỳ chọn, mặc định tắt**, đúng yêu cầu "nếu người học chọn luyện những
nhóm này"), loại các câu vừa luyện gần đây (`store.d.typing.recentIds`, tối
đa 24 câu gần nhất) để tránh lặp trong thời gian ngắn, sắp theo độ lệch giữa
độ dài đáp án thật của câu và độ dài đề xuất (gần nhất trước), rồi xáo trong
nhóm gần nhất để không luôn ra đúng cùng thứ tự. Việc loại câu gần đây **chỉ
áp dụng ở chế độ thích ứng** — chế độ "Tự do" giữ đúng phạm vi người học
chọn, không tự loại bớt.

**Tái sử dụng** (không viết lại logic chấm): `gradeRecall`, `canonicalAnswers`
(đã sửa), `wordDiffHtml`, `teamAutoGradeBox` (dùng y nguyên để hiển thị kết
quả chấm — không cần nhánh "tự chấm" riêng cho câu `multi` nữa, vì
`canonicalAnswers` giờ luôn trả về 1 đáp án chuẩn đầy đủ), `startTeamTimer`/
`clearTeamTimer`, `d4IsWeak` (lọc "câu yếu"), `store.grade`/`store.star`/
`starBtn` (Leitner + đánh dấu 🔖, đồng bộ nguyên vẹn với tab "Cần ôn lại").
Thêm đúng 1 hàm vẽ biểu đồ mới dùng chung, `sparkline()` — SVG polyline nội
tuyến, không thêm thư viện ngoài (dự án vốn "Zero dependencies").

**Thống kê cá nhân** (tab "Tiến độ", thẻ mới "Tốc độ gõ & độ chính xác"):
tốc độ gõ thô/chính xác trung bình, độ chính xác trung bình, độ dài đáp án
dài nhất từng hoàn thành đúng & đúng giờ (toàn thời gian, không chỉ 20 phiên
gần nhất), số câu đúng & đúng giờ, mức đề xuất hiện tại, và 2 biểu đồ đường
nhỏ (tốc độ gõ chính xác / độ chính xác qua tối đa 15 phiên gần nhất hợp
lệ). Hiện "Chưa có dữ liệu" thay vì số 0/số bịa khi chưa luyện lần nào.

**Lưu trữ**: `store.d.typing = { samples:[], level:3, streak:0, recentIds:[]
}` trong cùng `localStorage` key `hckt2026.v1` — tối đa 200 phiên gần nhất
(phiên cũ nhất tự bị loại khi vượt). Không đổi/xoá `stats`/`starred`/
`history`/`best` hiện có.

**Kiểm thử** bằng Playwright (Chromium, 41 kịch bản mới chạy qua
`node server.js` thật — không phải logic viết lại để test), cộng với chạy
lại đầy đủ 92 kịch bản của 2 tính năng trước (Cần ôn lại, Ôn 4 đề) để xác
nhận không hồi quy:
- Gõ tay thật (ký tự từng cái, qua `page.type`) → `speedValid=true`, WPM/độ
  chính xác dương, hiển thị đúng ô "từ/phút" sau khi chấm.
- Câu nhiều đáp án đúng (lọc đúng cả 9 câu `multi:true` của ngân hàng) → gõ
  đủ nội dung ghép của mọi phương án → chấm đúng tự động, không cần tự chấm.
- Bỏ trống → `blank=true`, `speedValid=false`, vẫn chấm Sai.
- Dán văn bản (giả `ClipboardEvent('paste')` thật) → `pasted=true`,
  `speedValid=false`, vẫn chấm đúng/sai chính xác theo nội dung dán.
- Gán `.value` trực tiếp không qua sự kiện `paste` (`page.fill()`, mô phỏng
  kéo-thả/tự điền) → bắt được bởi heuristic bước nhảy ký tự → `abnormal=true`,
  `speedValid=false`.
- Xoá hết rồi gõ lại nội dung khác → vẫn `speedValid=true`, không bị loại.
- Thoát giữa chừng (điều hướng sang tab khác khi đang gõ, chưa nộp) → không
  sinh ra sample nào trong `store.d.typing.samples`.
- Đồng hồ thi (90s) tiếp tục chạy dù chưa gõ gì; `it.typeStart` giữ `null`
  tới đúng ký tự gõ đầu tiên; hết 90 giây tự nộp bài hiện tại (kể cả khi
  chưa gõ xong), đánh dấu `completedInTime=false` nhưng phiên vẫn
  `speedValid=true` nếu có gõ tay thật trong lúc đó.
- 3 lần liên tiếp đúng & đúng giờ → tăng đúng 1 mức; 3 lần liên tiếp sai →
  giảm đúng 1 mức.
- Lọc "chỉ câu yếu"/"chỉ câu đã đánh dấu 🔖" lọc đúng số câu phù hợp.
- Đánh dấu 🔖 trong "Luyện tự luận" đồng bộ đúng sang "Cần ôn lại", không
  trùng lặp.
- Tab "Tiến độ": hiện "Chưa có dữ liệu" trước khi luyện, hiện đúng số liệu
  thật + biểu đồ sau khi có ≥ 2–3 phiên hợp lệ.
- Dữ liệu tốc độ gõ sống sót qua `page.reload()`.
- Viewport iPhone 12: màn thiết lập và màn hỏi/đáp không tràn ngang; thanh
  điều hướng dưới (giờ 11 tab) vẫn vừa khít viewport 390px (11×35px), có tab
  "Tự luận".
- Chạy lại nguyên 92 kịch bản cũ (đánh dấu/Cần ôn lại, 4 đề × 2 vòng, đồng
  hồ Đội tuyển) — không hồi quy. **133/133 đạt.**

**Giới hạn còn lại**:
- Heuristic phát hiện "tốc độ gõ bất thường" (ngưỡng 12 ký tự/60ms) là một
  lựa chọn hợp lý nhưng không chứng minh được bằng tài liệu quy chế — có thể
  một số trường hợp gõ rất nhanh thật (hiếm) bị loại nhầm khỏi thống kê tốc
  độ (vẫn được chấm đúng/sai bình thường, chỉ không tính WPM của phiên đó).
- Không phát hiện được "nhập không có ý nghĩa" theo nghĩa ngữ dụng (gõ linh
  tinh nhưng vẫn ở tốc độ bình thường, không dán, không bỏ trống) — nằm
  ngoài khả năng phân tích ngôn ngữ của ứng dụng; nội dung đó vẫn được chấm
  Sai (không khớp đáp án chuẩn) nên không làm sai điểm đúng/sai, nhưng VẪN
  được tính vào tốc độ gõ nếu không bị dán/bất thường/bỏ trống — chấp nhận
  đây là giới hạn đã biết, ghi rõ ở đây theo đúng yêu cầu báo cáo minh bạch.
- Dự trữ thời gian đọc đề/suy nghĩ trong công thức đề xuất độ dài dùng độ
  dài câu hỏi TRUNG BÌNH của cả ngân hàng (một hằng số), không tính riêng
  theo độ dài của từng câu hỏi cụ thể đang xét — đơn giản hoá có chủ đích để
  công thức dễ hiểu/kiểm chứng; có thể tinh chỉnh thành công thức theo từng
  câu nếu cần chính xác hơn.

### 08/11/2026 (tiếp) — phân loại "Luyện tự luận" theo độ dài đáp án, khu vực "Ưu tiên luyện 90 giây"

Thêm khu vực **"Ưu tiên luyện 90 giây"** làm màn hình mặc định của tab
"Luyện tự luận": chỉ gồm câu có đáp án **≤30 từ** và có thể trả lời trực
tiếp rõ nghĩa (không cần nhìn thấy A/B/C/D), cùng 3 nhóm phụ theo độ dài
("Nâng cao" 31–40 từ, "Câu dài" 41–60 từ, "Rất dài" >60 từ) và "Tất cả câu
hỏi" — tất cả tính sẵn, hiển thị ngay số câu đủ điều kiện, 1 chạm để bắt đầu.

**Đếm từ bằng ĐÚNG hàm dùng khi chấm** (không đếm riêng): dùng lại
`answerWordCount`/`normWords`/`canonicalAnswers` đã có — không viết hàm đếm
từ riêng cho thống kê, tránh lệch số giữa lúc phân loại và lúc chấm. Với câu
nhiều đáp án đúng, bắt buộc dùng nội dung đã ghép đầy đủ (qua `canonicalAnswers`/
`ansFull`), không đếm theo 1 phương án hay theo độ dài câu hỏi — đúng yêu cầu.

**Rà soát toàn bộ 244 câu trước khi phân loại** (không chỉ lọc theo số từ —
dùng một fork kiểm tra độc lập, bản thân tôi đối chiếu lại từng câu trước
khi áp dụng, không tự suy đoán):

1. **24 câu đáp án tham chiếu kiểu "Cả a, b, c"/"Tất cả các phương án trên"**
   (đáp án đúng chỉ trỏ vào các phương án khác, không có nội dung riêng) —
   thêm `ansFull` (ghép nội dung các phương án còn lại, lấy đúng từ dữ liệu
   đã có, không suy đoán thêm) cho: `III-4, IV-18, IV-22, IV-34, VI-10,
   VII-4, VII-5, VII-7, VII-11, VII-15, VII-16, VII-18, VII-20, VII-21,
   VII-24, VII-25, VII-37, VII-38, VII-40, VII-44, VII-45, VII-51, VII-57,
   VII-59`. **Việc này phải làm TRƯỚC khi phân loại theo độ dài** — nếu phân
   loại trên văn bản gốc chưa sửa, tới 18/24 câu này sẽ bị tính sai là rất
   ngắn (3–6 từ, do chỉ đếm cụm "Cả a, b, c") trong khi đáp án thật dài
   27–114 từ, làm lệch hẳn nhóm "Ưu tiên luyện 90 giây".
2. **24 câu có cách hỏi phụ thuộc phương án** (dò theo các mẫu nêu trong yêu
   cầu: "...nào sau đây...", "phát biểu nào", "chọn đáp án", v.v. — xem đủ
   24 câu khớp mẫu trong lịch sử phiên làm việc), rà từng câu theo đúng
   nguyên tắc "không suy đoán kiến thức ngoài dữ liệu":
   - **4 câu đưa vào "Cần rà soát", loại khỏi MỌI nhóm luyện tự luận**:
     `I-6`, `I-13`, `I-14` (dạng "nội dung nào KHÔNG thuộc/KHÔNG phải..." —
     đúng/sai chỉ xác định được khi đối chiếu với các phương án còn lại,
     không có câu trả lời độc lập rõ nghĩa khi ẩn phương án) và `VII-34`
     ("Phát biểu nào sau đây là đúng?" — không có một chữ nội dung chủ đề
     nào ngoài các phương án, không thể hỏi trực tiếp mà không suy đoán).
   - **10 câu diễn đạt lại phần hỏi** (thêm trường `qEssay`, CHỈ đổi cách
     hỏi khi hiển thị ở "Luyện tự luận", không đổi `q`/`opts`/`ans` gốc dùng
     ở mọi nơi khác — có badge "Đã diễn đạt lại" công khai trên màn hình):
     `IV-18, IV-20, IV-25, IV-31, VII-1, VII-36, VII-39, VII-46, VII-47,
     VII-51` — mỗi câu chỉ bỏ đúng cụm tham chiếu phương án ("...nào sau
     đây là đúng" → "...là gì"/"...gồm những gì"), giữ nguyên toàn bộ nội
     dung chủ đề đã có trong câu hỏi gốc (ví dụ `VII-46`: cả 3 phương án
     dùng chung tiền tố "Quản lý trang bị kỹ thuật gồm quản lý..." nên lấy
     đúng tiền tố đó làm câu hỏi, không bịa thêm).
   - **10 câu còn lại khớp mẫu dò nhưng vốn đã rõ nghĩa** (dùng "nào" như
     từ hỏi mở bình thường, ví dụ "...gồm những nội dung nào?" — không phụ
     thuộc phương án): giữ nguyên, không đổi gì.

**Phát hiện thêm, ngoài phạm vi yêu cầu nhưng liên quan trực tiếp đến "tránh
trùng câu"**: khi rà soát độc lập, phát hiện `VIII-33` (1 trong 16 câu được
thêm khi nhập bộ đề CamScanner 5-11-26, xem mục "Nhật ký khôi phục
05/11/2026" phía trên) **trùng NGUYÊN VĂN 100%** câu hỏi/phương án/đáp án với
`VIII-10` (đã có từ trước, thuộc 228 câu gốc) — một lỗi dữ liệu có từ lần
nhập trước, **không phải do tính năng này gây ra**, nhưng README trước đó
ghi "không có câu nào bị bỏ ngỏ" cho 16 câu mới cần được đính chính: kiểm tra
trùng lúc đó chỉ đối chiếu 16 câu mới với NHAU và với 228 câu cũ theo nội
dung rút gọn, không phát hiện được cặp này vì bị rút gọn khác nhau ở bước
nhập liệu. **Không xoá `VIII-33` khỏi dữ liệu gốc** (đúng yêu cầu "không xoá
bất kỳ câu hỏi gốc nào") — chỉ loại `VIII-33` khỏi việc CHỌN câu cho "Luyện
tự luận" (hằng số `ESSAY_DUP_SKIP` trong `app.js`) để không luyện trùng nội
dung 2 lần trong 1 lượt; câu vẫn còn nguyên, vẫn hoạt động bình thường ở
Luyện tập/Tra cứu/mọi nơi khác.

**Vì sao ngân hàng có 244 câu, không phải 228** (xác nhận lại claim cũ, có
đính chính 1 điểm ở trên): 228 câu gốc từ `Bo_cau_hoi_Hoi_thi_0001.pdf` +
16 câu thực sự mới từ bộ đề mô phỏng Đội tuyển (`CamScanner 5-11-26`, ID:
`VIII-33, VII-53..VII-63, II-31, II-32, IV-36, IV-37`) = 244, đúng số lượng
ID đếm được trong `questions.json` hiện tại, không ID nào trùng/bỏ sót giữa
2 nguồn — chỉ riêng `VIII-33` hoá ra lại trùng nguyên văn với `VIII-10` sẵn
có trong 228 câu gốc (xem trên), một trường hợp đơn lẻ không ảnh hưởng tới
tổng số 244.

**Giữ nguyên "Luyện theo năng lực"**: tách hẳn khỏi luồng theo nhóm độ dài —
vẫn dùng đúng `typingSuggestedWords()`/`essayStartAdaptive()` như phiên bản
trước, không bị nhóm hoá can thiệp. Việc thêm lọc `essayEligible` (loại câu
"Cần rà soát" + câu trùng) vào `essayPool()` áp dụng luôn cho chế độ này —
đây là một SIẾT CHẶT nhất quán (không bao giờ nên gợi ý câu hỏng/trùng ở bất
kỳ chế độ nào), không phải thay đổi thuật toán thích ứng.

**Không coi câu ngắn là dễ một cách tĩnh**: thứ tự "Ưu tiên câu yếu (Leitner)"
— mặc định khi vào bất kỳ nhóm nào — sắp câu theo hộp Leitner thấp/sai nhiều
trước, dựa trên dữ liệu luyện tập THẬT của người học, không dựa vào việc câu
đó thuộc nhóm ngắn hay dài. Có thêm lựa chọn "Ngẫu nhiên" nếu không muốn ưu
tiên theo Leitner.

**Thời gian**: nhóm "Ưu tiên luyện 90 giây" luôn giữ đúng đồng hồ 90s/câu
(không có nút tắt). Các nhóm còn lại có thêm 1 ô "Không giới hạn thời gian"
(mặc định tắt) — khi bật, `app.essay.timed=false`, không khởi động
`startTeamTimer`, màn hình hiện nhãn "Không giới hạn thời gian" thay đồng
hồ; mọi lần nộp bài trong chế độ này đều tính `completedInTime=true` (không
có hạn để trễ). Đồng hồ đo tốc độ gõ (`it.typeStart`) không đổi, vẫn luôn
độc lập với đồng hồ thi ở mọi chế độ.

**Giao diện**: tái dùng toàn bộ CSS đã có — class `.d4-round-row` (từ tính
năng "Ôn 4 đề") cho các dòng nhóm phụ, `.rule-row` (từ tab "Quy chế") cho
danh sách "Cần rà soát", `.sw`/`.chips`/`.card.pad`/`.sec-title` như mọi nơi
khác. **Không thêm dòng CSS mới nào.** Không thêm tab cấp cao mới — toàn bộ
nằm trong tab "Luyện tự luận" đã có.

**Kiểm thử** bằng Playwright (Chromium, 30 kịch bản mới ở 2 file riêng cho
đúng tính năng này — gồm cả trường hợp nhóm rất hẹp/0 câu — chạy qua
`node server.js` thật), cộng chạy lại toàn bộ bộ kiểm thử trước đó (bookmark/
Cần ôn lại, Ôn 4 đề, bản gốc "Luyện tự luận") sau khi sửa lại 2 kịch bản của
bản gốc bị **ngẫu nhiên/không ổn định** do giao diện đổi cấu trúc (nút
"Bắt đầu" cũ không còn là nút duy nhất trên trang nên chọn nhầm nút, và 1
kịch bản tình cờ chọn đúng câu có đáp án quá ngắn khiến heuristic phát hiện
dán/điền tự động không có cơ hội kích hoạt — cả 2 đều là lỗi chọn phần tử
trong kịch bản kiểm thử, không phải lỗi của ứng dụng, đã sửa để kiểm thử
luôn nhắm đúng phần tử/độ dài cần thiết, chạy lại ổn định nhiều lần). Tổng
cộng chạy lại được **165/165 kịch bản đạt** trên toàn bộ các tính năng:
- Đúng số liệu từng nhóm tính trực tiếp từ dữ liệu thật: Ưu tiên 181 câu,
  Nâng cao 16, Câu dài 23, Rất dài 18 (tổng 238 = 243 câu có đáp án hợp lệ −
  4 câu "Cần rà soát" − 1 câu trùng `VIII-33`).
- Mặc định vào tab là nhóm "Ưu tiên luyện 90 giây", phiên bắt đầu từ nhóm
  này luôn `timed=true`.
- `essayReview`/câu trùng không bao giờ xuất hiện trong bất kỳ nhóm nào kể
  cả "Tất cả câu hỏi" — xác nhận trực tiếp trên tập 238 câu của phiên thật.
- Câu có `qEssay` (ví dụ `VII-51`) hiển thị đúng câu hỏi đã diễn đạt lại kèm
  badge công khai, khác với câu hỏi gốc; chấm điểm vẫn dựa trên `q.ans`/
  `q.opts`/`ansFull` gốc, không bị ảnh hưởng bởi `qEssay`.
- Bật "Không giới hạn thời gian" cho nhóm "Nâng cao": không có `#essayTimer`,
  hiện nhãn thay thế, chờ 300 giây (giả lập bằng Playwright Clock) không tự
  nộp bài; nộp tay vẫn luôn `completedInTime=true`.
- Thứ tự "Ưu tiên câu yếu": gieo 5 câu có hộp Leitner=1 (sai nhiều) giữa một
  nhóm toàn câu hộp 5 (đã thuộc) — lấy đúng 5 câu đó khi chọn 5 câu đầu.
  "Luyện lại" sau 1 phiên nhóm nào khởi động lại đúng nhóm đó.
  Giao diện di động (iPhone 12): toàn bộ màn hình mới (bộ lọc + thẻ ưu tiên
  + 4 dòng nhóm phụ + thẻ thích ứng + danh sách rà soát) không tràn ngang
  trang, cả màn thiết lập và màn hỏi/đáp. **165/165 kịch bản đạt** (30 mới
  cho riêng tính năng này + toàn bộ kịch bản các tính năng trước).

**Giới hạn còn lại**:
- 10 câu dùng `qEssay` là diễn đạt lại CÓ CHỦ Ý, mang tính bảo toàn (chỉ bỏ
  cụm tham chiếu phương án, giữ nguyên câu chữ còn lại) — không phải diễn
  đạt tự nhiên nhất có thể; có thể còn đọc hơi cứng ở một số câu (ví dụ
  `VII-46` dùng nguyên tiền tố chung của 3 phương án làm câu hỏi).
- 4 câu "Cần rà soát" bị loại HOÀN TOÀN khỏi "Luyện tự luận" (không chỉ khỏi
  nhóm ưu tiên) vì không có cách diễn đạt lại nào bảo toàn đúng kiến thức
  gốc mà không suy đoán thêm — nếu sau này có thêm ngữ cảnh/tài liệu gốc để
  xác nhận cách hỏi trực tiếp đúng, có thể bỏ cờ `essayReview` và thêm
  `qEssay` cho từng câu.
- Việc rà soát 244 câu theo các mẫu câu hỏi nêu trong yêu cầu dùng quy tắc
  dò (regex) + xét từng câu khớp mẫu thủ công, không phải đọc lại tự do cả
  244 câu không theo mẫu nào — một câu hỏi phụ thuộc phương án theo cách
  diễn đạt khác, không khớp bất kỳ mẫu đã dò, có thể bị sót (không có mẫu
  nào trong yêu cầu gợi ý cách diễn đạt này nên không mở rộng dò thêm để
  tránh suy đoán ngoài yêu cầu).

### 08/11/2026 (tiếp 2) — sửa tận gốc cơ chế giải đáp án tham chiếu, phát hiện 1 lỗi thật trong lần vá trước

Người dùng báo lỗi thực tế: màn "Luyện tự luận" hiển thị đáp án chuẩn là
**"Cả 2 nội dung trên"** cho một câu — đúng là lỗi, vì lần vá trước (mục
"08/11/2026 (tiếp)" phía trên) chỉ thêm `ansFull` **thủ công** cho đúng 24
ID đã tìm được bằng 1 quy tắc dò hẹp, không phải một **hàm giải tham chiếu
chung** — đúng như yêu cầu hiện tại đã chỉ ra. Đã bỏ cách vá thủ công, xây
lại từ gốc bằng 1 hàm dùng chung cho toàn bộ hệ thống.

**Hàm mới `resolveReferentialAnswer(q)` + `detectReferential(text, optKeys)`**
(`public/app.js`) — thay cho việc liệt kê ID cố định:
1. Phát hiện tham chiếu bằng **cấu trúc câu**, không dò chuỗi cố định: nhóm
   "tất cả/toàn bộ/cả (các) &lt;danh từ bất kỳ&gt; trên/khác (đều đúng/chính
   xác)?" (danh từ dùng ký tự đại diện không giới hạn, bắt được "nội dung",
   "phương án", "đáp án", "ý", "bước", "trường hợp", "yếu tố"… mà không cần
   liệt kê từng từ) và nhóm "Cả a, b, c" / "A và B đúng" (liệt kê đúng các
   ký tự phương án được nêu tên). Cả 2 nhóm đều neo `^...$` vào TOÀN BỘ văn
   bản phương án đã chuẩn hoá (bỏ dấu câu cuối, hạ chữ thường), không thể
   khớp nhầm vào giữa 1 câu dài chỉ vì câu đó chứa chữ "trên"/"khác".
2. Với nhóm "liệt kê ký tự", **chỉ ghép đúng các phương án được nêu tên**,
   không tự suy ra "mọi phương án khác" — khác nhóm "tất cả/toàn bộ".
3. Đệ quy tối đa 4 cấp nếu phương án được tham chiếu lại tiếp tục tham
   chiếu phương án khác (câu hỏi yêu cầu #3.4).
4. Xử lý được câu nhiều đáp án đúng đồng thời (`q.ans` nhiều khoá, có khoá
   là tham chiếu, có khoá là nội dung thật) và câu 1 đáp án duy nhất nhưng
   nội dung là "Tất cả các đáp án trên" (yêu cầu #3, đoạn cuối).
5. Gặp tham chiếu **phủ định** ("Không có phương án nào đúng.") hoặc thiếu
   dữ liệu: trả về "không giải được", **không bịa đáp án** — nơi gọi sẽ coi
   câu đó là cần rà soát (xem `answerUnresolved`/`essayReviewList` dưới).

**`canonicalAnswers(q)` dùng hàm trên làm cơ chế chính** (thứ tự: `q.ansFull`
thủ công đã xác minh → tự giải bằng `resolveReferentialAnswer` → nếu không
giải được, dùng nguyên văn `q.ans` như trước, không suy đoán thêm) — áp
dụng cho **mọi nơi gọi `canonicalAnswers`**, không chỉ "Luyện tự luận": Đội
tuyển (Khởi động), "Ôn 4 đề trọng tâm", "Cần ôn lại" đều tự động được sửa
theo, đúng yêu cầu "xây dựng một hàm xử lý đáp án chuẩn dùng chung để tránh
lỗi tương tự ở các chức năng khác".

**Kiểm toán lại TOÀN BỘ 244 câu** (không chỉ 24 câu đã vá trước đó) bằng
chính hàm mới, chạy độc lập ngoài ứng dụng để xác minh trước khi tích hợp:
- **243 câu có đáp án hợp lệ** đã kiểm tra (244 câu − 1 câu `VII-12` chưa
  xác định đáp án, có từ trước, không liên quan lỗi này).
- **29 câu phát hiện đáp án tham chiếu** (tăng từ 24 đã biết trước đó, tìm
  thêm đúng **5 câu bị bỏ sót** vì quy tắc dò hẹp trước đây chỉ liệt kê
  "phương án/đáp án/ý/nội dung/phát biểu" — không khớp các cách diễn đạt
  khác đang dùng thật trong dữ liệu: `IV-3`, `IV-14`, `IV-16` ("Cả **hai**
  phương án trên" — dùng chữ "hai", không phải số "2", quy tắc cũ chỉ nhận
  `\d*`), `VI-7` ("Cả hai **trường hợp** trên" — danh từ "trường hợp" chưa
  có trong danh sách liệt kê cũ), `VII-30` ("Tất cả các **bước** trên" —
  danh từ "bước" cũng chưa có). **Toàn bộ 29/29 câu đều tự giải được** —
  không câu nào phải đưa vào "Cần rà soát" vì đáp án (khác với rà soát vì
  CÂU HỎI mơ hồ, vẫn giữ nguyên 4 câu `I-6/I-13/I-14/VII-34` từ lần trước).
- **Phát hiện 1 lỗi thật trong lần vá thủ công trước** (minh chứng rõ nhất
  cho việc cần hàm giải chung thay vì vá tay): câu `VII-5` có 5 phương án
  a,b,c,d,đ, đáp án đúng đ = "**Cả a, b, c**" — chỉ nêu tên a, b, c, KHÔNG
  nhắc tới d (d là phương án gây nhiễu riêng, nội dung "Nối chung bộ phận
  tiếp đất chống sét cảm ứng…", hoàn toàn không liên quan). Bản vá tay lần
  trước đã **gộp nhầm cả d** vào đáp án chuẩn (coi "Cả a,b,c" như kiểu "tất
  cả phương án khác"), khiến người học phải gõ thêm 1 ý KHÔNG có trong đáp
  án thật mới được tính đúng. Hàm mới đọc đúng danh sách ký tự được nêu tên
  (a, b, c) nên tự sửa đúng, không cần biết trước đây có lỗi.
- **Lỗi kỹ thuật phát hiện trong lúc xây hàm** (không phải lỗi dữ liệu):
  quy tắc tách ký tự a/b/c/d/đ ban đầu quét `\b[a-eđ]\b` trên TOÀN BỘ chuỗi
  đã khớp — vô tình bắt được chữ "c" ngay trong từ "**C**ả" (do `\b` của
  JavaScript chỉ coi ký tự ASCII là "ký tự từ", dấu thanh tiếng Việt như
  "ả" bị coi là ký tự khác loại, tạo ranh giới từ giả ngay sau "C"), khiến
  câu `VII-18` ("Cả a, b.") tự tham chiếu vào chính nó qua chữ "c" giả →
  lặp vô hạn. Sửa bằng cách chỉ tách ký tự từ ĐÚNG phần bắt được trong
  nhóm regex (không quét lại toàn chuỗi), tách theo dấu phẩy/"và" thay vì
  quét ranh giới từ.
- **Không có câu nào trong 244 câu dùng tham chiếu phủ định** ("Không có
  phương án nào đúng") — quy tắc phát hiện nhóm này vẫn giữ trong hàm để
  phòng xa, nhưng hiện chưa có câu nào kích hoạt nhánh "không giải được".
- **Kiểm tra cả `dethi4.json`** (80 câu "Ôn 4 đề trọng tâm") dù yêu cầu chỉ
  nêu 244 câu, vì hàm `canonicalAnswers` dùng chung cho cả 2 ngân hàng:
  phát hiện thêm `DT1-TT-3` ("Cả a, b, c" — chưa có `ansFull` thủ công từ
  trước) nay tự giải đúng; 3 câu đã có `ansFull` thủ công từ phiên làm
  việc trước (`DT2-GC-1`, `DT3-KD-3`, `DT3-GC-3`) vẫn đúng nội dung khi đối
  chiếu với kết quả hàm mới (chỉ khác cách nối câu — dùng ";" thay vì "."
  — không phải lỗi, **giữ nguyên không đổi**, không có rủi ro hồi quy vì
  `canonicalAnswers` luôn ưu tiên `ansFull` thủ công trước).

**Thay đổi dữ liệu** (`data/questions.json` và `public/data/questions.json`
— giữ đồng bộ 2 bản như quy ước của dự án):
- **Xoá `ansFull` thủ công đã thêm trước đó ở 24 câu** (không còn cần thiết
  vì hàm tự giải đúng, và giữ lại bản cũ có rủi ro lệch khi dữ liệu
  `q.opts` thay đổi sau này — ví dụ chính lỗi `VII-5` nêu trên) — để hàm
  `resolveReferentialAnswer` tính lại động từ `q.ans`/`q.opts` mỗi lần, một
  nguồn sự thật duy nhất.
- Thêm `qEssay` (chỉ đổi cách hiển thị câu hỏi ở "Luyện tự luận", không đổi
  `q`/`opts`/`ans` gốc) cho 2 câu phát hiện thêm khi rà soát đồng thời phần
  câu hỏi của 5 câu referential mới tìm được (yêu cầu #5 "Kiểm tra đồng
  thời phần câu hỏi tự luận"): `IV-3` (bỏ cụm "...nào là đúng theo quy
  định...", giữ nguyên số hiệu văn bản/điều khoản) và `IV-16` (câu hỏi gốc
  bỏ lửng bằng dấu ":", viết lại thành câu hỏi hoàn chỉnh "...được hỗ trợ
  như thế nào?", giữ nguyên toàn bộ nội dung quy định đã nêu). 3 câu còn
  lại (`IV-14`, `VI-7`, `VII-30`) rà soát xong xác nhận câu hỏi ĐÃ rõ nghĩa
  sẵn, không cần đổi — đúng yêu cầu "chỉ tự động chuyển khi có đủ căn cứ
  giữ nguyên ý nghĩa", không đổi những câu không cần đổi.
- **Không xoá, không viết lại nội dung bất kỳ câu hỏi/phương án gốc nào** —
  chỉ thêm/xoá đúng 2 trường hỗ trợ hiển thị (`qEssay`) và tính toán
  (`ansFull`), đúng yêu cầu bảo toàn dữ liệu gốc.

**Cập nhật phân loại theo độ dài đáp án** (đúng yêu cầu #4 "Cập nhật phân
loại câu ngắn, câu dài và nhóm Ưu tiên luyện 90 giây" — vì 3 trong 5 câu
tìm thêm có đáp án thật DÀI HƠN NHIỀU so với cụm tham chiếu ngắn trước đây
tưởng là đáp án):
| Câu | Số từ đáp án thật | Nhóm trước (tính nhầm trên cụm tham chiếu) | Nhóm đúng sau khi sửa |
|---|---|---|---|
| `IV-3` | 77 từ | Ưu tiên (≤30, sai) | Rất dài |
| `VI-7` | 85 từ | Ưu tiên (≤30, sai) | Rất dài |
| `VII-30` | 48 từ | Ưu tiên (≤30, sai) | Câu dài |
| `IV-14` | 6 từ | Ưu tiên | Ưu tiên (đúng, không đổi) |
| `IV-16` | 26 từ | Ưu tiên | Ưu tiên (đúng, không đổi) |

Số liệu từng nhóm (238 câu đủ điều kiện luyện tự luận, không đổi — chỉ đổi
PHÂN BỔ giữa các nhóm): **Ưu tiên luyện 90 giây 178** (giảm từ 181 — đúng
3 câu nêu trên rời khỏi nhóm), **Nâng cao 16** (không đổi), **Câu dài 24**
(tăng từ 23, nhận `VII-30`), **Rất dài 20** (tăng từ 18, nhận `IV-3`/`VI-7`).
Trước khi sửa, 3 câu `IV-3`/`VI-7`/`VII-30` lẽ ra đã bị đưa NHẦM vào nhóm
"Ưu tiên luyện 90 giây" — người học sẽ phải gõ 48–85 từ trong 90 giây,
hoàn toàn không khả thi — đúng đúng loại lỗi mà yêu cầu #4 cảnh báo
("không tự động coi câu ngắn là dễ") dù ở đây nguyên nhân là đếm từ SAI
trên cụm tham chiếu, không phải coi thường độ khó.

**Chấm điểm**: không đổi cơ chế — `gradeRecall` vẫn so khớp CHÍNH XÁC toàn
bộ từ với `canonicalAnswers(q)` (nay đã đúng, đầy đủ nội dung bắt buộc,
không thiếu/không thừa phương án gây nhiễu). Vẫn giữ đúng 2 yêu cầu đã có
từ trước: chỉ công nhận đúng khi gõ ĐỦ toàn bộ nội dung bắt buộc (không có
điểm một phần), và câu nhiều ý không được tính đúng chỉ vì gõ 1 ý (đã kiểm
thử lại, xem dưới). **Không đổi đáp án/cơ chế chấm trắc nghiệm gốc** —
`q.ans`/`q.opts` dùng cho trắc nghiệm hoàn toàn không bị đụng tới, chỉ
`canonicalAnswers` (chỉ dùng cho trả lời tự do) thay đổi.

**Kiểm thử**:
- **40 unit test thuần (Node, không qua trình duyệt)** cho riêng 2 hàm
  `detectReferential`/`resolveReferentialAnswer`, bao trùm đúng toàn bộ ví
  dụ nêu trong yêu cầu ("Cả 2/3 nội dung trên", "Tất cả các đáp án trên",
  "Tất cả các phương án đều đúng", "Các nội dung trên đều đúng", "A và B
  đúng", "B và C đúng", "Cả A, B và C", "Các phương án khác có cùng ý
  nghĩa") + biến thể hoa/thường, khoảng trắng thừa, dấu câu cuối (`.`/`!`/
  `?`/không có) + tham chiếu lồng nhau (phương án được tham chiếu lại tham
  chiếu tiếp) + câu nhiều đáp án đúng đồng thời kết hợp 1 đáp án tham chiếu
  + tham chiếu phủ định (phải KHÔNG giải được, không bịa) + không có false
  positive trên câu thật chứa "trên"/"khác"/"phương án" ở giữa câu dài +
  hồi quy đúng lỗi "Cả a, b." tự tham chiếu đã phát hiện ở `VII-18`.
  **40/40 đạt.**
- Playwright (Chromium, `node server.js` thật): xác nhận `VII-5` không còn
  gộp nhầm phương án d; gõ đúng 3 ý thật (a,b,c) của `VII-5` → chấm Đúng;
  gõ chỉ 1 trong 2 ý bắt buộc của `III-4` → chấm Sai, tỷ lệ khớp nằm giữa
  0% và 100% (không phải tất-cả-hoặc-không-gì ở mức hiển thị, nhưng vẫn
  Sai ở quyết định đúng/sai cuối); câu `VII-5` ở chế độ trắc nghiệm (Luyện
  tập) vẫn hiện đủ nguyên 5 phương án a,b,c,d,đ không đổi, xác nhận không
  đụng tới cơ chế trắc nghiệm gốc.
- Chạy lại toàn bộ bộ kiểm thử trước đó (6 file tính năng Cần ôn lại/Ôn 4
  đề/Đội tuyển + 5 file "Luyện tự luận"/phân nhóm độ dài, cộng 2 chỗ đếm
  cứng số liệu nhóm "Ưu tiên" trong kịch bản kiểm thử cũ đã cập nhật từ 181
  sang 178 cho khớp số liệu đúng mới) — không hồi quy.
- **Tổng cộng 172 kịch bản Playwright + 40 unit test = 212 lượt kiểm thử,
  tất cả đạt.**

**Báo cáo theo đúng yêu cầu mục 7**:
- Tổng số câu đã kiểm tra: **244** (243 có đáp án hợp lệ).
- Số câu phát hiện đáp án tham chiếu: **29** (ngân hàng chính) + **4** đã
  biết từ trước ở `dethi4.json` + **1** mới phát hiện thêm ở `dethi4.json`
  (`DT1-TT-3`, tự giải, không cần sửa dữ liệu).
- Danh sách ID đã sửa (xoá `ansFull` tay, để hàm tự giải): `III-4, IV-18,
  IV-22, IV-34, VI-10, VII-4, VII-5, VII-7, VII-11, VII-15, VII-16, VII-18,
  VII-20, VII-21, VII-24, VII-25, VII-37, VII-38, VII-40, VII-44, VII-45,
  VII-51, VII-57, VII-59` (24 câu, trong đó `VII-5` sửa đúng 1 lỗi thật).
  5 câu mới tự giải, không cần sửa dữ liệu: `IV-3, IV-14, IV-16, VI-7,
  VII-30`. 2 câu thêm `qEssay`: `IV-3, IV-16`.
- Nội dung trước/sau của trường hợp lỗi thật (`VII-5`): xem bảng/đoạn mô
  tả phía trên (trước: gộp nhầm cả phương án d gây nhiễu; sau: đúng 3
  phương án a, b, c được nêu tên).
- Câu không thể xử lý tự động: **0/244** — không câu nào trong dữ liệu
  hiện có kích hoạt nhánh "tham chiếu phủ định"/"thiếu dữ liệu" của hàm.
  Cơ chế đánh dấu "Cần rà soát" vẫn giữ nguyên trong code (`answerUnresolved`
  + `essayReviewList`) để tự động bắt các câu này nếu phát sinh sau này khi
  thêm câu hỏi mới, không cần sửa code thêm.
- Kết quả kiểm thử xác nhận mọi đáp án tự luận được tạo đúng từ dữ liệu
  gốc: xem mục Kiểm thử phía trên, 212/212 đạt.

**Giới hạn còn lại**:
- Quy tắc dò "danh từ bất kỳ" (`.{0,24}?`) vẫn có thể bỏ sót một cách diễn
  đạt tham chiếu hoàn toàn khác cấu trúc (không chứa "trên"/"khác"/"đều
  đúng"/liệt kê ký tự) — nếu phát sinh câu như vậy trong dữ liệu thêm sau
  này, `canonicalAnswers` sẽ âm thầm rơi về nguyên văn tham chiếu (hành vi
  cũ, giống lỗi ban đầu) chứ không tự phát hiện được; nên rà lại bằng cùng
  bộ unit test này mỗi khi nhập thêm câu hỏi mới vào ngân hàng.
- Không đọc lại độc lập toàn bộ 244 câu bằng mắt để tìm tham chiếu — dùng
  quy tắc regex tổng quát rồi xác minh TỪNG câu khớp mẫu bằng cách đọc trực
  tiếp dữ liệu (đã làm cho toàn bộ 29 câu), không phải đọc toàn bộ 244 câu
  không theo mẫu nào; vẫn có khả năng (dù thấp hơn nhiều so với cách liệt
  kê chuỗi cố định trước đây) sót 1 cách diễn đạt chưa từng gặp.
