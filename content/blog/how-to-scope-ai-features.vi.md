---
title: "Cách xác định scope cho tính năng AI trước khi bắt tay xây dựng"
description: "Hầu hết các tính năng AI thất bại ngay từ trước khi được build xong - vì scope sai. Một framework thực tế để xác định AI cần làm gì, đủ tốt là đủ bao nhiêu, và khi nào thì dừng."
date: "2026-07-04"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "product-building", "feature-development", "llms", "prompting"]
---

Thất bại phổ biến nhất khi xây dựng tính năng AI không đến từ model hay prompt. Nó đến từ scope.

Có một vòng lặp mà chúng tôi thấy lặp đi lặp lại - ở chính mình lẫn trong những builder khác: bắt đầu với một ý tưởng đẹp, thử vài cái prompt, và một tuần sau thì có thứ gì đó *gần như* hoạt động theo một cách *gần như* có ích. Rồi mất thêm ba tuần để đuổi theo cái "gần như" đó. Sau quá trình xây dựng các tính năng cốt lõi của Codepet - và quan sát cách những indie builder khác tiếp cận dự án AI của họ - chúng tôi nhận ra rằng thời điểm cần chính xác không phải là lúc đang code. Là trước đó, khi trang giấy vẫn còn trắng.

## Xác định "công việc" trước khi chọn công cụ

Trước khi bạn chọn model, viết system prompt hay thêm API key - hãy trả lời câu hỏi này: **tính năng này giúp người dùng đưa ra quyết định hoặc hành động gì?**

Tính năng AI thường hỏng vì câu trả lời quá mơ hồ ("nó giúp người dùng hiểu rõ hơn") hoặc quá rộng ("nó trả lời mọi câu hỏi về ứng dụng"). Càng cụ thể bao nhiêu, bạn sẽ càng sớm biết mình đang xây đúng thứ không.

Với tính năng phản hồi của Codepet, "công việc" rất hẹp: nhìn vào thứ người học vừa build, tìm ra điểm họ hiểu sai một khái niệm, và đặt *một câu hỏi* để đưa khoảng trống đó lên mặt. Không giải thích khái niệm. Không gợi ý cách sửa. Chỉ một câu hỏi thôi. Giới hạn đó khiến mọi thứ tiếp theo dễ hơn rất nhiều - system prompt ngắn lại, tiêu chí đánh giá rõ ràng, edge case có thể kiểm soát được.

> **Phép thử:** Bạn có thể viết ra ba điều cụ thể tính năng này *nên làm*, và ba điều nó *không nên làm* không? Nếu không, scope vẫn chưa xong.

## Quyết định "đủ tốt" có nghĩa là gì

LLM không cho ra kết quả đúng/sai rõ ràng - nó cho ra một phân phối. Đôi khi rất tốt, đôi khi tàm tạm, thỉnh thoảng vô dụng. Xác định scope nghĩa là quyết định bạn chấp nhận để người dùng của mình rơi vào điểm nào trên phân phối đó.

Hỏi hai câu trước khi build bất cứ thứ gì:

1. **Chi phí của một response tệ là bao nhiêu?** AI đôi khi viết một câu commit message hơi kỳ thì chịu được. AI đưa lời khuyên sai về kiến trúc hệ thống thì không.
2. **Cần đúng bao nhiêu phần trăm?** Tỷ lệ thành công 70% có thể chấp nhận được cho "gợi ý tag cho ghi chú này." Nhưng không thể chấp nhận được cho "review code trước khi deploy."

Hai câu trả lời này quyết định kiến trúc của bạn. Chi phí thấp, độ chính xác vừa phải? Một model call nhanh với prompt chặt là đủ. Chi phí cao, độ chính xác phải cao? Bạn cần [eval bài bản](/vi/blog/how-to-write-llm-evals-for-your-ai-product), fallback có suy nghĩ, và có lẽ một model chậm hơn nhưng mạnh hơn.

Đừng đoán mò. Viết xuống trước khi bắt đầu build.

## Vẽ ra các kịch bản xấu trên giấy

Sai lầm lớn nhất trong việc xác định scope là chỉ xây dựng cho happy path - người dùng cung cấp đúng input, theo đúng format, vào đúng thời điểm.

Dành 20 phút liệt kê các điểm có thể vỡ:

- Nếu user gần như không cung cấp context thì sao?
- Nếu input bằng ngôn ngữ khác với kỳ vọng?
- Nếu user hỏi thứ hoàn toàn không liên quan?
- Nếu model trả về thứ gì đó sai hoặc gây hiểu lầm?

Bạn không cần giải quyết tất cả trước khi build. Nhưng bạn cần *biết chúng tồn tại* và quyết định trước cách xử lý. Thời điểm tệ nhất để nghĩ về edge case là khi một user thật đang trải nghiệm nó trong production.

Một bài tập hữu ích: viết năm ví dụ "input tệ" và trace xem tính năng lý tưởng của bạn sẽ output gì cho mỗi trường hợp. Gần như lúc nào cũng lộ ra những giả định về scope mà bạn không biết mình đang có.

## Chọn đúng model tier cho công việc

Không phải task AI nào cũng cần model mạnh nhất của bạn. Xác định scope nghĩa là chọn đúng công cụ - không phải mặc định dùng thứ lớn nhất hoặc mới nhất.

```text
Phân loại đơn giản (tin nhắn này có on-topic không?)   → model nhanh, rẻ
Lý luận nhiều bước (giải thích tại sao logic này sai)  → model mạnh hơn, nhiều token hơn
Trích xuất có cấu trúc (parse intent sang JSON schema)  → model giỏi theo hướng dẫn + structured outputs
Phân tích tài liệu dài (tóm tắt một spec dài)          → model có context window lớn
```

Thật ra, khả năng mạnh hơn không luôn là tốt hơn. Model đơn giản thường phản hồi nhanh hơn, tốn ít chi phí hơn, và dễ đánh giá nhất quán hơn. Những [system prompt hoạt động tốt trong production](/vi/blog/system-prompts-that-work-in-production) thường dành cho task hẹp hơn, scope rõ hơn - không phải prompt mở đang cố làm quá nhiều việc. Nếu prompt của bạn đang làm mười việc cùng lúc, đó là vấn đề scope - không phải vấn đề prompting.

## Vẽ ra khoảnh khắc người dùng, không chỉ tính năng

Tính năng AI tồn tại trong một dòng chảy của người dùng. Trước khi hoàn thiện scope, hãy vẽ ra khoảnh khắc đó:

- Người dùng vừa làm gì?
- Họ kỳ vọng điều gì xảy ra tiếp theo?
- Họ biết AI phản hồi tốt như thế nào?
- Họ làm gì khi nó phản hồi không tốt?

Nhiều tính năng AI cảm thấy sai không phải vì output tệ - mà vì *khoảnh khắc* sai. Tính năng kích hoạt quá sớm, quá muộn, hoặc đáp lại một câu hỏi mà người dùng không thực sự đang hỏi.

Xác định scope cho khoảnh khắc người dùng quan trọng không kém gì xác định scope cho prompt. Một bản phác thảo năm phút trên notepad thường là đủ.

## Checklist scope nhẹ nhàng

Trước khi viết dòng code đầu tiên:

- [ ] Đã viết "công việc" trong một câu (điều nó cho phép làm, không phải nó là gì)
- [ ] Đã xác định ba điều tính năng "nên làm" và ba điều "không nên làm"
- [ ] Đã đặt tỷ lệ thành công chấp nhận được và đặt tên cho chi phí thất bại
- [ ] Đã liệt kê năm edge case với input tệ và mô tả cách xử lý lý tưởng
- [ ] Đã chọn model tier dựa trên nhu cầu về độ chính xác, latency và chi phí
- [ ] Đã phác thảo khoảnh khắc người dùng - vừa xảy ra điều gì, điều gì nên xảy ra tiếp theo

Không có gì mất nhiều thời gian ở đây. Toàn bộ checklist là một cuộc trò chuyện 30 phút với chính mình - hoặc với co-founder, với user đầu tiên, hoặc với một AI mà bạn đang brief theo cách bạn sẽ brief một đồng đội.

## Ship phiên bản hẹp trước

Scope tốt không có nghĩa là scope mãi mãi nhỏ - mà là nhỏ *để bắt đầu*. Build phiên bản hẹp, đưa cho một user thật, và xem liệu "công việc" bạn đã scope có phải là "công việc" họ thực sự cần không.

Mỗi tính năng AI chúng tôi đã ship ở Codepet đều kết thúc với scope khác đi sau sáu tuần ra mắt. Không phải vì scope ban đầu sai - mà vì thực tế sử dụng luôn tiết lộ thứ gì đó mà spec không thấy trước được.

Mục tiêu của việc xác định scope không phải là hoàn hảo trước khi build. Mục tiêu là đủ cụ thể để sau khi ship, câu hỏi "cái này có hoạt động không?" có câu trả lời rõ ràng - và vòng lặp tiếp theo thực sự tiến thêm được một bước.

Đó là kiểu velocity duy nhất tích lũy theo thời gian.
