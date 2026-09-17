---
title: "Tại sao AI hay trả lời chung chung — và cách khắc phục điều đó"
description: "Câu trả lời chung chung đến từ câu hỏi chung chung. Đây là cách cung cấp đủ context để AI thực sự hiểu vấn đề của bạn và đưa ra phản hồi đáng để hành động."
date: "2026-06-21"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "prompting", "context", "productivity", "second-brain"]
---

Hẳn bạn đã từng gặp qua cảm giác này: đặt một câu hỏi thật sự quan trọng cho AI, rồi nhận về một câu trả lời dài ngoằng - đọc qua thì thấy đủ lý - nhưng hoàn toàn không giải quyết được vấn đề đang có trước mặt. Không sai, không thiếu, nhưng cũng không đúng.

Không phải lỗi của model. Vấn đề là bạn chưa cho nó đủ thứ để làm việc.

## AI nói chuyện chung chung vì bạn hỏi chung chung

Khi bạn hỏi "làm sao thiết kế database cho ứng dụng ghi chú?", model gần như không có gì để bám vào — ghi chú về cái gì, dùng framework nào, quy mô ra sao, bạn đã thử gì rồi? Nó chỉ có thể trả lời theo cách duy nhất có thể: một câu trả lời áp dụng được cho tất cả mọi người, và do đó không thực sự phù hợp với ai.

Đây không phải giới hạn công nghệ. Ngay cả model mạnh nhất thế giới cũng cho ra câu trả lời mơ hồ nếu câu hỏi mơ hồ. Khoảng cách giữa người dùng AI hiệu quả và người chỉ nhận được kết quả tầm thường thường không nằm ở chỗ họ dùng model nào - mà nằm ở context họ cung cấp: nhiều hay ít, rõ hay tối, nhất quán hay tuỳ hứng.

## Hai cách hỏi, hai kết quả hoàn toàn khác nhau

Hãy xem ví dụ cụ thể để thấy khoảng cách này rõ ràng hơn.

**Không có context:**
> Làm sao sort một array trong Swift?

Model cho bạn ba câu với `sorted(by:)` và vài dòng về tăng dần, giảm dần. Đúng - nhưng đó không phải điều bạn thực sự cần.

**Có context:**
> Tôi đang làm màn hình playlist trong một macOS app. Tôi có array gồm các `Song` struct với `listenCount: Int` và `isPinned: Bool`. Muốn sort theo số lần nghe nhiều nhất, nhưng bài nào được ghim thì phải luôn nằm trên cùng — dù ít lượt nghe hơn. Tôi đã thử two-pass sort nhưng code trở nên lộn xộn. Có cách nào viết gọn hơn không?

Lúc này model biết ngôn ngữ bạn dùng, hình dạng dữ liệu, hành vi mong muốn, và cả ngõ cụt bạn vừa đi qua. Câu trả lời nó đưa ra có thể dùng ngay:

```swift
songs.sorted {
    if $0.isPinned != $1.isPinned { return $0.isPinned }
    return $0.listenCount > $1.listenCount
}
```

Không phải "mẹo prompt" gì cả — chỉ là cho AI biết những gì nó cần biết.

## Năm thứ nên có trong mỗi cuộc hội thoại nghiêm túc

### 1. Dự án và mục tiêu của bạn là gì

Đừng chỉ mô tả tác vụ riêng lẻ — hãy nói mục tiêu mà tác vụ đó phục vụ. "Tôi đang xây một macOS app giúp người mới học code cùng AI" là context có tác dụng ngay lập tức, vì nó định hình toàn bộ hướng đi của cuộc trò chuyện.

### 2. Bạn đã thử gì rồi — và kết quả ra sao

Đây là phần bị bỏ qua nhiều nhất. Mỗi lần thử sai đều mang theo thông tin: một giới hạn bạn vừa phát hiện, một hướng vừa bị loại bỏ, một cách tiếp cận gần đúng nhưng chưa ổn. Khi bạn chia sẻ lịch sử này, model không còn gợi ý những thứ bạn đã thử - và bạn không còn phải lãng phí câu trả lời đầu tiên để loại trừ chúng.

### 3. Các ràng buộc của bạn

Ngôn ngữ, framework, thời gian, quy mô nhóm, pattern code hiện tại, những thứ bạn không muốn thay đổi. Ràng buộc chính là tường bao của bài toán. Không có tường, model sẽ thiết kế cho không gian mở — đẹp về lý thuyết nhưng không dùng được trong thực tế của bạn.

### 4. Cách bạn đang hiểu vấn đề

Hãy chia sẻ model tư duy hiện tại của mình về vấn đề — dù bạn nghĩ mình đang hiểu sai. "Tôi đoán lỗi nằm ở cách tôi quản lý state, nhưng chưa chắc" vẫn tốt hơn không nói gì. Model có thể xác nhận trực giác của bạn, hoặc chỉ ra chính xác chỗ nó lệch.

### 5. Bạn muốn được giúp theo kiểu nào

Khám phá, quyết định, phê bình, hay chỉ cần viết code? Đây là những yêu cầu rất khác nhau. "Giúp tôi suy nghĩ về các trade-off" sẽ cho ra phản hồi hoàn toàn khác so với "viết cho tôi phần implementation". Nói rõ điều này từ đầu tiết kiệm thời gian cho cả hai.

## Xây dựng thư viện context sẵn dùng

Thật ra một số context cứ lặp đi lặp lại qua mọi phiên làm việc cùng một dự án: stack bạn dùng, style code, các ràng buộc, mục tiêu chung. Gõ lại từ đầu mỗi lần là ma sát không cần thiết - và bỏ đi thì AI quên ngay bạn là ai khi bạn mở tab mới.

Hãy chuẩn bị sẵn một đoạn "project context" ngắn để dán vào đầu mỗi phiên làm việc - một snippet trong text expander, một ghi chú được ghim, hay một comment ở đầu scratchpad. Ví dụ:

```
Dự án: Codepet — macOS app học code cùng AI (Swift, SwiftUI)
Style: Gọn, functional, tránh dependency bên ngoài khi không cần thiết
Focus hiện tại: Tính năng playlist kèm vòng lặp gamification
Ràng buộc: macOS 14+, nhóm nhỏ, deadline hai tuần nữa
```

Dán đoạn này vào đầu buổi làm việc, kết quả sẽ khác ngay - và tích luỹ theo thời gian. Nếu muốn đi xa hơn và để AI tự động kéo context từ notes của bạn thay vì phải dán tay, bạn có thể đọc thêm về cách xây [hệ thống RAG cá nhân cho ghi chú của mình](/vi/blog/build-personal-rag-for-notes).

## Thói quen nhỏ, hiệu quả cộng dồn

Đáng nói là những người - và những nhóm - dùng AI hiệu quả nhất không nhất thiết có prompt hay hơn. Họ có thói quen tốt hơn: mỗi dự án mới đều bắt đầu bằng một đoạn context, mỗi câu hỏi đều đi kèm lịch sử những gì đã thử, mỗi hiểu lầm đều được sửa sớm để phần còn lại của cuộc trò chuyện đi đúng hướng.

Theo thời gian, thói quen này trở thành bản năng. Không còn cảm giác "làm thêm việc" - mà là tiêu chuẩn tối thiểu. Vì bất cứ thứ gì ít hơn đều cho ra câu trả lời bạn phải vứt đi.

> "Model thông minh đúng bằng mức context bạn cung cấp. Đó không phải lời chê model - đó là thứ mạnh mẽ nhất về việc dùng AI một cách nghiêm túc."

Suy cho cùng, nếu bạn muốn tiến xa hơn - không chỉ dùng AI để code mà còn để suy nghĩ sâu hơn về những vấn đề phức tạp - cách bạn đặt câu hỏi quan trọng không kém gì context bạn cung cấp. Đó là một kỹ năng khác, và chúng tôi đã viết về nó trong bài [Dùng AI như người bạn đồng hành tư duy, không phải công cụ tìm kiếm](/vi/blog/ai-as-thought-partner-not-search-engine).

## Điều cụ thể để làm ngay hôm nay

Trước phiên làm việc với AI tiếp theo, dành chín mươi giây viết ra: bạn đang làm dự án gì, bạn đã thử gì rồi, và bạn thực sự muốn AI làm gì. Dán vào trước câu hỏi. Xem điều gì thay đổi.

Model không thay đổi. Câu trả lời bạn nhận được thì có.
