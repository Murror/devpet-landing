---
title: "Dùng AI để biến feedback người dùng thành quyết định sản phẩm"
description: "Hầu hết feedback đang nằm im trong một folder bị lãng quên. Đây là workflow thực tế để dùng AI phân tích phỏng vấn, review, và hội thoại thành tín hiệu sản phẩm có thể hành động được."
date: "2026-06-29"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["user-research", "product", "ai", "feedback", "user-insights"]
---

Có một loại cảm giác tội lỗi rất đặc trưng khi nhìn vào đống feedback người dùng - cái folder trên Drive mang tên đầy tham vọng như "Voice of Customer Q1" nhưng lần cuối bạn mở nó là tháng Hai. Bạn biết trong đó có tín hiệu thật. Chỉ là chưa có lúc nào đủ rảnh để đọc hết, nên nó cứ nằm im. Rồi folder to dần đến mức chỉ cần mở ra thôi đã thấy choáng ngợp, và bạn thôi không mở nữa.

Đó là "nghĩa địa feedback." Hầu hết sản phẩm đều có một cái. Và hầu hết thời gian, những pattern bạn cần để đưa ra quyết định tốt hơn đang nằm chôn vùi trong đó - ba phần tư dưới cùng của một tài liệu chưa ai mở trong sáu tuần qua.

AI không giải quyết được vấn đề cần nói chuyện với người dùng. Nó không thay thế được phán đoán của bạn khi quyết định build gì. Nhưng nó xử lý được phần đang khiến feedback trở nên vô dụng thật sự: bài toán throughput thô. Khi bạn có thể xử lý năm mươi feedback trong thời gian trước đây chỉ đọc được mười cái - nghĩa địa đó ngừng phình to.

## Những cái bẫy nhận thức mà ai cũng mắc

Vấn đề với feedback người dùng không phải là số lượng - mà là cấu trúc. Hay chính xác hơn là sự thiếu cấu trúc hoàn toàn của nó.

Một buổi phỏng vấn cho bạn bốn mươi phút hội thoại lộn xộn, phi tuyến tính. Một review trên App Store chỉ có hai câu - không yêu say đắm thì ghét cay ghét đắng, không có điểm giữa. Một support ticket mô tả triệu chứng nhưng không nói rõ vấn đề thật. Một thread trên Discord thì có ba cuộc trò chuyện song song và mười hai tin nhắn chỉ viết "cái này." Không cái nào trong số đó tự nhiên dẫn đến quyết định sản phẩm.

Còn có những cái bẫy nhận thức làm méo mó feedback ngay cả khi bạn thật sự đọc nó. Thứ bạn nghe gần nhất sẽ đọng lại lâu nhất. Người dùng to mồm nhất thường bị xem là tiêu biểu cho tất cả. Một lời phàn nàn ấn tượng có sức nặng hơn năm lần khen nhẹ nhàng mà không để lại dấu vết. Và nếu có hai người cùng dự một buổi phỏng vấn - họ sẽ nhớ hai bộ điểm nổi bật hoàn toàn khác nhau.

AI không khắc phục được những thiên kiến này. Nhưng nó tạo ra một quy trình nhất quán và có thể lặp lại để rút ra pattern - một quy trình không bị ảnh hưởng bởi thứ bạn tình cờ đọc hôm qua.

## Workflow ba bước thực sự có ích

### Bước 1: Chuẩn bị nguyên liệu

Một phân tích AI chỉ tốt bằng dữ liệu đưa vào. Trước khi viết bất kỳ prompt nào, hãy thu thập và làm sạch nguồn tư liệu.

- **Phỏng vấn:** Export transcript hoặc paste notes theo định dạng nhất quán. Không cần dọn quá kỹ, nhưng hãy bỏ những đoạn filler không có nội dung thật.
- **Review và ticket:** Copy-paste vào một tài liệu duy nhất, nhóm theo nguồn. Thêm tiêu đề để AI biết mỗi khối text là gì.
- **Mỗi phiên tập trung vào một chủ đề.** Đừng yêu cầu AI tổng hợp ba tháng feedback hỗn hợp trong một lần. Chia theo khoảng thời gian, theo tính năng, hoặc theo nhóm người dùng - input tập trung cho ra output tập trung.

Một quy ước hữu ích: đặt tag ngắn trước mỗi đoạn feedback - `[phỏng vấn / power user]`, `[review / 1 sao]`, `[support / onboarding]`. Điều này giúp bạn yêu cầu AI lọc hoặc ưu tiên theo nguồn khi cần.

### Bước 2: Phân nhóm và tìm theme

Đây là bước tạo ra đòn bẩy thật sự. Thay vì hỏi AI nên build gì - câu hỏi mà nó không thể trả lời một cách đáng tin cậy - hãy hỏi nó tìm pattern trong những gì người dùng đang nói.

Cấu trúc prompt hoạt động tốt:

```
Bạn đang phân tích feedback người dùng cho [tên sản phẩm] — [một câu mô tả ngắn].

Đây là một batch raw feedback từ [nguồn, khoảng thời gian]:

[dán feedback đã chuẩn bị]

Nhiệm vụ của bạn:
1. Xác định 4–6 theme phổ biến nhất. Với mỗi theme, đặt tên ngắn và viết một câu mô tả người dùng thật sự đang nói gì.
2. Với mỗi theme, trích dẫn 2–3 ví dụ nguyên văn từ feedback.
3. Ghi chú những theme có cảm xúc mạnh (tích cực hoặc tiêu cực rõ rệt).
4. Liệt kê feedback không fit vào theme nào — những thứ có vẻ one-off hoặc mâu thuẫn.
```

Chưa hỏi về khuyến nghị. Lấy theme trước. Bạn đang dùng model như một research assistant đọc nhanh hơn bạn - không phải người ra quyết định thay bạn.

### Bước 3: Kiểm tra lại các theme

Sau lần chạy đầu, hãy chạy prompt thứ hai để thách thức kết quả:

```
Nhìn vào những theme này, cái nào có thể bị thổi phồng bởi một số ít người dùng ồn ào? Cái nào có thể được giải thích bởi một tính năng còn thiếu hoặc một edge case? Có theme nào mâu thuẫn nhau không?
```

Bước này ít được dùng nhưng rất có giá trị - nó buộc AI tự kiểm tra bản tóm tắt của mình, bắt những trường hợp hai lời phàn nàn nghe giống nhau nhưng thật ra về những thứ hoàn toàn khác nhau.

## Điều AI không làm được

Nói thẳng ra: AI không cho bạn biết người dùng thật sự cần gì.

Nhu cầu khác với sở thích bày tỏ. Người dùng nói "mình muốn có dark mode" có thể đang nói rằng mắt họ mỏi sau hai tiếng dùng app - đó là vấn đề về thời lượng phiên làm việc, không phải màu sắc giao diện. AI đọc feedback đó sẽ phân loại vào "UI preferences" - kỹ thuật mà đúng, nhưng lại bỏ qua cái cốt lõi.

Model cũng không thể nói cho bạn biết nên tin người dùng nào. Nếu năm power user tích cực nhất đều muốn tính năng X còn bốn mươi người dùng thông thường muốn tính năng Y - đó là câu hỏi chiến lược sản phẩm, không giải quyết được bằng cách đếm mentions.

Thứ AI làm được là nén thời gian đọc và tạo ra một bản đồ có thể đọc được của địa hình. Việc điều hướng vẫn là của bạn.

> Mục tiêu không phải outsource tư duy sản phẩm cho AI - mà là ngừng để feedback chết trong một folder chỉ vì đọc nó cảm thấy quá nhiều việc.

Nếu muốn đi xa hơn - dùng AI không chỉ để tóm tắt mà để thật sự suy nghĩ về ý nghĩa đằng sau feedback - cách bạn đặt câu hỏi cho AI quan trọng không kém gì context bạn cung cấp. Chúng tôi đã khám phá điều đó trong bài [Dùng AI như người đồng hành tư duy, không phải công cụ tìm kiếm](/vi/blog/ai-as-thought-partner-not-search-engine).

## Từ theme đến quyết định

Sau hai vòng tổng hợp, bạn thường có bốn đến tám theme được đặt tên - mỗi theme kèm ví dụ thật và cảm nhận thô về tần suất lẫn mức độ. Câu hỏi tiếp theo: điều này có nghĩa gì với thứ chúng ta build tiếp theo?

Một cách phân loại đơn giản:

- **Tần suất cao + frustration cao** → có khả năng đang chặn giá trị cốt lõi. Cần nhìn kỹ ngay.
- **Tần suất cao + frustration thấp** → người dùng muốn nhưng sống được không có. Ứng viên tốt cho quick win tạo thiện cảm.
- **Tần suất thấp + frustration cao** → có thể là bug, edge case, hoặc vấn đề của một phân khúc cụ thể. Điều tra trước khi hành động.
- **Tần suất thấp + frustration thấp** → ghi chú lại và xem xét khi có thêm dữ liệu.

Nếu duy trì quy trình này đều đặn, pattern theo thời gian cũng dần hiện ra. Một theme cứ xuất hiện đi xuất hiện lại là tín hiệu cần thay đổi gì đó căn bản. Một theme biến mất sau một bản cập nhật là cách bạn biết thay đổi đó thực sự có tác dụng - không phải chỉ đoán.

Về những gì chúng tôi tự học khi đi qua quá trình này, bài [Điều người mới học code dạy chúng tôi về việc học cùng AI](/vi/blog/what-beginners-taught-us-learning-to-code-with-ai) là nơi chúng tôi mổ xẻ một pattern cứ xuất hiện mãi - và tại sao nó bất ngờ đến vậy.

## Thói quen 30 phút mỗi tuần

"Nghĩa địa feedback" phình to vì xử lý feedback không có deadline và không có output rõ ràng. Hãy giải quyết điều đó bằng một ritual.

Mỗi thứ Sáu, hoặc bất cứ nhịp nào phù hợp với bạn: dành 30 phút thu thập toàn bộ feedback đến trong tuần - review, support thread, notes phỏng vấn, bất kỳ DM nào có tín hiệu sản phẩm - chạy qua hai bước prompt ở trên, rồi viết một đoạn văn về những gì bạn học được. Đúng một đoạn thôi.

Không cần phải hành động ngay. Chỉ cần đọc, rút tín hiệu, và chia sẻ với người đang đưa ra quyết định sản phẩm trong tuần đó. Theo thời gian, đoạn văn đó trở thành hệ thống cảnh báo sớm cho những thứ bạn sẽ không nhận ra cho đến khi chúng đủ ồn ào để không thể bỏ qua nữa.

Feedback vẫn luôn ở đó. Bây giờ bạn thật sự đang dùng nó.
