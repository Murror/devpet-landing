---
title: "Tại sao người mới học code đều dừng lại ở tuần thứ ba"
description: "Codepet quan sát hàng trăm người mới học build phần mềm với AI - và nhận ra rằng ai ship được sản phẩm đều có một thói quen nhỏ mà phần còn lại bỏ qua."
date: "2026-06-14"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["learning", "coding", "ai", "beginners", "habits"]
---

Tuần thứ nhất, mọi thứ đều có vẻ kỳ diệu. Bạn đặt câu hỏi, AI trả lời, code chạy được - và có một cái cảm giác gì đó rất lạ, kiểu "hoá ra mình cũng có thể làm được điều này". Cái cảm giác đó đủ để giữ bạn ngồi trước màn hình đến tận khuya.

Tuần thứ ba thì khác. Sự hào hứng ban đầu đã nhạt dần. Code vẫn được AI sinh ra, nhưng bạn không còn thực sự hiểu nó đang làm gì nữa. Một lỗi xuất hiện, bạn hỏi AI, AI sửa - rồi lại có lỗi khác. Project bắt đầu có cảm giác như một mê cung mà chính bạn đã xây ra nhưng không có bản đồ.

Tại Codepet, chúng tôi đã quan sát hàng trăm người đi qua đúng khoảnh khắc đó. Và điều rõ nhất mà chúng tôi thấy không phải là ai học nhanh hơn hay thông minh hơn - mà là ai đã làm gì ngay khi chạm phải "bức tường".

## Bức tường xuất hiện vì một lý do rất cụ thể

Vấn đề là bức tường này không hề ngẫu nhiên - nó gần như được lập trình sẵn để xảy ra. Nó xuất hiện đúng vào thời điểm mà độ phức tạp của project bắt đầu vượt quá mô hình trong đầu bạn về cách nó hoạt động.

Ban đầu, mọi thứ rất tuyến tính. Bạn bảo AI "thêm cái nút lưu form", AI generate ra code, bạn dán vào, và nó chạy. Đơn giản và sạch sẽ.

Nhưng phần mềm không phải là một danh sách các tính năng độc lập - nó là một hệ thống của những mảnh ghép liên kết với nhau. Đến tuần thứ ba, bạn muốn thêm thứ gì đó mới, AI bảo rằng nó cần thay đổi thứ bạn đã viết từ tuần trước, mà cái đó lại ảnh hưởng đến thứ từ tuần đầu tiên. Bạn không có một bức tranh rõ về cách những mảnh ghép đó khớp với nhau. AI còn giữ được toàn bộ context window - còn bạn thì không.

> Bức tường không phải là bằng chứng bạn không hợp với lập trình. Nó là dấu hiệu bạn đã build đủ nhiều để mọi thứ trở nên thật sự phức tạp.

Đây không phải thất bại - đây là một cột mốc. Nhưng nếu không có nước đi đúng ngay lúc này, hầu hết mọi người đều dừng lại.

## Điều phân biệt người ship và người bỏ cuộc

Pattern nhất quán nhất mà chúng tôi quan sát được - từ những dữ liệu trong [mục thấu hiểu người dùng](/vi/blog/category/user-insights) mà chúng tôi thu thập - không liên quan đến số giờ học hay nguồn tài liệu nào họ dùng. Nó nằm ở một hành vi duy nhất: **bạn làm gì khi AI đưa cho bạn đoạn code mà bạn không thực sự hiểu?**

**Những người bỏ cuộc** dán code vào, kiểm tra xem có chạy không, rồi tiếp tục. Khi nó vỡ sau đó, họ không có mô hình tinh thần để debug - nên lại hỏi AI, nhận thêm code họ cũng không hiểu. Cuối cùng, project trở thành một hộp đen mà họ sợ chạm vào, vì họ không còn biết nó hoạt động ra sao nữa.

**Những người ship được** dừng lại trước khi dán. Họ hỏi AI giải thích đoạn code đó làm gì. Hoặc họ tự viết ra những gì *họ nghĩ* code đó làm, rồi nhờ AI chỉnh lại. Họ xây bản đồ trong lúc đi.

Vấn đề là chỉ có thế thôi. Một nhóm đang ở trong vòng lặp với AI như một cái máy generate code. Nhóm còn lại đang dùng AI để xây dựng hiểu biết thực sự.

### Thói quen giải thích

Nếu có một hành vi mà chúng tôi muốn mọi người mới bắt đầu build hình thành được, đó là: **đừng bao giờ dán code mà bạn không thể tự giải thích bằng một câu đơn giản**.

Không cần giải thích hoàn hảo. Không cần từ kỹ thuật đúng. Chỉ cần: "phần này lắng nghe khi người dùng bấm nút" hay "phần này lưu danh sách task ở nơi cả app có thể truy cập được".

Nếu bạn không làm được điều đó, bạn chưa thực sự học nó - dù code có chạy hoàn hảo đến đâu. Lần sau khi cần chỉnh sửa, hoặc khi cái gì đó gần đó vỡ, bạn sẽ phải bắt đầu từ con số không.

Vài prompt có thể biến AI từ cái máy tạo code thành người thầy kiên nhẫn:

```
"Explain what you just wrote like I've never seen JavaScript before."
"What would break if I removed this section?"
"Add a plain-English comment above each block explaining what it does."
```

Đây không phải những bước làm bạn chậm lại. Đây là khoản đầu tư thực sự để một tháng sau bạn có thể tiến nhanh hơn nhiều.

## Cái bẫy của sự tự tin

Đáng nói là còn có một sai lầm ngược lại - đi quá nhanh khi mọi thứ đang chạy tốt.

Trong những tuần đầu, có những giai đoạn mọi thứ cứ thế trơn tru - prompt hoạt động, tính năng ra đời, project bắt đầu có hình hài thật sự. Rất dễ để muốn giữ momentum đó bằng cách đẩy tiếp mà không dừng: thêm tính năng, thêm màn hình, thêm API call.

Nhưng sự nhanh chóng trong giai đoạn "đang chạy tốt" thường có nghĩa là bạn đang vay nợ từ giai đoạn "bức tường" sau đó. Mỗi đoạn code bạn thêm vào mà không hiểu là một lớp phức tạp sẽ cần được giải quyết sau này - dưới áp lực, khi có thứ gì đó vỡ vào lúc tệ nhất.

Những người ship đều đặn thường đi với một nhịp độ ổn định, thậm chí có vẻ nhàm. Khi thứ gì đó hoạt động, họ dành chút thời gian để chắc rằng họ hiểu tại sao. Khi thứ gì đó vỡ, họ không chỉ vá triệu chứng - họ hỏi lý do gốc rễ là gì. Đây chính xác là điều chúng tôi đã thấy trong [những gì người mới học dạy chúng tôi về code với AI](/vi/blog/what-beginners-taught-us-learning-to-code-with-ai): những học viên vượt qua được giai đoạn đầu hầu như đều là những người đã chủ động chọn đi chậm hơn.

## Cách xây lại bản đồ

Nếu bạn đang ở bức tường - nhìn vào codebase như thể ai đó xa lạ đã viết nó - bản năng thường là muốn bắt đầu lại từ đầu. Đôi khi điều đó đúng. Nhưng phần lớn, thứ bạn cần là một phiên "vẽ bản đồ".

Đây là cách thực hiện:

1. **Đọc file chính từ đầu đến cuối** - không phải để hiểu từng dòng, mà để nhận ra phần nào quen thuộc và phần nào còn mờ với bạn.
2. **Nhờ AI dẫn bạn tham quan**: *"Đây là codebase của tôi. Giải thích mỗi phần lớn làm gì bằng ngôn ngữ đơn giản, như thể tôi chưa từng nhìn vào nó."*
3. **Tự viết mô tả 10 câu về app của bạn** mà không nhìn vào code: nó làm gì, các file chính là gì, điều gì xảy ra từ lúc người dùng thao tác đến khi có kết quả. Những khoảng trống trong mô tả đó chính xác là chỗ hiểu biết của bạn đang thiếu.
4. **Chọn một khoảng trống và đào sâu** - từng phần một, không phải tất cả cùng lúc.

Cách này chậm hơn việc build thêm tính năng. Nhưng nó nhanh hơn rất nhiều so với việc bắt đầu lại lần thứ ba.

## Cái nhìn dài hơn

Mỗi project bạn hoàn thành để lại cho bạn một mô hình tốt hơn một chút về cách hệ thống phần mềm vận hành. Bức tường đầu tiên rất khó - nhưng mỗi người vượt qua được nó đều thấy cái tiếp theo ngắn hơn, ít đáng sợ hơn.

Suy cho cùng, những người ship sản phẩm hầu như đều là những người đã chọn **hiểu quan trọng hơn tốc độ** - không phải vì đi chậm là hay ho gì, mà vì hiểu chính là thứ cho phép bạn tăng tốc thực sự sau này mà không bị sụp đổ giữa chừng.

Nếu bạn đang ở bức tường lúc này: bạn đang gần hơn bạn nghĩ. Nước đi tốt nhất không phải là cố đâm đầu vào hay bỏ cuộc - mà là dừng lại và xây bản đồ.
