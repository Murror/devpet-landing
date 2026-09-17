---
title: "Quản lý context window khi xây dựng sản phẩm AI"
description: "Context window quyết định sự sắc bén của AI feature — không chỉ là giới hạn kỹ thuật mà là bài toán thiết kế mà mọi builder cần hiểu rõ từ đầu."
date: "2026-06-22"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["context window", "llm", "product", "prompt engineering", "ai"]
---

## Khi AI của bạn bắt đầu "quên"

Có một kiểu lỗi trong AI product mà người dùng thường không biết cách mô tả - họ chỉ cảm thấy "cái này ngày càng tệ hơn". Đầu cuộc trò chuyện, model trả lời sắc bén, đúng ngữ cảnh. Nhưng sau chục tin nhắn, câu trả lời bắt đầu lan man, mâu thuẫn, hoặc bỗng nhiên bỏ qua điều đã trao đổi từ trước.

Đây không phải model bị lỗi. Đây là bạn chưa quản lý context window.

Mỗi LLM xử lý văn bản trong một vùng nhớ có giới hạn gọi là **context window** - tính bằng token (xấp xỉ ¾ chữ mỗi token). Khi cuộc trò chuyện vượt ngưỡng đó, nội dung cũ bị cắt bỏ hoặc request thất bại. Nhiều model hiện tại có context window lên đến 128K token - nghe có vẻ dư dả - nhưng trong production, không gian đó thu hẹp nhanh hơn bạn nghĩ. Và quyết định về cách quản lý nó thường bị bỏ qua trong giai đoạn thiết kế ban đầu.

---

## Bốn thứ đang "ăn" budget context của bạn

Trước khi tối ưu được, cần nhìn rõ context đang bị chiếm bởi những gì. Trong một AI feature điển hình, có bốn nguồn chính:

1. **System prompt.** Những hướng dẫn bạn đặt ra cho model về vai trò, giới hạn và giọng điệu. Chúng được gửi kèm theo *mọi* request - và một system prompt phình to có thể ngốn 800–2.000 token trước khi user gõ một chữ.

2. **Lịch sử hội thoại.** Mỗi tin nhắn trước đó - từ cả user lẫn model - đều được đẩy vào. Nếu không kiểm soát, đây là nguồn tăng trưởng không có điểm dừng.

3. **Ngữ cảnh truy xuất (RAG).** Nếu bạn đang dùng RAG - kéo tài liệu hoặc ghi chú liên quan vào trước mỗi request - lượng nội dung đó có thể khá lớn.

4. **Lượt hiện tại.** Câu hỏi mới của user cộng với bất kỳ dữ liệu động nào bạn inject thêm - timestamp, hồ sơ người dùng, hoạt động gần đây.

Tính cộng lại ở thời điểm peak, bạn sẽ ngạc nhiên: system prompt cộng 20 lượt trao đổi cộng vài đoạn từ RAG có thể lên đến 30–40K token - mà không có phần nào trông có vẻ quá tải cả.

---

## Tại sao điều này phá vỡ sản phẩm

Điều đáng nói là failure mode ở đây thường không phải lỗi cứng - không có thông báo đỏ, không có request fail rõ ràng. Phổ biến hơn là sự xuống cấp từ từ: model bắt đầu mâu thuẫn với chính mình, bỏ qua hướng dẫn ban đầu, hoặc đưa ra câu trả lời chung chung vì ngữ cảnh cụ thể nó cần đã bị cắt mất. User không thấy lỗi - họ chỉ thấy AI trở nên kém hơn. Và họ rời đi.

Còn một chiều nữa: chi phí. Hầu hết provider tính tiền theo token đầu vào. Gửi 60K token mỗi request trong khi chỉ một phần nhỏ thực sự cần thiết là đang đốt tiền vào nhiễu.

> Sự thật nhàm chán nhưng quan trọng: quản lý context window là thứ phân biệt AI feature sắc bén với AI feature khiến user âm thầm thất vọng theo thời gian.

---

## Bốn chiến lược thực tế

### 1. Kiểm toán và rút gọn system prompt

System prompt là thứ duy nhất trong context mà bạn kiểm soát hoàn toàn. Hãy đối xử với nó như code: review, cắt bỏ phần dư thừa, rồi test xem phiên bản ngắn hơn có thực sự làm giảm chất lượng output không. Thường là không - hoặc mức giảm nhỏ hơn bạn nghĩ.

Một system prompt tốt cho feature tập trung thường dưới 500 token. Nếu của bạn đang ở 2.000+ token, gần như chắc chắn có sự lặp lại và những đoạn phòng thủ không cần thiết. Viết một lần, review theo quý, và quản lý phiên bản song song với model settings - giống như mọi cấu hình production khác. (Xem thêm bài về [prompt versioning](/vi/blog/prompt-versioning-production-code) để có cách tiếp cận thực tế.)

### 2. Dùng sliding window cho lịch sử hội thoại

Thay vì truyền toàn bộ lịch sử, chỉ truyền N lượt gần nhất - thường 6–10 tùy use case. Điều này giúp model bám sát luồng trò chuyện gần đây mà không làm phình context budget.

Với những tác vụ cần ngữ cảnh từ sớm hơn - như một buổi debug kéo dài - hãy cân nhắc chiến lược **summary**: sau mỗi 10 lượt, nhờ model tóm tắt những gì đã được xác lập trong một đoạn văn ngắn. Lưu bản tóm tắt đó và dùng nó làm "hạt giống" cho các cửa sổ tiếp theo thay vì toàn bộ transcript thô. Model vẫn nắm được cốt lõi mà không cần đọc lại từ đầu.

### 3. Truy xuất RAG có chọn lọc

RAG mạnh, nhưng dễ truy xuất thừa. Nếu kéo vào 10 đoạn vì không chắc đoạn nào liên quan, bạn đã đưa cho model 10 thứ cần sàng lọc - và làm loãng tỉ lệ tín hiệu/nhiễu. Đầu tư vào retrieval tốt hơn (embedding tinh chỉnh cho dữ liệu của bạn, re-ranking, lọc metadata) để có thể truyền 2–3 đoạn thực sự liên quan thay vì 8–10 đoạn trung bình.

Để hiểu thêm về xây dựng RAG pipeline, xem bài [Cách xây dựng hệ thống RAG cá nhân cho ghi chú của bạn](/vi/blog/build-personal-rag-for-notes) - những nguyên tắc ở đó áp dụng được cho cả cấp độ sản phẩm.

### 4. Theo dõi và test ở các trường hợp biên

Thiết lập monitoring để theo dõi token count của mọi request trong production. Các spike thường đến từ edge case: user dán vào một tài liệu 5.000 chữ, hoặc power user chat hàng giờ mà không mở session mới.

Xây dựng hard cap - hoặc graceful degradation - cho những trường hợp này. Khi context sắp tràn, hãy cho user biết: *"Cuộc trò chuyện này đang khá dài - bắt đầu phiên mới sẽ cho câu trả lời tốt hơn."* Đó là phản hồi trung thực, hữu ích, và tốt hơn rất nhiều so với một AI lặng lẽ bị nhầm lẫn.

---

## Những cái bẫy cần tránh

**Nhồi nhét tất cả vào "cho chắc".** Context lớn hơn không phải lúc nào cũng tốt hơn. Trớ trêu thay, khi cho model quá nhiều thông tin không liên quan, nó có thể bị phân tâm bởi nhiễu thay vì tập trung vào tín hiệu. Nhiều context hơn cũng đồng nghĩa độ trễ cao hơn và chi phí cao hơn.

**Bỏ qua token count cho đến khi xảy ra sự cố.** Giới hạn token nhàm chán cho đến khi nó gây ra incident lúc 3 giờ sáng. Hãy xây dựng việc đếm và giám sát token từ đầu - đây là công việc instrumentation 30 phút giúp bạn tránh được nhiều đêm mất ngủ về sau.

**Coi system prompt như một config file không ai được chạm vào.** Đây là code sống. Khi sản phẩm phát triển, system prompt cũng phải phát triển theo. Đừng để nó trở thành nghĩa địa của những hướng dẫn mà không ai còn nhớ đã viết từ khi nào.

---

## Một điểm nữa: không phải context window nào cũng như nhau

Về mặt kỹ thuật, model với 128K token chấp nhận đầu vào khổng lồ - nhưng nhiều nghiên cứu chỉ ra rằng performance của model giảm khi thông tin quan trọng nằm ở giữa một context rất dài. Hiện tượng này đôi khi được gọi là "lost in the middle". Context ngắn hơn, cấu trúc tốt hơn thường cho kết quả vượt trội so với context dài, rải rác - dù cả hai chứa cùng thông tin.

Nguyên tắc thực tế: **có thể nhét vào được không có nghĩa là nên nhét.** Chọn lọc kỹ càng, truy xuất chính xác, và tỉa thường xuyên.

---

## Kết lại

Quản lý context window không hào nhoáng - nhưng đây là một trong những quyết định nền tảng phân biệt AI feature sắc bén với AI feature khiến user âm thầm thất vọng. Kiểm toán context budget, đặt sliding window cho lịch sử hội thoại, chọn lọc RAG, và theo dõi token count trong production. Làm được bốn điều này là bạn đã đi trước phần lớn các team đang ship AI features hiện nay.

Khi context đã được kiểm soát, câu hỏi tiếp theo tự nhiên xuất hiện: làm sao biết mọi thứ đang thực sự hoạt động tốt? Đó là lúc eval trở nên cần thiết - [Cách viết LLM eval cho sản phẩm AI](/vi/blog/how-to-write-llm-evals-for-your-ai-product) là bài bổ trợ tốt cho post này.
