---
title: "Xây dựng sản phẩm AI một cách công khai: Năm đầu tiên của Codepet dạy chúng tôi điều gì"
description: "Câu chuyện thật về việc xây dựng một ứng dụng macOS dùng AI — những canh bạc thành công, những tính năng phải xóa bỏ, và lời khuyên cho bất kỳ ai đang làm sản phẩm với AI hôm nay."
date: "2026-06-09"
updated: "2026-06-09"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Nhà sáng lập, Codepet"
tags: ["ai-products", "building-in-public", "startups", "macos"]
featured: true
---

Khi bắt đầu làm Codepet, lời giới thiệu của chúng tôi gói gọn trong một câu: một AI dạy bạn xây dựng phần mềm thật, chứ không chỉ hoàn thành các bài hướng dẫn. Một năm sau, câu đó vẫn nguyên vẹn — nhưng gần như mọi thứ *bên dưới* nó đã được viết lại ít nhất hai lần.

Đây là phiên bản không hào nhoáng của câu chuyện. Những canh bạc thành công, những thứ thất bại, và những bài học chúng tôi cứ phải học đi học lại.

## Bắt đầu từ vòng lặp nhỏ nhất nhưng có sức sống

Nguyên mẫu đầu tiên của chúng tôi rất tham vọng và chết yểu. Nó có giáo trình, cây kỹ năng, tám người bạn đồng hành, và một lộ trình — nhưng tất cả đều vô nghĩa, vì vòng lặp cốt lõi chưa hề thú vị.

Thứ cuối cùng tạo ra khác biệt lại nhỏ đến mức ngượng ngùng: viết một dòng code, nhận ngay một phản ứng *cụ thể* từ thú cưng của bạn. Không phải "Giỏi lắm!" mà là "Cái `useEffect` đó sẽ chạy mỗi lần render đấy — muốn xem tại sao không?"

> Đơn vị của một sản phẩm AI không phải là tính năng. Đó là một vòng lặp đủ ngắn để cảm giác như một cuộc trò chuyện.

Khi vòng lặp đó có sức sống, mọi thứ khác mới có chỗ để bám vào. Chúng tôi xóa ba tháng làm giáo trình và chẳng hề tiếc.

### Chúng tôi học được gì

- **Demo vòng lặp, đừng demo lộ trình.** Nếu tương tác cốt lõi 30 giây không khiến người ta nghiêng người về phía trước, thì thêm tính năng cũng không cứu nổi.
- **Tốc độ là một tính năng.** Một câu trả lời đúng đến sau bốn giây sẽ thua một câu trả lời đủ tốt đến trong 400ms. Chúng tôi đã bỏ công sức kỹ thuật thật sự chỉ để thú cưng *phản ứng nhanh*.

## Coi mô hình là một thành phần, không phải là sản phẩm

Thời gian đầu chúng tôi quá tập trung vào prompt. Vấn đề nào nhìn cũng giống vấn đề về prompt. Cái bẫy là prompt khiến ta *cảm giác* mình đang tiến bộ — chỉnh một chút, được câu trả lời tốt hơn, rồi ship.

Cách nhìn lại giúp chúng tôi: **mô hình chỉ là một thành phần trong hệ thống**, và phần lớn chất lượng đến từ mọi thứ *xung quanh* nó — việc lấy đúng code của người dùng, giao diện phản hồi, trí nhớ về điều họ đã vật lộn hôm qua, và những rào chắn ngăn AI cầm tay chỉ việc quá mức.

Vài quyết định cụ thể:

- Chúng tôi quản lý phiên bản prompt như quản lý code, kèm theo eval. Một thay đổi prompt cải thiện một trường hợp nhưng âm thầm làm hỏng năm trường hợp khác là cách phổ biến nhất để một sản phẩm AI thụt lùi.
- Chúng tôi ghi lại mọi tương tác mà người dùng *không đồng ý* với thú cưng. Những lần bất đồng đó là tập dữ liệu giàu tín hiệu nhất chúng tôi có.
- Chúng tôi dùng mô hình mạnh nhất cho những khoảnh khắc cần suy luận sâu, và mô hình nhanh, rẻ hơn cho trò chuyện. Người dùng không phân biệt được mô hình nào trả lời — nhưng họ biết khi nào nó chậm.

## Hãy ship phiên bản còn ngượng ngùng

Phiên bản Codepet mà chúng tôi thấy tự hào sẽ ship trễ sáu tháng. Phiên bản khiến chúng tôi hơi ngượng lại ship đúng hạn và dạy cho chúng tôi điều gì thực sự sai — mà điều đó chưa bao giờ đúng như chúng tôi dự đoán.

Làm sản phẩm một cách công khai buộc phải như vậy. Khi bạn đã nói ra rằng thứ này ship trong tháng này, thì "chỉnh thêm một sprint nữa" không còn miễn phí.

### Những tính năng chúng tôi đã xóa

| Tính năng | Lý do bị khai tử |
| --- | --- |
| Một IDE đầy đủ trong ứng dụng | Người dùng đã có VS Code; chúng tôi đang cạnh tranh với chính mình |
| Mục tiêu hằng ngày theo chuỗi streak | Tạo cảm giác tội lỗi, không tạo động lực — retention *giảm* |
| Tự động sinh câu hỏi trắc nghiệm | Cảm giác như đi học; cả mục đích là để thoát khỏi điều đó |

Mỗi thứ đó đều có vẻ thiết yếu trên lộ trình. Tiếp xúc với người dùng thật khai tử chúng chỉ trong vài ngày.

## Điều chúng tôi muốn nói nếu bạn đang làm sản phẩm với AI

1. **Tìm vòng lặp trước.** Mọi thứ cộng dồn từ một tương tác cốt lõi thực sự tốt. Đừng xây nhà thờ trước khi nhóm được đống lửa.
2. **Đo lường sự bất đồng.** Những khoảnh khắc AI sai — và người dùng biết — đáng giá hơn cả trăm log của kịch bản suôn sẻ.
3. **Đặt tốc độ là điều không thể thương lượng.** Với người dùng, "thông minh" và "nhanh" gần như là cùng một trục.
4. **Viết ra gu thẩm mỹ của bạn.** Khi đội ngũ lớn lên, "đầu ra tốt" không còn hiển nhiên. Chúng tôi duy trì một tài liệu sống mô tả thế nào là một phản hồi tuyệt vời của thú cưng, kèm ví dụ.

Sau một năm, Codepet vẫn là một ứng dụng macOS giúp mọi người xây dựng những thứ thật bằng AI. Nhưng giờ chúng tôi đã biết *câu nào* bên dưới mới là điều quan trọng — và chúng tôi đến được đó bằng cách ship, quan sát, và sẵn sàng xóa bỏ chính những ý tưởng hay của mình.

Nếu bạn đang xây dựng thứ gì đó tương tự, chúng tôi rất muốn trao đổi. Bài tiếp theo trong loạt bài này sẽ đi sâu vào bộ khung eval mà chúng tôi dùng để giữ chất lượng của thú cưng không trôi dạt khi các mô hình bên dưới thay đổi.
