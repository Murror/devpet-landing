---
title: "Cách để ứng dụng AI của bạn có trí nhớ"
description: "Model AI vốn không có trí nhớ. Đây là cách xây dựng bộ nhớ ngắn hạn, dài hạn và theo phiên cho sản phẩm AI — mà không cần làm kiến trúc trở nên phức tạp không cần thiết."
date: "2026-07-02"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["memory", "context", "rag", "llm", "product", "context-window"]
---

Có một điểm mù mà hầu như mọi sản phẩm AI đều mắc phải từ ngày đầu: **model không nhớ gì khi một phiên làm việc kết thúc.**

Người dùng dành cả buổi để giải thích dự án của họ — mục tiêu, ngữ cảnh, những ràng buộc cụ thể. Model phản hồi rất tốt. Họ quay lại hôm sau và model chào họ như người lạ hoàn toàn.

Đây là trạng thái mặc định của mọi sản phẩm chạy trên nền LLM. Model không có quá khứ - chúng chỉ biết những gì được đưa vào prompt. Và khi bạn đang xây một sản phẩm thật, giải quyết vấn đề này không còn là chuyện tùy chọn nữa - đó thường là bài toán kiến trúc đầu tiên bạn đụng phải, thường là ngay sau ngày demo.

Tin tốt là: đây là bài toán đã có lời giải, chỉ là không phải lúc nào cũng đơn giản. Cách tôi thường nghĩ về bộ nhớ trong sản phẩm AI là chia thành ba lớp - mỗi lớp phục vụ một nhu cầu khác nhau.

## Ba lớp bộ nhớ trong sản phẩm AI

Bộ nhớ không phải một thứ đơn lẻ. Nó chia thành ít nhất ba bài toán riêng biệt:

- **Bộ nhớ ngắn hạn** — nhớ những gì đã xảy ra trong cuộc trò chuyện hiện tại
- **Bộ nhớ dài hạn** — nhớ những gì người dùng đã chia sẻ qua nhiều phiên làm việc
- **Bộ nhớ theo phiên** — nhớ cụ thể những gì đã xảy ra trong *phiên gần nhất*

Hầu hết các hướng dẫn chỉ đề cập đến bộ nhớ ngắn hạn rồi dừng lại. Nhưng khoảng trống giữa ngắn hạn và dài hạn chính là nơi hầu hết sản phẩm AI thất bại người dùng thật của mình ngay từ ngày thứ hai.

## Bộ nhớ ngắn hạn: thực ra đơn giản hơn bạn nghĩ

Dạng bộ nhớ cơ bản nhất là lịch sử cuộc trò chuyện - danh sách các tin nhắn bạn truyền vào model mỗi lần gọi. Mỗi lần người dùng gửi tin nhắn, bạn thêm nó vào danh sách, gửi toàn bộ lên model, rồi thêm phản hồi vào. Chỉ vậy thôi.

```json
[
  { "role": "user", "content": "Mình đang build một app theo dõi thói quen bằng Swift." },
  { "role": "assistant", "content": "Hiểu rồi! Bắt đầu với data model nhé..." },
  { "role": "user", "content": "Làm sao để lưu streak qua nhiều ngày?" }
]
```

Vấn đề nằm ở context window. Nếu cuộc trò chuyện đủ dài, bạn sẽ vượt giới hạn token của model và gặp lỗi - hoặc tệ hơn, âm thầm cắt bỏ các turn cũ và mất context quan trọng mà không có bất kỳ cảnh báo nào.

Các cách giải quyết thực tế:

- **Sliding window**: chỉ giữ lại N turn gần nhất. Đơn giản, nhưng mất hoàn toàn context từ đầu.
- **Tóm tắt định kỳ**: cứ mỗi K turn, nhờ model nén phần trước thành một đoạn tóm tắt gọn, rồi thay thế các turn đó bằng đoạn tóm tắt đó. Đây là pattern phổ biến nhất trong production - bạn giữ được ý nghĩa mà không tốn chi phí token.
- **Bộ nhớ phân cấp**: duy trì một "tóm tắt phiên làm việc" liên tục ở đầu prompt, cập nhật theo thời gian, và giữ các tin nhắn thô gần đây bên dưới.

Nếu bạn muốn hiểu sâu hơn về các trade-off của context window, bài [Context Windows for Product Builders](/vi/blog/context-windows-for-product-builders) đi vào cơ chế cụ thể rất chi tiết.

## Bộ nhớ dài hạn: hồ sơ người dùng và tìm kiếm ngữ nghĩa

Bộ nhớ ngắn hạn xử lý cuộc trò chuyện hiện tại. Bộ nhớ dài hạn xử lý tất cả những thứ xuyên suốt nhiều phiên - mục tiêu, sở thích, lịch sử và các thông tin cố định mà bạn đã học được về người dùng.

Hóa ra có hai pattern chủ yếu được dùng ở đây:

**Hồ sơ người dùng có cấu trúc.** Bạn duy trì một bản ghi có cấu trúc cho mỗi người dùng: họ đang làm gì, trình độ kỹ năng, sở thích, những thông tin quan trọng họ đã chia sẻ. Bạn inject một phiên bản nén của hồ sơ này vào mọi system prompt - như một CRM mà bạn tự viết, từng sự thật một.

```
[Ngữ cảnh hệ thống cho @nguyen]
- Đang làm: app iOS Swift theo dõi thói quen
- Trình độ: iOS trung cấp, mới học CoreData
- Mục tiêu gần nhất: thêm iCloud sync
- Phong cách ưa thích: giải thích ngắn gọn kèm ví dụ code
```

Pattern này hoạt động tốt với những thông tin ổn định, thay đổi chậm. Nhưng nó không mở rộng được khi bạn cần lưu hàng trăm tương tác chi tiết theo nghĩa đen.

**Bộ nhớ truy xuất theo ngữ nghĩa.** Khi người dùng hỏi điều gì đó, bạn tìm kiếm trong cơ sở dữ liệu vector chứa các tương tác cũ và kéo ra những gì liên quan nhất. Model chỉ thấy những thứ phù hợp với câu hỏi hiện tại - không phải mọi ký ức từng được lưu.

Cách tiếp cận này về bản chất giống với [xây dựng RAG cá nhân cho ghi chú](/vi/blog/build-personal-rag-for-notes), chỉ là thay vì ghi chú, corpus là các cuộc trò chuyện trong quá khứ. Bạn embed từng tóm tắt cuộc trò chuyện, lưu vào vector store (Pinecone, Supabase pgvector, Qdrant), và truy xuất theo cosine similarity mỗi lần có câu hỏi mới.

Sự kết hợp của hai cái - hồ sơ có cấu trúc cho dữ liệu ổn định và truy xuất ngữ nghĩa cho chi tiết theo phiên - là đủ để đáp ứng hầu hết nhu cầu sản phẩm thực tế.

## Khoảng trống thật sự: bộ nhớ theo phiên

Đây là phần mà hầu như mọi sản phẩm AI đều vấp phải.

Người dùng kết thúc một phiên làm việc giữa chừng - model vừa giúp họ đi được nửa chặng đường. Họ quay lại hôm sau. Không có bộ nhớ theo phiên, họ phải giải thích lại mọi thứ từ đầu. Điều đó không chỉ khó chịu - **nó phá vỡ hợp đồng cảm xúc** của một công cụ được xây để hiểu họ.

Bộ nhớ theo phiên nghĩa là lưu những gì đã xảy ra trong một phiên cụ thể như một đơn vị rời rạc, có thể đọc được - không chỉ các turn trò chuyện thô, mà là một bản ghi có cấu trúc: *người dùng đang làm gì, họ bị vướng ở đâu, điều gì đã được giải quyết, và điều gì vẫn còn đang mở.*

Cách triển khai đơn giản nhất:

1. Cuối mỗi phiên làm việc, nhờ model viết một tóm tắt phiên có cấu trúc: `{ "dang_lam": "...", "tien_do": "...", "cau_hoi_con_mo": ["..."], "buoc_tiep_theo": "..." }`.
2. Lưu vào cơ sở dữ liệu, liên kết với user ID và timestamp.
3. Đầu phiên tiếp theo, truy xuất tóm tắt gần nhất và inject vào system prompt: *"Lần trước bạn đang làm X. Bạn đã tiến đến Y. Bạn có câu hỏi chưa giải quyết về Z."*

Pattern đơn giản này thay đổi cảm nhận của sản phẩm một cách đáng kể. Model không còn là nhà tiên tri hay quên nữa - nó bắt đầu cảm giác như một người cộng tác thật sự để ý đến bạn.

### Chiến lược quên có chủ đích

Bộ nhớ cũng cần một chiến lược loại bỏ. Bạn không muốn hồ sơ người dùng tích lũy mãi những sự thật lỗi thời hoặc mâu thuẫn nhau. Các cách đơn giản mà hiệu quả: LRU eviction từ hồ sơ có cấu trúc khi vượt giới hạn kích thước, điểm tin cậy giảm dần theo thời gian, và để người dùng chủ động xóa hoặc chỉnh sửa những gì hệ thống nhớ về họ.

Suy cho cùng, xây dựng điều này tốt chính là sự khác biệt giữa một sản phẩm cảm giác thông minh thật sự và một sản phẩm chỉ giống như autocomplete được cải tiến.

## Bắt đầu từ đâu: đơn giản hơn bạn nghĩ

Đừng vội nhảy vào vector database và embedding từ ngày đầu. Thật ra một hồ sơ có cấu trúc được duy trì tốt cộng với tóm tắt theo phiên sẽ phục vụ hầu hết sản phẩm lâu hơn bạn kỳ vọng - và chúng có thể debug được theo cách mà vector search không làm được.

Thứ tự build thực tế:

1. **Lịch sử cuộc trò chuyện với tóm tắt định kỳ** cho bộ nhớ trong phiên - cái này một mình đã bao phủ 80% use case.
2. **Hồ sơ người dùng có cấu trúc** inject vào mọi system prompt - xử lý những sự thật ổn định và quan trọng nhất.
3. **Tóm tắt theo phiên** được lưu và truy xuất đầu phiên tiếp theo - đóng khoảng trống ngày thứ hai ngay lập tức.
4. **Truy xuất ngữ nghĩa** thêm vào sau, khi bạn đã có đủ dữ liệu để nó có giá trị và có thể đo được sự cải thiện thực sự.

> Mục tiêu không phải là cho AI bộ nhớ hoàn hảo. Mà là làm cho người dùng cảm thấy được nhớ đến. Đó là hai bài toán khác nhau - và cái thứ hai dễ giải hơn nhiều.

Build thứ đơn giản nhất làm người dùng cảm thấy sản phẩm biết họ là ai, đo xem nó có thật sự hoạt động không, rồi mới đầu tư xây cách phức tạp hơn khi bạn có bằng chứng rằng nó sẽ tạo ra sự khác biệt.
