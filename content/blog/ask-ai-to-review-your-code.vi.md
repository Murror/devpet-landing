---
title: "Đừng nhờ AI viết code — hãy để nó review code bạn tự viết"
description: "Cách mà hầu hết người mới dùng AI cũng chính là cách khiến họ giậm chân tại chỗ. Đây là kiểu câu hỏi thực sự xây dựng kỹ năng — và những prompt để bắt đầu."
date: "2026-06-12"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "learning", "code-review", "beginners", "prompt-engineering"]
---

## Cái bẫy của sự tiến bộ giả tạo

Có một cách mà gần như tất cả người mới học code đều tự nhiên dùng AI - không cần ai chỉ dẫn: gặp bài toán, hỏi AI giải, đọc kết quả, gật đầu, tiếp tục. Vòng lặp đó cảm giác rất hiệu quả. Vấn đề được giải. Code trông hợp lý. Kiến thức... hẳn ngấm vào đâu đó rồi.

Ba bốn tuần sau, khi bài toán khó dần lên, người học mới phát hiện ra một sự thật không dễ chịu: họ đã xây được sự tự tin, chứ không phải hiểu biết. Hai thứ đó trông giống nhau từ bên ngoài - cho đến khi chúng không còn như vậy nữa.

## Nhận diện và hồi nhớ - hai thứ hoàn toàn khác nhau

Đọc một đoạn code AI viết và nghĩ "ừ, tôi hiểu rồi" là **nhận diện** — não bộ nhận ra một cấu trúc quen thuộc. Nhưng đó không phải kỹ năng. Kỹ năng là **hồi nhớ** - khả năng tự xây dựng lại cái cấu trúc đó khi không có gợi ý, khi đứng trước một trang trắng và không ai đứng sau lưng.

Lập trình viên giỏi tư duy bằng mẫu hình, không bằng từng dòng code. Khi gặp lỗi, họ đặt giả thuyết, tìm bằng chứng, điều chỉnh. Chính cái quá trình đó - sự vật lộn không thoải mái - mới là thứ rèn kỹ năng. Và giải pháp AI viết sẵn, dù có giải thích kỹ đến đâu, cũng gần như xóa sổ cái sự vật lộn đó đi.

> "Người học copy một lời giải đúng có được một ví dụ. Người học tự viết một lời giải sai rồi hỏi tại sao nó sai thì có được một mô hình tư duy."

Đây là điều chúng tôi nhận ra khi quan sát người dùng Codepet. Những ai chỉ xin AI viết code có thể giải được bài hôm nay - nhưng ngày mai lại hỏi câu y chang. Những ai tự viết thử rồi nhờ nhận xét thì tiến chậm hơn, đôi khi nản hơn - nhưng đang xây thứ gì đó thực sự transfer được sang bài toán mới.

## Thay đổi chỉ một câu hỏi

Thật ra pivot ở đây rất đơn giản. Thay vì:

```
Viết cho tôi một function lọc danh sách user đang active.
```

Thử:

```
Đây là lần thử của tôi để lọc user đang active. Bạn có thể chỉ ra
chỗ sai và giải thích tại sao không?

def get_active(users):
  for user in users:
    if user.active == True:
      return user
```

Câu trả lời của AI thay đổi hoàn toàn. Nó chỉ ra rằng `return` kết thúc function ngay tại user đầu tiên khớp điều kiện - thay vào đó cần dùng list và `append`, hoặc list comprehension - và giải thích *tại sao* logic ban đầu bị sai. Bạn đọc phần đó với đầy đủ bối cảnh: bạn biết mình sai ở đâu. Thông tin mới có chỗ để bám vào.

Từ đây, câu hỏi có thể đi tiếp theo nhiều hướng:

```
Cách nào Pythonic hơn để viết cái này? Giải thích điều gì làm nó
được coi là "idiomatic".
```

```
Có gì trong đoạn code này sẽ làm người có kinh nghiệm hơn ngạc nhiên không?
Tại sao?
```

```
Đoạn code này không xử lý edge case nào? Cho tôi một ví dụ và để tôi
tự thử xử lý trước khi bạn chỉ.
```

Câu cuối đặc biệt hiệu quả - AI trả bài toán lại cho bạn.

## Tại sao "code sai" lại có giá trị

Điều đáng nói là: bạn không cần phải viết code tốt để cách này hoạt động. Thực ra, viết sai một cách tự tin thường còn giáo dục hơn viết đúng một cách thận trọng.

Khi mắc một lỗi thực sự - không phải lỗi đánh máy, mà là một hiểu lầm về mặt khái niệm - phần phản hồi sẽ nhắm thẳng vào khoảng trống cụ thể trong cách bạn đang tư duy. Bạn nhận được phản hồi chính xác, không phải giải thích tổng quát về cách một thứ gì đó vận hành.

Nếu thực sự bí không biết viết gì, hãy bắt đầu bằng pseudocode:

```
Đây là suy nghĩ của tôi theo ngôn ngữ thông thường:
- Duyệt qua danh sách users
- Với mỗi người, kiểm tra xem active có bằng true không
- Trả về tất cả người qua được điều kiện đó

Tôi không biết chuyển cái này thành Python thật như thế nào.
Tôi đang thiếu gì?
```

Đó vẫn là một lần thử có ý nghĩa. AI thấy được phần bạn đã hiểu (logic) và xác định chính xác phần bạn chưa có (cú pháp Python, cách xây dựng list) - thay vì phải giải thích mọi thứ từ đầu như với một trang trắng hoàn toàn.

## Codepet được xây với lựa chọn này trong đầu

Khi xây dựng Codepet, chúng tôi phải đưa ra một quyết định có ý thức về default behavior. Lựa chọn hấp dẫn là xây con đường nhanh nhất đến câu trả lời đúng - cái đó cảm giác tốt trong ngắn hạn. Thay vào đó, chúng tôi thiết kế AI companion để chuyển hướng các prompt "viết cho tôi" sang các lần thử có hướng dẫn.

Nếu bạn nhờ companion trong Codepet giải thẳng một bài toán, nó sẽ nhẹ nhàng đẩy lại: "Lần thử đầu của bạn trông như thế nào, dù chỉ là phác thảo?" Sau đó nó review lần thử đó, chỉ ra đúng phần cần sửa, và đặt câu hỏi tiếp theo thay vì đưa ra câu trả lời hoàn chỉnh.

Đây không phải cố tình làm khó. Đây là để cái sự giúp đỡ thực sự thấm vào theo cách có thể transfer sang bài toán tiếp theo. Cái ma sát trong tư duy không phải rào cản của việc học - **nó chính là việc học**.

Người dùng nói với chúng tôi rằng ban đầu nó frustrating hơn. Họ cũng nói rằng hai tháng sau, họ đang giải những bài toán mà trước đây không tưởng tượng được mình có thể tự làm. Đó chính là cái đánh đổi mà toàn bộ chiến lược sản phẩm xoay quanh.

### Một thói quen cụ thể để thử

Nếu bạn đang học code với AI ngay bây giờ, đây là routine cụ thể để thử trong hai tuần:

- **Luôn tự viết gì đó trước.** Không cần chạy được. Không cần hoàn chỉnh. Chỉ cần là lần thử thật của bạn.
- **Xin review, không xin giải pháp.** "Sai ở đâu vậy?" mạnh hơn nhiều "Viết cái này cho tôi."
- **Sau khi xem phần sửa, đóng chat lại và tự viết lại.** Đây là bước hầu hết mọi người bỏ qua — cũng là bước làm cho ký ức thực sự bám vào.
- **Hỏi thêm một câu nữa.** "Cái gì làm đoạn code này vững hơn?" hoặc "Tôi còn nên biết gì về chủ đề này?" Đào thêm một tầng mỗi buổi.

Chậm hơn là xin thẳng câu trả lời. Nhưng đây cũng là cách duy nhất xây được kỹ năng vẫn còn đó khi không có AI bên cạnh nữa.

## AI tốt nhất là AI biết hỏi ngược lại

Có một nguyên lý rộng hơn ở đây, không chỉ dành cho coding: những tương tác với AI thực sự xây dựng năng lực là những tương tác mà AI hỏi *bạn* - không phải những tương tác mà nó trả lời bạn.

Các model AI hiện tại giỏi giải thích phi thường. Nhưng chúng cũng phi thường trong việc làm bạn *cảm thấy* như mình đã hiểu một thứ mà thực ra chưa hiểu. Cái prompt pattern ở trên - tự viết thử, nhờ review - là một cách đơn giản để biến phần giải thích thành hiểu biết thật sự.

Code là môi trường rất tốt cho điều này. Feedback rõ ràng: code chạy hay không chạy. Khi bạn viết một lần thử sai, bạn đang đặt ra một giả thuyết có thể kiểm chứng. Khi AI review nó, bạn nhận được sự bác bỏ chính xác. Đó là thứ gần nhất mà việc học tự do có thể đạt đến phản hồi khoa học thật sự.

Để hiểu thêm về cách AI có thể đóng vai trò huấn luyện thay vì chỉ trả lời, xem thêm bài viết về [dùng AI như người bạn đồng hành tư duy](/vi/blog/ai-as-thought-partner-not-search-engine). Và nếu bạn tò mò về những pattern hành vi chúng tôi quan sát ở người học thực tế, có thể khám phá thêm ở [chuyên mục Thấu hiểu người dùng](/vi/blog/category/user-insights).

---

**Điều cốt lõi rất đơn giản:** thứ mạnh nhất bạn có thể làm khi học code với AI là cho AI có gì đó để phản hồi. Lần thử bị lỗi của bạn có giá trị hơn một prompt trống rỗng. Review mode mới là nơi kỹ năng thật sự nằm.
