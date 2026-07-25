---
title: "Cách bạn mô tả lỗi cho AI tiết lộ bạn đang ở đâu trên hành trình học code"
description: "Cách một người đặt câu hỏi với AI khi gặp bug nói lên nhiều hơn bất kỳ bài test kỹ năng nào. Đây là ba mẫu Codepet quan sát được - và ý nghĩa của chúng."
date: "2026-07-25"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["debugging", "learning", "ai", "beginners", "user-research", "prompting"]
---

Có một điều chúng tôi nhận ra khá sớm khi theo dõi người dùng Codepet - không phải qua khảo sát, không phải qua bài test kỹ năng - mà qua những gì họ thực sự gõ vào ô prompt khi code của họ gặp vấn đề. Cách một người mô tả bug cho AI, hóa ra, là một trong những tín hiệu đáng tin cậy nhất về trình độ thực sự của họ.

Không phải ngôn ngữ lập trình họ chọn. Không phải số giờ đã code. Mà là cách họ đặt câu hỏi.

Từ dữ liệu đó, ba mẫu hành vi nổi lên đủ rõ ràng để chúng tôi bắt đầu dùng chúng như một hệ thống phân loại nội bộ - không hoàn hảo, nhưng đủ chính xác để hữu ích. Điều thú vị là: hiểu bạn đang ở mẫu nào không chỉ giúp bạn dùng AI tốt hơn, mà còn thay đổi cách bạn tiếp cận việc học.

## Ba mẫu hành vi

### Mẫu một: "Nó không chạy được"

Mẫu phổ biến nhất ở những người mới vài tuần đầu. Khi có gì đó bị vỡ, mô tả về vấn đề đó rộng đến mức gần như không có thông tin.

```
"Code của mình không chạy được. Giúp mình fix với?"
"Trang web không hiển thị gì cả."
"Mình chạy thì bị lỗi gì đó."
```

Đây không phải lười biếng. Đây là một khoảng trống về nhận thức - khi bạn chưa có mental model về cách hệ thống vận hành, bạn không biết thông tin nào quan trọng, bởi bạn chưa biết cần nhìn vào đâu.

Tư duy đang xảy ra lúc này là: "AI biết tất cả mọi thứ, mình chỉ cần mô tả triệu chứng bề mặt và để nó tự xử lý." Tư duy đó không sai về bản chất - đôi khi nó hoạt động. Nhưng nó chậm, vì AI phải hỏi thêm hoặc đoán sai, và vòng lặp kéo dài. Frustration tích lũy dần.

### Mẫu hai: "Dòng này báo lỗi X"

Mẫu thứ hai xuất hiện khi người dùng đã đọc đủ nhiều error message để bắt đầu tin vào chúng. Mô tả vấn đề thu hẹp lại - giờ đây nó được định vị vào một thứ cụ thể.

```
"Dòng 24 báo TypeError: Cannot read property 'map' of undefined."
"Console nói 'fetch is not defined' nhưng mình không hiểu tại sao."
"Function này return undefined khi mình truyền vào string."
```

Đây là một bước nhảy có ý nghĩa. Người dùng đã bắt đầu nhìn nhận error message như thông tin, không phải tiếng ồn. Họ đang dần hiểu rằng hệ thống đang cố kể cho họ một điều gì đó - họ chỉ chưa biết đó là điều gì.

Ở giai đoạn này, các cuộc hội thoại với AI hiệu quả hơn rõ rệt. Vấn đề đã được định phạm vi. AI có thể tập trung đúng vào đoạn code liên quan. Các vòng fix lỗi nhanh hơn nhiều.

### Mẫu ba: "Khi tôi làm X, Y xảy ra - nhưng tôi kỳ vọng Z"

Mẫu thứ ba là lúc việc debug trở thành một hành động cộng tác thật sự. Người dùng có hypothesis. Họ đã quan sát hành vi. Họ hiểu khoảng cách giữa điều họ kỳ vọng và điều thực tế xảy ra.

```
"Khi user click Submit, form phải được clear - nhưng nó submit xong 
lại render lại với dữ liệu cũ. Mình nghĩ state không được reset 
sau khi POST request hoàn thành, nhưng không chắc tại sao."
```

Mẫu này thay đổi toàn bộ cuộc hội thoại với AI. AI không còn phải đoán vấn đề là gì - nó đang làm việc *cùng với* sự hiểu biết của bạn về hệ thống, giúp bạn kiểm tra một hypothesis. Cuộc trò chuyện trở thành ngang hàng thay vì một chiều.

> Sự khác biệt giữa hỏi "tại sao cái này bị vỡ?" và "mình nghĩ nó bị vỡ vì X, bạn có thể giúp mình kiểm tra không?" không chỉ là vấn đề của độ chính xác. Đó là sự khác biệt giữa việc outsource tư duy và dùng AI để khuếch đại tư duy bạn đang tự làm.

Đây là ý nghĩa thật sự của AI như một thought partner - và mẫu ba là nơi mối quan hệ đó thực sự trở nên có thể.

## Tại sao mô tả lỗi tốt là một kỹ năng đáng rèn

Điều đáng nói là: chuyển từ mẫu một sang mẫu ba không chỉ đòi hỏi bạn học thêm nhiều code. Nó đòi hỏi bạn xây dựng một mental model chính xác hơn về điều gì đang xảy ra khi có gì đó bị vỡ.

Khi bạn có thể nói "mình kỳ vọng X, thu được Y, và mình nghĩ Z là lý do" - thật ra bạn đã làm được phần lớn công việc debug rồi. Bạn đã định vị triệu chứng. Bạn đã có hypothesis. Đôi khi bạn tìm ra bug trước khi AI kịp trả lời.

Đây là tác dụng phụ của việc học đặt prompt tốt hơn. Nó không chỉ giúp AI hỗ trợ bạn nhanh hơn - **nó biến bạn thành người debug giỏi hơn.**

Chúng tôi thấy sự chuyển dịch này xảy ra với người dùng Codepet vào khoảng project thứ ba hoặc thứ tư. Không phải vì họ học một khóa riêng về debugging - mà vì họ đã đủ lần va chạm với những prompt mơ hồ để học được, qua kinh nghiệm, rằng sự cụ thể có giá trị.

Nếu bạn muốn tìm hiểu thêm về cách cấu trúc prompt thực sự ảnh hưởng đến output, [Cách cho AI context đúng cách](/vi/blog/how-to-give-ai-context) đi vào các yếu tố cụ thể tạo nên sự khác biệt.

## Mỗi mẫu đòi hỏi gì từ AI

Ba mẫu cũng tạo ra các hành vi hoàn toàn khác nhau từ phía AI - điều này đáng biết nếu bạn đang xây dựng sản phẩm trên LLM, hoặc đơn giản là muốn hiểu cách dùng AI của chính mình.

**Prompt theo mẫu một** mời AI làm tất cả mọi thứ: diễn giải vấn đề, định vị code liên quan, chẩn đoán nguyên nhân, đưa ra fix. Điều này ổn với các bug đơn giản và tốn kém với bug phức tạp. Nó cũng có xu hướng tạo ra những câu trả lời khó đánh giá - vì bạn không tham gia vào quá trình hình thành chúng.

**Prompt theo mẫu hai** cho AI một điểm xuất phát. Các cuộc hội thoại ngắn hơn. Câu trả lời dễ hiểu hơn vì được neo vào thứ người dùng đã tự xác định được.

**Prompt theo mẫu ba** biến AI thành người review tư duy của bạn - kiểm tra logic của bạn, test hypothesis, và đôi khi điều hướng lại khi mental model của bạn sai. Đây là lúc AI hữu ích nhất như một công cụ học tập thật sự.

```
# Mẫu một   → số lượt hội thoại trung bình: ~6-8
# Mẫu hai   → số lượt hội thoại trung bình: ~3-4
# Mẫu ba    → số lượt hội thoại trung bình: ~1-2
```

Tỷ lệ này nhất quán trong những gì chúng tôi quan sát. Người dùng đầu tư suy nghĩ nhiều hơn trước khi hỏi, cuộc trò chuyện giải quyết nhanh hơn - và quan trọng hơn, họ nhớ lại tốt hơn những gì họ tìm ra.

## Làm thế nào để tiến lên mẫu tiếp theo

Câu trả lời thực tế là: bằng cách viết thêm bug. Pattern recognition đến từ việc đã mô tả đủ nhiều thứ bị vỡ để xây dựng trực giác về nơi cần nhìn.

Nhưng bạn có thể tăng tốc. Lần tiếp theo khi có gì đó bị vỡ, trước khi hỏi AI bất cứ điều gì, hãy viết ra:

1. Bạn kỳ vọng điều gì xảy ra
2. Điều gì thực tế xảy ra
3. Giải thích tốt nhất của bạn cho lý do tại sao

Ngay cả khi đoán sai, bài tập này buộc bạn phải hình thành hypothesis - và đó chính là kỹ năng cốt lõi mà mẫu ba đòi hỏi. Bắt đầu từ đó, rồi mới mang đến cho AI. Cuộc hội thoại sẽ ngắn hơn, fix sẽ rõ ràng hơn, và bạn sẽ nhớ lại tốt hơn vì bạn là một phần của quá trình tìm ra nó.

Suy cho cùng, khoảng cách giữa "nó không chạy được" và "khi tôi làm X thì Y xảy ra" không phải là khoảng cách kiến thức - mà là khoảng cách chú ý. Một khi bạn biết mình cần quan sát điều gì, bạn không còn cần AI debug thay bạn nữa. Bạn chỉ cần AI để đi nhanh hơn trên con đường bạn đang tự đi.

Mục [Thấu hiểu người dùng](/vi/blog/category/user-insights) có thêm về các mẫu hành vi chúng tôi quan sát được khi mọi người build và học với AI. Và nếu bạn muốn đưa AI vào vòng lặp review code của mình, [Nhờ AI review code của bạn](/vi/blog/ask-ai-to-review-your-code) đề cập đến chính dynamics đó từ một góc độ khác.
