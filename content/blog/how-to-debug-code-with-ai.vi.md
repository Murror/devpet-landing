---
title: "Debug code cùng AI: cái gì hiệu quả, cái gì chỉ mất thời gian"
description: "Paste error rồi chờ AI sửa - đó là cách hầu hết mọi người debug. Chúng tôi đã quan sát đủ session để biết cái gì thực sự hiệu quả."
date: "2026-06-20"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["debugging", "ai", "coding", "beginners", "prompt-engineering"]
---

Có một thói quen xuất hiện gần như trong mọi session debug của người dùng Codepet: gặp lỗi là paste vào chat, chờ AI trả lời, rồi paste lỗi tiếp theo. Cứ như vậy. Cảm giác đang làm việc rất hiệu quả - nhưng thường chỉ là cảm giác thôi.

Sau khi quan sát hàng trăm session, chúng tôi nhận ra rằng cách tiếp cận phổ biến nhất lại thường cho kết quả tệ nhất. Cách làm thực sự hiệu quả thì ngược lại: chậm hơn một chút, cố tình hơn một chút, và đòi hỏi bạn phải nghĩ nhiều hơn trước khi gõ câu hỏi.

## Vì sao "paste và cầu trời" lại không đi đến đâu

Stack trace là triệu chứng, không phải nguyên nhân. Khi bạn paste một error vào chat mà không có ngữ cảnh, bạn đang yêu cầu AI giải một bài toán thiếu hầu hết thông tin: không biết cấu trúc project, không biết bạn vừa thay đổi gì, không biết bạn đang cố làm gì. Model sẽ pattern-match lỗi đó với các nguyên nhân quen thuộc rồi đề xuất cái có vẻ đúng nhất. Đôi khi trúng. Thường là không - và bạn lại mất thêm một vòng.

> Người debug qua mười lỗi học được mười cách sửa. Người hiểu một lỗi học được mười nguyên lý.

Vấn đề là ở đây. Paste lỗi liên tục tạo ra cảm giác tiến độ vì mỗi lần có thứ gì đó thay đổi. Nhưng bạn đang outsource phần suy nghĩ đi - mà đó lại chính là nơi việc học thực sự diễn ra.

Ngoài chuyện học, cách này cũng cho kết quả tệ hơn xét về mặt thuần túy kỹ thuật. Không có ngữ cảnh, AI đưa ra gợi ý chung chung. Có ngữ cảnh, câu trả lời sẽ chính xác hẳn.

## Debug hiệu quả trông như thế nào

Ba điều phân biệt một session debug tốt và một session cứ loanh quanh mãi không ra.

### Kể cho AI biết bạn đã thử gì rồi

Trước khi mô tả lỗi, hãy nói những gì bạn đã làm. "Tôi đã thử X, Y, Z. Không hiệu quả vì A và B." Điều này thu hẹp không gian giải pháp ngay lập tức, tránh những gợi ý bạn đã loại từ trước. Đáng nói là, nó cũng cho thấy bạn đã nghĩ - và AI thường phản hồi chính xác hơn với người đến có chuẩn bị.

### Viết ra "mong đợi" và "thực tế"

Khoảng cách giữa điều bạn mong đợi và điều thực sự xảy ra - đó chính là nơi bug trú ẩn. Diễn đạt rõ ràng hai vế này buộc bạn phải nhìn thẳng vào mental model của chính mình. Và nhiều khi, chỉ cần viết ra thôi là đã thấy vấn đề ở đâu rồi, chưa cần gửi đi.

```
Mong đợi: nhấn "Lưu" ghi dữ liệu vào database và hiện toast thành công
Thực tế:  toast xuất hiện, nhưng row trong database vẫn rỗng
```

Kiểu framing này mạnh hơn nhiều so với paste một dòng `500 Internal Server Error` vào chat.

### Thu nhỏ vấn đề trước khi hỏi

Bug nằm trong file 400 dòng không có nghĩa là bạn paste 400 dòng. Hãy thu nhỏ nó trước: comment out các phần không liên quan, thêm `console.log`, tìm đoạn code ngắn nhất vẫn còn reproduce được lỗi. Quá trình thu nhỏ này thường tự tiết lộ bug - nhưng dù không tìm ra, nó vẫn làm AI làm việc hiệu quả hơn rất nhiều.

Điều thú vị là đây cũng là một trong những dấu hiệu rõ ràng nhất của người debug giỏi mà chúng tôi thấy ở Codepet. Những developer thực sự ship được sản phẩm không chỉ paste error - họ đã biết sơ sơ lỗi nằm ở đâu trước khi đặt câu hỏi.

## Ba cách debug, từ tốt nhất đến tệ nhất

### Hỏi để hiểu (Tốt nhất)

Yêu cầu AI giúp bạn *hiểu* lỗi, không phải *sửa* lỗi. "Lỗi này có nghĩa là gì? Những nguyên nhân phổ biến nhất là gì?" Rồi tự điều tra trước khi quay lại với những gì bạn tìm được. AI trở thành người hướng dẫn thay vì máy trả lời. Bạn làm nhiều hơn, nhưng bạn xây dựng được mental model - cái khiến các bug tiếp theo dễ giải hơn nhiều.

Điều này liên quan đến một pattern lớn hơn mà chúng tôi đã viết trong bài [dùng AI như một thought partner thực sự](/blog/ai-as-thought-partner-not-search-engine): những người dùng hiệu quả nhất coi AI là công cụ để suy nghĩ, không phải máy trả lời.

### Kỹ thuật "con vịt cao su" (Tốt)

Mô tả vấn đề bằng câu đầy đủ trước khi hỏi. Không phải "tại sao cái này hỏng?" mà là: "Tôi đang xây form lưu dữ liệu vào Supabase. Khi user submit, tôi gọi một async function chạy INSERT. INSERT trả về success, nhưng row không xuất hiện trong table. Tôi nghi RLS policy đang chặn - đã kiểm tra nhưng trông có vẻ ổn. Tôi đang bỏ sót gì?"

Viết xong câu này thường là đã tự trả lời được rồi. Debug theo kiểu "con vịt cao su" với AI hiệu quả vì việc viết ra buộc bạn phải chính xác hơn bất kỳ thứ gì khác.

### Paste thẳng (Tệ nhất)

Paste lỗi, paste file, chờ. Đây là cách mặc định, và cũng là cách chậm nhất. Không phải lúc nào cũng sai - đôi khi một lỗi cụ thể trong đoạn code ngắn cho câu trả lời chính xác ngay - nhưng nếu thành thói quen, nó giữ bạn phụ thuộc và cho kết quả ngày càng kém hơn theo thời gian.

## Một template prompt debug thực sự có ích

```
Ngữ cảnh:    [một câu - app/tính năng này làm gì]
Mục tiêu:    [function/đoạn code này cần làm gì]
Mong đợi:    [hành vi mong đợi cụ thể]
Thực tế:     [hành vi thực tế + lỗi nếu có]
Đã thử:      [danh sách các cách thử + lý do không được]
Code liên quan: [đoạn code tối giản, không phải cả file]

Câu hỏi: [cụ thể - "cái gì sai?" quá mơ hồ; "tại sao X xảy ra dù Y là đúng?" mới hữu ích]
```

Template này không phải phép màu - chỉ là cái khung buộc bạn chuẩn bị đủ thông tin để bất kỳ session debug nào cũng đi nhanh hơn.

## Người debug giỏi có một điểm chung

Ở các session Codepet, những người tiến nhanh nhất có chung một thói quen: **họ ở lại trong bài toán lâu hơn trước khi hỏi.** Không phải mãi mãi - AI thực sự có ích - nhưng đủ lâu để hình thành một giả thuyết. Rồi dùng AI để kiểm tra hoặc thách thức giả thuyết đó, không phải để thay thế việc nghĩ.

Điều này quan trọng cho việc học, nhưng cũng quan trọng cho năng suất thực tế. Một câu hỏi được chuẩn bị kỹ thường cho câu trả lời hữu ích ngay lần đầu. Câu hỏi mơ hồ tạo ra một chuỗi "bạn có thể chia sẻ thêm context không?" - dẫn đến đâu đó mơ hồ không kém.

Suy cho cùng, debug là cách bạn xây dựng bản đồ mental về một codebase. Làm tốt điều này - với AI là cộng tác viên thay vì phím tắt - mỗi bug bạn giải quyết đều để lại một dấu vết trên bản đồ đó. Chuyên mục [Building AI Products](/blog/category/building-ai-products) có nhiều hơn về cách xây dựng hệ thống vững chắc khi mọi thứ không chạy như kỳ vọng.

**Thực hành ngay:** trước session debug tiếp theo, viết ra điều bạn mong đợi, điều thực sự xảy ra, và những gì bạn đã thử. Rồi mang cái đó đến với AI. Chất lượng câu trả lời gần như lúc nào cũng phản ánh chất lượng của câu hỏi.
