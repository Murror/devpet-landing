---
title: "Viết spec sản phẩm cùng AI trước khi gõ một dòng code nào"
description: "Cách dùng AI để phác thảo spec sản phẩm — phát hiện edge case, làm rõ tư duy, và tránh xây nhầm thứ không ai cần."
date: "2026-06-30"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["product spec", "planning", "AI", "product design", "indie hacker", "shipping"]
---

Ai cũng biết cảm giác đó - khi ý tưởng đang sục sôi, khi bạn có thể hình dung sản phẩm rõ ràng đến mức gần như chạm được vào nó, và việc mở editor lên bắt đầu gõ cảm giác tự nhiên như thở. Thế là gõ. Hai tuần sau, bạn nhìn vào một đống code dở dang, không giải quyết đúng vấn đề đã đặt ra từ đầu, với một danh sách dài những edge case chưa từng nghĩ tới - và một cảm giác mơ hồ rằng mình đáng lý ra phải suy nghĩ kỹ hơn từ trước.

Điều đáng nói là AI - thứ công cụ được kỳ vọng tăng tốc mọi thứ - có thể khiến tình huống này tệ hơn. Vì AI cho phép bạn viết code nhanh đến mức bạn có thể code nhầm thứ một cách rất... hiệu quả.

Giải pháp là một bước mà hầu hết mọi người đều biết và đều bỏ qua: viết spec trước.

## Tại sao spec lại quan trọng hơn trong thời đại AI, chứ không phải ít hơn

Ngày xưa, khi code còn chậm, bạn có thời gian để suy nghĩ. Từng dòng gõ vào là một lần đối mặt với những bất nhất còn ẩn trong đầu. Giờ thì khác - bạn mô tả một tính năng trong một câu và có code chạy được trong vài giây. Điều đó thật tuyệt, thật sự. Nhưng khoảng trống tư duy mà trước đây được lấp đầy bởi tiến độ chậm của việc gõ phím vẫn còn đó - chỉ là không có gì lấp nó nữa.

Product spec là nơi thứ suy nghĩ đó xảy ra. Một spec tốt trả lời: chúng ta đang xây gì, cho ai, giải quyết vấn đề gì, và "xong" trông như thế nào? Nó không cần dài - một spec chắc cho một tính năng có thể chỉ ba trăm chữ. Nhưng ba trăm chữ đó làm được điều không có dòng code nào làm được: buộc bạn phải mạch lạc trước khi nhanh.

**Những builder viết spec trước khi code thường xây ít tính năng hơn - nhưng ship nhiều hơn.** Đây là điều chúng tôi thấy lặp lại trong [câu chuyện của những người thật sự ship được sản phẩm](/vi/blog/what-happens-when-you-actually-ship): người về đích luôn là người khởi đầu với một đích rõ ràng.

## Cấu trúc spec năm phần hoạt động được

Một spec tốt cho một tính năng hoặc sản phẩm nhỏ có năm phần. Ngắn và cụ thể là yêu cầu bắt buộc.

**1. Vấn đề.** Điều gì đang bị gãy, thiếu, hay gây khó chịu? Ai đang gặp phải? Một đoạn văn - không phải một bài luận.

**2. Người dùng.** Cụ thể là ai? Không phải "developer" chung chung, mà là "founder solo dùng VS Code và không có đội QA." Sự cụ thể ở đây ngăn bạn cố gắng làm hài lòng tất cả mọi người cùng lúc.

**3. Giải pháp.** Bạn đang xây gì - mô tả từ góc nhìn người dùng: "Người dùng upload file, xem preview, rồi xác nhận trước khi xử lý." Chưa cần nghĩ đến implementation.

**4. Tiêu chí thành công.** Làm sao biết mọi thứ đã ổn? Một đến ba kết quả đo được. "Người dùng hoàn thành luồng upload mà không cần liên hệ support" tốt hơn nhiều so với "nó trực quan."

**5. Ngoài phạm vi.** Liệt kê hai ba thứ bạn có chủ đích không xây. Phần này thường là phần hữu ích nhất của spec - nó ngăn scope creep trước khi scope creep bắt đầu.

## Dùng AI để viết spec, không chỉ để viết code

Đây mới là nơi có đòn bẩy thật sự. Bạn có thể dùng AI để cùng viết spec - và AI rất giỏi trong việc phát hiện những chỗ hổng trong tư duy của bạn. Điều quan trọng là không nhờ AI viết spec hộ - mà dùng AI như một người cộng tác để stress-test những gì bạn đang nghĩ.

Bắt đầu bằng cách dump hết ý tưởng ra:

```
I want to build [rough description]. The user would [intended action] 
and then [outcome]. It's for [audience]. Help me draft a product spec 
using this structure: Problem / Users / Solution / Success criteria / 
Out of scope.

Push back on anything that seems vague or inconsistent. Ask me 
clarifying questions before you write anything.
```

Dòng cuối đó quan trọng hơn tất cả. Không có nó, AI sẽ tặng bạn một spec nghe rất ổn nhưng che giấu đi sự mơ hồ bên dưới. Có nó, AI hành xử như [một người bạn tư duy thật sự, chứ không phải một cái search engine](/vi/blog/ai-as-thought-partner-not-search-engine) - nó đặt ra những câu hỏi bạn chưa có câu trả lời.

Và chính những câu hỏi làm rõ đó mới là giá trị. "Nếu file bị lỗi thì sao?" "Tính năng này có giới hạn cho user trả phí không?" "Nếu quá trình xử lý thất bại, fallback là gì?" - Đây là những edge case bạn sẽ gặp trong tuần thứ hai nếu không gặp chúng ngay bây giờ.

## Nhờ AI phản biện spec của bạn

Khi đã có bản draft, chạy prompt này:

```
Here's my spec: [paste spec].

Take the role of a skeptical engineer who has seen too many vague specs 
cause two-week debugging sessions. Point out: (1) anything underspecified, 
(2) edge cases I haven't addressed, (3) anything that would be harder to 
build than I seem to think. Be direct.
```

> Một spec có nhiều chỗ bị đặt câu hỏi là một spec đang làm đúng việc của nó. Mỗi lỗ hổng tìm thấy ở đây là một bug bạn đang ngăn chặn trước khi nó vào production.

Đừng coi mọi lời phản biện đều là lý do để over-engineer. Có những edge case thực sự không đáng giải quyết trong v1. Nhưng biết về chúng trước khi xây có nghĩa là bạn đang đưa ra quyết định có chủ đích - không phải phát hiện ra lúc 11 giờ đêm.

## Khi nào thì dừng spec và bắt đầu build

Đây là chỗ nhiều người bị kẹt theo chiều ngược lại. Spec là công cụ lập kế hoạch, không phải cam kết bất biến. Nếu bạn đang ở lần sửa thứ năm và chủ yếu di chuyển dấu phẩy từ chỗ này sang chỗ kia, bạn đã qua điểm lợi nhuận giảm dần rồi.

Dấu hiệu để bắt đầu build: bạn có thể giải thích tính năng trong một đoạn văn và người khác có thể đặt câu hỏi cụ thể về nó. Không phải "nó hoạt động như thế nào?" mà là "nếu người dùng đóng trình duyệt giữa chừng lúc đang upload thì sao?" Khi câu hỏi đã trở nên cụ thể, tư duy của bạn đã cụ thể. Build thôi.

Với các dự án solo nhanh, spec không cần tồn tại dưới dạng tài liệu. Bạn có thể làm điều này như một cuộc trò chuyện 10 phút với AI trước khi mở editor. Thứ quan trọng không phải là file lưu lại - mà là sự rõ ràng trong đầu bạn.

## Điều rút ra cụ thể

Trước khi viết tính năng tiếp theo, hãy dành 15 phút cho một bản spec. Dùng AI để cùng phác thảo, rồi chạy prompt phản biện. Spec của bạn nên đủ rõ để bạn giải thích được cho một người bạn mà không cần vẫy tay lung tung. Nếu không giải thích được, bạn không thể build - và chắc chắn không thể prompt AI làm thay.

Phần [Xây dựng sản phẩm AI](/vi/blog/category/building-ai-products) có thêm về toàn bộ chu trình từ ý tưởng đến ngày ra mắt. Nhưng bước này - spec trước - là bước hầu hết mọi người bỏ qua và sau đó hối tiếc.
