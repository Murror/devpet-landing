---
title: "Thiết kế trạng thái lỗi cho tính năng AI: phải hiển thị gì khi model thất bại"
description: "Phần lớn sản phẩm AI đánh mất niềm tin của người dùng ngay chính trong khoảnh khắc xảy ra lỗi. Đây là cách thiết kế những trạng thái dự phòng giúp người dùng quay lại."
date: "2026-07-20"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai product design", "error states", "ux", "llm", "product engineering", "building with ai"]
---

Có một khoảnh khắc mà hầu như mọi builder AI đều từng trải qua - nhìn vào analytics và nhận ra người dùng đã âm thầm rời đi ngay sau khi AI trả lời sai. Không có ticket support, không có lời phàn nàn, không có gì cả. Họ chỉ... biến mất.

Đây chính xác là lúc thiết kế trạng thái lỗi quan trọng hơn bất kỳ tính năng nào bạn có thể thêm vào sản phẩm.

Khi một phần mềm thông thường bị lỗi, nguyên nhân thường có thể truy ra được: file thiếu, kết nối mạng bị ngắt, exception chưa được xử lý. Sửa xong là chạy lại. Lỗi trong AI thì khác - model có thể trả lời sai một cách tự tin, có thể từ chối một yêu cầu hoàn toàn hợp lý, hoặc tệ hơn, tạo ra một đoạn văn nghe rất có vẻ đúng nhưng lại không giải quyết bất cứ điều gì người dùng thực sự cần. Và khác với lỗi database, chuyện này xảy ra không theo quy luật, với nhiều người dùng, lặp đi lặp lại - thường là bạn không hay biết cho đến khi họ đã đi rồi.

## Ba dạng thất bại của AI

Trước khi thiết kế được phản ứng phù hợp, bạn cần biết mình đang đối phó với dạng nào.

**Dạng một: đầu ra sai hoặc "hallucination"**

Model trả về thứ gì đó có vẻ chắc chắn nhưng thực ra là sai về mặt thực tế, không nhất quán về logic, hoặc đơn giản là không giúp ích gì cho người dùng. Đây là dạng nguy hiểm nhất - không có error để catch, không có exception để xử lý. Người dùng đọc, tin, hành động theo, và chỉ phát hiện ra vấn đề sau khi đã tốn thời gian.

**Dạng hai: từ chối hoặc trả lời lạc đề**

Model từ chối yêu cầu, nói chuyện vòng vo, hoặc bọc một câu không có giá trị trong hàng đống điều khoản bảo lưu. Đáng bực nhưng ít nhất còn nhìn thấy được - người dùng biết họ chưa có được thứ mình muốn.

**Dạng ba: lỗi hạ tầng**

Timeout, rate limit, lỗi 500 từ API, hoặc response bị cắt giữa câu. Dạng này gần với lỗi phần mềm thông thường nhất và cũng dễ xử lý nhất - nhưng vẫn thường bị xử lý kém.

## Người dùng thực sự trải qua gì

Khi xây dựng Codepet, chúng tôi quan sát thấy một pattern đáng lo ngại: khi một người mới học code gặp phải lỗi từ AI, phản ứng đầu tiên của họ không phải là nghi ngờ tool - mà là nghi ngờ bản thân. Họ nghĩ mình đặt câu hỏi chưa đúng. Rằng mình chưa đủ giỏi để hiểu câu trả lời. Sự tự tin giảm sút. Mức độ tương tác giảm theo. Họ đóng app lại.

Đây chính là vấn đề cốt lõi của lỗi AI. Lỗi phần mềm thông thường cảm giác như *cái máy bị hỏng*. Lỗi AI lại cảm giác như *lỗi của mình*.

> "Mình không nhận ra AI đưa code sai cho đến khi đã mất hai tiếng đồng hồ cố tìm lỗi ở chỗ vốn dĩ không có lỗi." — một người dùng Codepet trong giai đoạn beta

Câu đó được chúng tôi đặt ngay trong tài liệu thiết kế error handling, làm nhắc nhở thường trực. Mục tiêu không phải là ngăn mọi thất bại của AI - điều đó không thể làm được. Mục tiêu là đảm bảo người dùng rời khỏi khoảnh khắc lỗi với sự tự tin còn nguyên vẹn.

## Những pattern thiết kế đáng học

### Thể hiện sự không chắc chắn, thay vì giả vờ tự tin

Pattern tệ nhất là model nói "Đây là câu trả lời của bạn" trong khi thực ra nó đang đoán. Pattern tốt nhất đòi hỏi prompt engineering chứ không chỉ là thiết kế UI - hãy hướng dẫn model bày tỏ sự không chắc chắn khi có:

```
When you are not certain about a technical detail, say "I'm not sure, but I think..."
or "You may want to verify this, but..." rather than presenting guesses as facts.
```

Khi model "thú nhận" sự không chắc chắn, người dùng có thêm thông tin để quyết định mức độ tin tưởng. Tốt hơn nhiều so với một câu trả lời sai nhưng nghe chắc như đinh đóng cột.

### Luôn có "lối thoát" rõ ràng

Dù lỗi xảy ra vì lý do gì, hãy cho người dùng một hành động cụ thể có thể làm tiếp:

- **Với câu trả lời sai hoặc bị từ chối:** một gợi ý như "Kết quả chưa đúng ý - thử diễn đạt lại, hoặc xem các bài viết trong mục [Xây dựng sản phẩm AI](/vi/blog/category/building-ai-products) để tham khảo thêm."
- **Với lỗi hạ tầng:** nút thử lại với ngôn ngữ trung thực ("Model bị timeout - thử lại nhé?") thay vì câu "Đã xảy ra lỗi" mơ hồ không rõ ý.
- **Với hallucination phát hiện trong post-processing:** một cờ nhỏ nhẹ nhàng ("Hãy kiểm tra lại trước khi dùng") để người dùng biết không nên tin tuyệt đối.

Lý do "lối thoát" quan trọng đến vậy: người dùng biết bước tiếp theo phải làm gì thì không cảm thấy bị mắc kẹt. Người dùng gặp ngõ cụt thì hoặc là rời đi, hoặc tệ hơn - hành động dựa trên thông tin sai.

### Thể hiện trách nhiệm thay vì xin lỗi

"Xin lỗi vì sự nhầm lẫn" là phản xạ, không phải giải pháp. Điều người dùng thực sự cần không phải là một lời xin lỗi - họ cần thấy rằng sản phẩm hiểu chuyện gì đã xảy ra và đang cố gắng giúp họ tiến lên.

So sánh hai phản ứng sau đây khi AI trả lời trật:

- ❌ "Xin lỗi vì sự nhầm lẫn. Vui lòng thử lại."
- ✅ "Câu trả lời này chưa đúng. Muốn thử góc tiếp cận khác không? Đây là một vài cách đặt câu hỏi hiệu quả hơn cho dạng yêu cầu này."

Phản ứng thứ hai cho thấy sản phẩm đang chú ý đến người dùng. Nó gợi lên sự tiến bộ, không phải bất lực.

### Log pattern lỗi, không chỉ log error thuần

Với sản phẩm AI đang chạy thật, cách bạn quan sát hệ thống quan trọng không kém thiết kế UI. Hãy ghi lại:

- Input của người dùng là gì (với xử lý privacy phù hợp)
- Model trả về gì
- Người dùng làm gì tiếp theo - họ thử lại, diễn đạt lại, hay rời đi?

Đây chính là tập dữ liệu eval của bạn. Một tuần log lỗi sẽ cho thấy những pattern mà metrics tổng hợp không bao giờ tiết lộ được: những dạng prompt nào ổn định tạo ra output kém, những intent nào model liên tục hiểu sai. Xem thêm [cách viết LLM evals cho sản phẩm AI](/vi/blog/how-to-write-llm-evals-for-your-ai-product) và [đo trước khi tối ưu](/vi/blog/measure-before-you-optimize) để biết cách biến dữ liệu đó thành hành động cụ thể.

## Vòng lặp thất bại → phục hồi

Vấn đề là, những sản phẩm AI được thiết kế tốt không xem khoảnh khắc lỗi là trường hợp ngoại lệ - họ xem đó là một phần tự nhiên của luồng người dùng. Và đây là điều thú vị: một người dùng vấp phải lỗi nhưng được hỗ trợ phục hồi tốt thường *gắn bó hơn* so với người chưa từng gặp vấn đề gì - bởi vì chính khoảnh khắc phục hồi đó đã tạo dựng niềm tin.

**Thiết kế lỗi chính là thiết kế giữ chân người dùng.** Người ta nhớ cách bạn đối xử với họ trong lúc mọi thứ trục trặc.

Một vài thứ cụ thể đáng đầu tư xây dựng:

- **Kết quả một phần có giá trị.** Nếu bạn có thể cho người dùng *một thứ gì đó* hữu ích dù câu trả lời đầy đủ bị lỗi, hãy làm vậy. "Mình chưa tạo ra được giải pháp hoàn chỉnh, nhưng đây là khái niệm cốt lõi bạn cần nắm" tốt hơn hẳn một màn hình trắng.
- **Thử lại có thêm ngữ cảnh.** Một nút retry gửi đúng nguyên prompt cũ thường sẽ ra đúng kết quả cũ - tức là cũng sai. Hãy thiết kế retry để tự động thêm ngữ cảnh ("Câu trả lời trước chưa giải quyết được X") hoặc để người dùng điều chỉnh trước khi thử lại.
- **Đường thoát ra con người.** Với những sản phẩm có tính chất quan trọng, luôn cung cấp cách tiếp cận sự hỗ trợ của người thật hoặc tài nguyên đáng tin cậy bên ngoài. AI nên bổ trợ cho phán đoán của con người, không phải thay thế nhu cầu có nó.

## Bắt đầu từ đâu

Nếu bạn đang build sản phẩm AI và chưa nghĩ đến error states, đây là bộ tối thiểu cần có trước:

1. **Xử lý timeout.** Tự động thử lại một lần, sau đó hiển thị thông báo thân thiện với nút thử lại thủ công.
2. **Xử lý từ chối.** Phát hiện các response kiểu "Xin lỗi, mình không thể..." trong post-processing và thay thế bằng thông điệp tùy chỉnh gợi ý hướng thay thế.
3. **Tín hiệu độ tin cậy trong system prompt.** Chỉ cần một dòng hướng dẫn - "hãy nói rõ khi bạn không chắc" - cũng đủ để người dùng có thông tin cần thiết để quyết định mức độ tin tưởng vào output.

Không cái nào đòi hỏi đầu tư kỹ thuật lớn. Nhưng cả ba cộng lại sẽ xử lý được phần lớn những khoảnh khắc người dùng thực sự gặp khó khăn.

## Điều cần nhớ

Ship một tính năng AI tốt chỉ là một nửa công việc. Nửa còn lại là thiết kế điều xảy ra khi nó không hoạt động - bởi vì chắc chắn sẽ có lúc như vậy, và người dùng của bạn đang quan sát rất kỹ. Những sản phẩm xây dựng được niềm tin lâu dài không phải là những sản phẩm không bao giờ thất bại. Mà là những sản phẩm thất bại một cách khéo léo, phục hồi nhanh chóng, và để người dùng rời đi với cảm giác mình vẫn ổn - không phải bối rối hay tự trách.

Bắt đầu với ba thứ: thể hiện sự không chắc chắn trong prompt, tạo lối thoát rõ ràng trong UI, và log pattern lỗi để học từ đó. Mọi thứ khác đều có thể xây từ nền tảng này.
