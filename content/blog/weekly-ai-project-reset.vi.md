---
title: "Reset dự án mỗi tuần: cách không để AI dẫn bạn đi lạc"
description: "Khi làm việc cùng AI, dự án dễ trôi dạt mà không hay. Một buổi reset 30 phút mỗi tuần giúp giữ hướng đi, làm sắc nét prompt, và giữ cho tư duy rõ ràng."
date: "2026-06-24"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["weekly-review", "ai", "context", "second-brain", "habits", "workflow"]
---

Có một kiểu bực bội rất đặc trưng khi làm việc cùng AI - bạn ngồi code miệt mài bốn tiếng đồng hồ, rồi nhìn lại và nhận ra mình vừa giải quyết đúng một vấn đề sai. Không phải AI sai. AI cho bạn đúng những gì bạn hỏi. Nhưng chính *bạn* đã trôi dạt - câu hỏi ban đầu dần biến tướng, scope bành ra mà không ai để ý, và khi ngẩng đầu lên thì thứ đang được build không còn là thứ định build nữa.

Vấn đề không nằm ở chỗ cần prompt tốt hơn trong phiên làm việc đó. Mà là một thói quen *bên ngoài* những phiên đó: một buổi reset mỗi tuần để xóa sương mù, nạp lại ý định thật sự, và cho những lần làm việc với AI có điểm neo ổn định.

Sau đây là cách làm.

## Tại sao dự án AI lại dễ trôi dạt?

Mọi AI assistant đều hoạt động dựa trên context window - phần thông tin nó nhìn thấy ngay lúc này. Nó không nhớ bạn quyết định gì hôm thứ Ba. Nó không biết bạn đã xoay hướng với phần login flow. Nó gặp bạn đúng tại điểm bạn đang đứng - và nếu *bạn* không có hình dung rõ ràng về dự án đang ở đâu, thì nó cũng không có.

Hệ quả là sự trôi dạt âm thầm. Bạn bắt đầu bằng việc hỏi về một button component. Rồi refactor cả trang. Rồi thiết kế lại data model. Ba tiếng sau, bạn có code tốt cho một vấn đề mình không còn gặp nữa.

> "AI không trôi dạt. Bạn mới trôi. AI chỉ đang đi theo bạn."

Buổi reset hàng tuần tồn tại để phát hiện sự trôi dạt đó trước khi nó tích lũy thành thiệt hại thật sự.

## Một buổi reset trông như thế nào

Ba mươi phút, một lần mỗi tuần. Gồm ba phần.

### 1. Đổ ra tất cả những gì xảy ra trong tuần

Mở một file - markdown, Notion, bất cứ thứ gì bạn thực sự sẽ dùng - và brain-dump tuần vừa qua trong dự án. Không cần gọn gàng, không cần viết đẹp. Chỉ cần trả lời thật bốn câu hỏi này:

- **Mình đã build gì?** Liệt kê những thứ thực sự đã hoàn thành hoặc ra mắt, dù nhỏ.
- **Mình đã quyết định gì?** Bất kỳ lựa chọn nào thay đổi hướng đi: đổi thư viện, xoay hướng UX, cắt tính năng.
- **Vẫn còn bỏ ngỏ những gì?** Vấn đề chưa giải quyết, câu hỏi chưa trả lời, những thứ cảm giác chưa ổn định.
- **Mình học được gì?** Một hai insight bạn chưa có đầu tuần - về người dùng, về kỹ thuật, hoặc về bản thân.

Việc này mất mười phút. Giá trị không nằm ở bản tài liệu - mà ở hành động phải nói thành lời. Sự trôi dạt thường lộ ra ở đây: "Ủa, sao mình vẫn đang làm cái onboarding flow? Mình đã quyết định bỏ nó từ hai tuần trước rồi mà."

### 2. Cập nhật file context

Đây là phần thực tế nhất. Những dự án dùng AI nghiêm túc đều cần một `CONTEXT.md` - một file tổng kết tồn tại lâu dài, dùng để brief cho AI mỗi khi bắt đầu phiên mới. Tùy toolchain của bạn, nó có thể là `CLAUDE.md`, `.cursor/rules`, hay bất cứ định dạng nào tương đương; tên gọi không quan trọng bằng thói quen dùng nó.

Sau khi brain-dump xong, cập nhật file đó. Một template tối giản mà người ta thực sự dùng:

```markdown
## Dự án: [Tên]
**Đây là gì:** [Một câu]
**Đang tập trung vào:** [Bạn đang build gì tuần này]

**Những quyết định đã chốt:**
- [Quyết định 1, và lý do]
- [Quyết định 2, và lý do]

**Không đi vào:**
- [Scope creep cứ kéo mình]
- [Cái hố thỏ ngốn hết thứ Ba]

**Câu hỏi còn mở:**
- [Câu hỏi cần giải quyết tiếp]
```

Phần "Không đi vào" là phần mọi người hay bỏ qua và sau đó hối hận. **Đặt tên cho những thứ phân tâm giúp bạn cưỡng lại chúng dễ hơn.** Khi bạn bắt đầu phiên thứ Hai và dán file này vào session, AI biết bạn đang chơi cái game gì - và quan trọng hơn, *bạn* cũng biết.

Để hiểu cơ chế context hoạt động trong một phiên đơn lẻ, bài [cách cho AI ngữ cảnh đúng](/vi/blog/how-to-give-ai-context) là điểm xuất phát tốt. Buổi reset hàng tuần là thứ giữ cho ngữ cảnh đó không bị lỗi thời.

### 3. Chốt một ý định rõ ràng

Kết thúc buổi reset bằng một câu: *Tuần này mình muốn ship [thứ cụ thể].* Không phải danh sách. Một thứ thôi. Câu đó trở thành bộ lọc cho mọi phiên làm việc tiếp theo. Khi một ngã rẽ thú vị xuất hiện - và trong các phiên làm việc với AI thì ngã rẽ xuất hiện liên tục - bạn chỉ cần hỏi: cái này có đưa mình đến được thứ đó không?

Sự ràng buộc không phải hình phạt - đó là định hướng.

## Hiệu ứng tích lũy

Tuần đầu tiên, buổi reset không có nhiều giá trị ngay. Nhưng đến tuần thứ tư, bạn có nhật ký bốn entry về các quyết định thực sự, một file context phản ánh dự án thật (chứ không phải phiên bản tưởng tượng từ tuần một), và cảm nhận rõ hơn về nơi công việc thực sự đang nằm.

Và bạn còn có thứ hữu ích hơn nữa: một bản ghi những gì đã thử. Khi mở AI lên và nói "mình đã thử X và Y rồi, đây là lý do chúng không ổn" - bạn thoát được những gợi ý đã bị loại từ trước. Điều này không nhỏ. AI assistant gợi ý rất thoải mái, kể cả những ý tưởng bạn đã loại từ ba tuần trước. Nhật ký hàng tuần có nghĩa là bạn mang khả năng lọc đó theo, thay vì phải tự khám phá lại những ngõ cụt từ đầu mỗi phiên.

Nếu bạn đang nghĩ đến chuyện xây một hệ thống kiến thức lâu dài bên cạnh dự án - thứ gì đó tích lũy và lớn lên cùng bạn - thì bài [xây dựng bộ não thứ hai biết suy nghĩ cùng bạn](/vi/blog/building-a-second-brain-that-thinks-with-you) đi sâu hơn vào chiều dài.

## Cái giá thật sự của sự trôi dạt

Thực tế: nếu bạn làm việc với AI hai mươi tiếng mỗi tuần mà 20% trong đó là trôi dạt - giải quyết sai vấn đề con, lặp lại ngõ cụt đã thử, refactor thứ sắp bị xóa - đó là bốn tiếng bị mất mỗi tuần. Một tháng là gần cả một tuần làm việc bay đi.

Buổi reset hàng tuần không xóa được sự trôi dạt hoàn toàn. Nhưng cắt nó đi một nửa là hoàn toàn thực tế - và một nửa của bốn tiếng mỗi tuần, nhân lên theo thời gian, là không nhỏ.

### Những dấu hiệu cần chú ý trong brain-dump

Đây là những tín hiệu đáng chú ý:

| Dấu hiệu | Ý nghĩa |
| --- | --- |
| "Mình cứ bị X làm phân tâm" | X cần được đưa vào danh sách "không đi vào" |
| "Mình không chắc mình đã ship gì" | Ý định cho tuần không đủ cụ thể |
| "Mình refactor thứ sắp bị xóa" | File context chưa neo được các phiên làm việc |
| "Mình giải thích cùng một thứ hai lần" | Các quyết định chưa được ghi lại ở đâu |

Đặt tên cho mẫu hành vi trong brain-dump giúp bạn có thể sửa nó vào tuần sau.

## Một công cụ, không phải một nghi lễ

Một bẫy hay gặp là coi buổi reset như một bài tập reflection sâu sắc. Không phải vậy - đây là task bảo trì, giống như dọn bàn làm việc hay cập nhật dependencies. Thứ quan trọng là file context được cập nhật, giúp phiên thứ Hai sắc nét hơn so với phiên thứ Sáu trước đó.

Nếu bạn đang dùng Codepet, file context đó ảnh hưởng trực tiếp đến cách người bạn đồng hành tiếp cận các phiên của bạn - nó càng cập nhật, phản hồi càng chính xác, và bạn càng ít phải giải thích lại dự án đang ở đâu. Nhưng thói quen này không phụ thuộc vào công cụ: nó hoạt động với bất kỳ AI assistant nào, bất kỳ dự án nào, bất kỳ stack nào.

Dự án bạn đang build xứng đáng được đầu tư ba mươi phút mỗi tuần.
