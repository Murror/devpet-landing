---
title: "Vấn đề của phiên dùng đầu tiên - và những gì người dùng thật sự dạy chúng tôi"
description: "Mười phút đầu tiên của người dùng tiết lộ gần như mọi thứ về việc họ có quay lại không. Đây là những gì chúng tôi phát hiện khi quan sát phiên mở app đầu tiên."
date: "2026-07-08"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["user-research", "onboarding", "ai-product", "ux", "retention"]
---

Có một sự thật khó chịu mà phần lớn team product đều né tránh: phiên dùng đầu tiên của người dùng mới thường không diễn ra theo cách bạn đã hình dung. Không phải vì sản phẩm kém - mà vì khoảng cách giữa "sản phẩm mình nghĩ mình đã xây" và "sản phẩm người dùng thực sự đang thấy" thường lớn hơn nhiều so với những gì metric có thể cho biết.

Tại Codepet, sau khoảng sáu tháng ra mắt, chúng tôi bắt đầu xem recording của những người dùng mới lần đầu mở app - không có hướng dẫn, không có onboarding call, chỉ là họ tự khám phá sản phẩm. Kết quả thật sự khiêm tốn. Và nó thay đổi ba thứ mà lúc trước chúng tôi khá tự tin.

## Điều chúng tôi kỳ vọng

Khi xây Codepet, chúng tôi luôn hình dung ra một "người học có động lực": mở app, thấy AI companion, gõ câu hỏi về thứ muốn xây, rồi bắt đầu. Chúng tôi đã test flow này kỹ lưỡng với những early user biết rõ họ cần gì - developer tò mò về AI, người có project cụ thể đang muốn làm.

Điều chúng tôi chưa test đủ là trải nghiệm của người nghe về Codepet đâu đó - một bài viết, một chia sẻ, một lời giới thiệu - rồi mở app với câu hỏi mơ hồ nhất có thể: *cái này là gì và dùng để làm gì?* Thật ra, đó là đại đa số người dùng thực sự.

## Ba điều phiên đầu tiên tiết lộ

**1. Người dùng không bắt đầu bằng một câu hỏi. Họ bắt đầu bằng một cuộc thẩm định.**

Điều đầu tiên hầu hết người dùng mới làm không phải là gõ gì đó. Họ nhìn quanh. Bấm vào companion, khám phá UI, lướt qua các danh mục kỹ năng. Họ đang âm thầm hỏi: *đây là loại sản phẩm gì?* Trước khi đưa cho AI bất kỳ thứ gì, họ đang đánh giá xem nó có đáng để đầu tư thời gian không.

Chúng tôi đã tối ưu rất nhiều cho khoảnh khắc sau khi người dùng gõ tin nhắn đầu tiên. Ba mươi giây trước đó - gần như không được nghĩ tới.

**2. Tin nhắn đầu tiên thường quá mơ hồ - và người dùng cảm nhận được điều đó.**

Khi người dùng cuối cùng cũng gõ gì đó, pattern phổ biến nhất là những câu như "giúp mình học code" hoặc "mình muốn làm một cái app." Rộng, thăm dò, ít cam kết. Và gần như ngay lập tức sau khi thấy phản hồi của AI, họ lui lại - gõ thêm câu mơ hồ hơn, hoặc đóng app.

Vấn đề là: phản hồi của chúng tôi quá dài, quá chi tiết, quá có cấu trúc. Cảm giác như một bài giảng trước khi họ kịp đặt câu hỏi thật sự. Họ vừa thả ra một tín hiệu nhỏ - một hướng đi, một cảm giác - còn chúng tôi phản hồi bằng cả một chương trình học. Sự khác biệt trông như thế này:

```
Người dùng: "giúp mình học code"

Trước đây: [500 từ giải thích khái niệm lập trình,
            gợi ý tài nguyên, liệt kê lộ trình học...]

Bây giờ:   "Bạn muốn xây gì? Kể cho mình nghe một chút
            và mình sẽ giúp bạn tìm điểm xuất phát."
```

Một câu trả lời ngắn, tò mò - kết thúc bằng cách tung quả bóng trở lại - kéo dài cuộc trò chuyện. Một bức tường văn bản kết thúc nó.

**3. Không biết phải làm gì tiếp theo là điểm dừng phổ biến nhất.**

Điều thú vị là: trong các recording, chỗ người dùng dừng lại thường không phải là sau khi nhận được phản hồi tệ. Mà là sau khi nhận được phản hồi *tốt*. Họ đọc điều gì đó chạm đúng - rồi ngồi đó, không biết bước tiếp theo là gì. Copy code? Hỏi thêm? Click cái gì đó?

Đây một phần là vấn đề UX, nhưng sâu hơn, đó là vấn đề mental model. Hầu hết mọi người chưa có trực giác về AI dialogue như một *workflow*. Họ biết cách dùng Google (đọc kết quả đầu, xong) và biết cách nói chuyện với bạn bè (qua lại tự nhiên). AI nằm ở đâu đó giữa hai thứ đó - và phiên đầu tiên thường là lúc họ đang tự tìm câu trả lời cho điều này.

## Những thay đổi chúng tôi thực hiện

Ba thay đổi cụ thể xuất phát trực tiếp từ những quan sát này.

Thứ nhất, chúng tôi xây lại **empty state** để trả lời câu hỏi "đây là loại sản phẩm gì?" trước khi người dùng kịp hỏi. Ngắn, cụ thể, thật thà - hai câu mô tả Codepet dùng để làm gì, cộng ba ví dụ prompt cho thấy phạm vi của nó. Không phải danh sách tính năng, mà là một lời mời.

Thứ hai, chúng tôi thêm **calibration độ dài phản hồi cho phiên đầu tiên**. Khi tin nhắn đầu tiên của người dùng mang tính thăm dò, AI bây giờ mặc định trả lời ngắn hơn, hội thoại hơn - kết thúc bằng một câu hỏi ngược lại thay vì câu trả lời toàn diện. Mục tiêu là kéo dài cuộc đối thoại, không phải thắng ngay lượt đầu.

Thứ ba, chúng tôi thêm **gợi ý "tiếp theo là gì?"** sau phản hồi của AI trong ba phiên đầu. Một thành phần UI nhỏ - không phô trương - đề xuất hai hoặc ba hướng tiếp theo: copy code, hỏi thêm, thử tự làm. Pattern "dừng lại rồi đóng app" giảm rõ rệt sau đó.

Không thay đổi nào trong số này đến từ khảo sát hay review trên app store. Tất cả đến từ việc quan sát.

> Điều người dùng nói trong feedback và điều họ làm trong sản phẩm có liên quan - nhưng không giống nhau. Cái đầu là ký ức. Cái sau là hành vi.

## Điều này có nghĩa gì với người đang xây sản phẩm AI

Nếu bạn đang xây bất cứ thứ gì có AI ở lõi, hành vi phiên đầu tiên rất đáng theo dõi - không chỉ đo lường. Metric cho bạn biết người dùng bỏ ở đâu. Recording cho bạn biết *tại sao*. Và lý do "tại sao" của phiên đầu tiên với sản phẩm AI gần như luôn thuộc về một trong ba nhóm:

- **Calibration lệch**: phản hồi quá dài, quá hình thức, hoặc quá chi tiết so với tín hiệu người dùng gửi đến
- **Mental model không khớp**: người dùng chưa hiểu loại hội thoại nào đang được mời gọi
- **Không rõ bước tiếp theo**: họ thích thứ vừa nhận nhưng không biết đi đâu tiếp

Tin tốt là: cả ba đều có thể sửa trong sản phẩm. Không cái nào đòi hỏi một model tốt hơn.

Vấn đề calibration thường nằm ở cách thiết kế [system prompt](/vi/blog/system-prompts-that-work-in-production) - đặc biệt là hướng dẫn về độ dài và giọng điệu phản hồi cho các phiên sớm. Vấn đề mental model thường nằm ở empty state và example prompt. Vấn đề bước tiếp theo thường nằm ở cấu trúc phản hồi: mỗi lượt AI kết thúc bằng một lời mời tiếp tục rõ ràng, ít ma sát.

Điều đáng nói là: vấn đề phiên đầu tiên có tác động kép. Những người dùng vượt qua được nó thường ở lại lâu hơn rất nhiều - và con đường từ "lần đầu mở app" đến "[khoảnh khắc thật sự ship thứ gì đó](/vi/blog/what-happens-when-you-actually-ship)" thường được quyết định ở những phút đầu tiên đó.

## Điều có thể làm ngay tuần này

Phiên đầu tiên là gương chiếu sản phẩm - nó cho bạn thấy sản phẩm thực sự là gì, không phải bạn muốn nó là gì.

Nếu bạn chưa từng xem recording của người dùng mới lần đầu mở sản phẩm, đó có lẽ là việc quan trọng nhất có thể làm tuần này. Không phải A/B test. Không phải dashboard. Chỉ cần xem vài phiên và chú ý những chỗ họ dừng lại, họ kỳ vọng gì, và điều gì phá vỡ "phép màu" đó.

Rồi sửa thứ đầu tiên làm phá vỡ nó. Bạn có thể ngạc nhiên khi thấy sửa đổi nhỏ đến mức nào.
