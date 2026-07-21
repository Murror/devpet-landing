---
title: "Cách user-test một tính năng AI trước khi ra mắt"
description: "Test một tính năng AI không giống test một cái nút bấm. Đây là cách thực chiến để biết liệu LLM feature của bạn có thực sự hoạt động với người dùng thật."
date: "2026-07-21"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["user testing", "ai product design", "ux research", "llm", "user insights", "product engineering"]
---

Có một loại im lặng trong buổi user test mà bạn sẽ học cách nhận ra - và sợ. Người tham gia đang nhìn vào tính năng AI của bạn, output trả về không sai, nhưng họ chỉ... ngồi đó. Không ấn tượng, không bối rối - chỉ đang chờ thứ gì đó có nghĩa hơn xuất hiện. Họ không nhớ mình đã hỏi gì. Họ không hiểu vì sao nhận được câu trả lời đó. Và thầm lặng, họ đã quyết định sẽ bỏ qua cái panel này lần sau khi mở app.

Đó chính xác là thứ mà việc test tính năng AI cần phải bắt được - không phải là model có trả về đúng token hay không. Eval lo chuyện đó rồi. User testing là để trả lời một câu hỏi khó hơn nhiều: liệu tính năng này có khớp với mô hình tư duy của người cần dùng nó không?

## Vì sao test tính năng AI khác hoàn toàn

Usability testing thông thường có một phép đo khá rõ ràng: user hoàn thành task hay không. Với tính năng AI, chuyện phức tạp hơn nhiều. Một output hoàn toàn đúng về mặt kỹ thuật vẫn có thể khiến người dùng thất bại. Ngược lại - một câu trả lời hơi lệch, nhưng xuất hiện đúng lúc và được đóng gói đúng cách, lại có thể cảm giác khai sáng.

Điều đó có nghĩa là AI feature đặc biệt "chống chịu" tốt với kiểu đo lường task-completion-rate thông thường. Thứ bạn thực sự cần test là thứ tinh tế hơn nhiều: **liệu người dùng có hình thành được một mô hình tư duy chính xác về cái AI này có thể và không thể làm không**.

Người dùng tưởng AI coding assistant của bạn có thể đọc ý nghĩ họ - sẽ thất vọng ngay khi nó không hiểu context. Người dùng hiểu rằng cần chỉ dẫn rõ ràng - sẽ học cách prompt tốt hơn và gắn bó lâu dài. Sự khác biệt không nằm ở model. Nó nằm ở kỳ vọng ban đầu của người dùng.

## Tuyển người có đúng vấn đề, không phải người mê AI

Sai lầm phổ biến nhất khi tuyển người cho buổi test là chọn những người hứng thú với AI. Họ sẽ tha thứ mọi thứ, thử mọi thứ, và nói với bạn rằng tính năng thật tuyệt vời. Nhưng thứ bạn thực sự cần là những người đang gặp phải đúng vấn đề mà tính năng bạn đang giải quyết - và họ không quan tâm lắm đến việc nó được giải quyết bằng cách nào.

Nếu đang test AI writing assistant tích hợp trong một project management tool, hãy tuyển những người đang vật lộn với việc viết status update - không phải AI enthusiast đang dùng năm tool LLM khác nhau mỗi ngày.

Ba đến năm người là đủ để tìm ra những điểm gãy lớn. Mục tiêu không phải là có ý nghĩa thống kê - mà là tìm ra những góc cạnh sắc nhọn mà hiểu biết của người dùng bị vỡ ra.

## Ba câu hỏi cần trả lời trước khi test

Trước khi mở bất kỳ buổi nào, hãy viết ra ba điều bạn cần biết nhất:

1. **Người dùng bắt đầu giả định AI đang làm gì đó mà nó không làm - ở điểm nào?** (Điểm tự tin thái quá.)
2. **Khi output sai, họ có nhận ra không - hay chấp nhận nó, hay phó thác hoàn toàn vào nó?** (Điểm hiệu chỉnh niềm tin.)
3. **Sau năm phút dùng tính năng, họ có thể giải thích cho người khác nó làm gì không?** (Điểm mô hình tư duy.)

Ba câu hỏi này buộc bạn nhìn tính năng từ bên ngoài. Chúng cũng cho bạn thứ để lắng nghe trong buổi test, thay vì chỉ quan sát tự do không có định hướng.

## Chạy buổi test: giao thức think-aloud

Đề nghị người tham gia nói to suy nghĩ của họ khi dùng tính năng. Nghe đơn giản nhưng hầu hết mọi người cần một câu mồi: "Khi bạn dùng, hãy nói cho tôi biết bạn đang kỳ vọng điều gì xảy ra, bạn đang chú ý thấy gì, và bất cứ thứ gì khiến bạn bất ngờ."

Giá trị nằm ở khoảnh khắc bất ngờ. Khi ai đó nói "ồ, tôi tưởng nó sẽ —" rồi bỏ lửng - đó chính là khoảng cách giữa mô hình tư duy của bạn và của họ về tính năng. Hãy ghi lại câu đó chính xác từng chữ.

Đừng giải cứu họ khi họ bí. Bản năng của bạn là giải thích cách tính năng hoạt động - hãy dẹp nó đi. Những gì bạn thấy khi họ vật lộn chính là sản phẩm thật sự. Mỗi lần can thiệp là một lần reset lại bài test.

> "Điều tốt nhất một facilitator có thể làm là trở nên hữu ích một cách nhàm chán - hỏi 'bạn đang nghĩ gì lúc này?' rồi im lặng."

Mẹo dành cho coding feature: nếu đang test AI coding assistant hoặc AI code review, hãy đề nghị người tham gia tải đúng project thật của họ - không phải demo task được dàn dựng. Khoảng cách giữa bài toán đồ chơi và context thực tế chính là nơi AI feature thất bại nhiều nhất.

## Thứ cần tìm - ngoài việc "nó có hoạt động không?"

Hầu hết các team tổng kết bằng cách hỏi: người dùng có hoàn thành task không? Điều đó cần thiết, nhưng chưa đủ. Hãy chú ý thêm ba tín hiệu phụ:

**Niềm tin theo kiểu proxy.** Sau khi nhận output của AI, người dùng có đi kiểm chứng lại không - hay dùng luôn? Chấp nhận mù quáng là tín hiệu rủi ro - không phải vì output sai, mà vì người dùng chưa hình thành được ngưỡng tin tưởng nào. Điều đó khiến họ dễ vỡ khi model trật lần sau.

**Từ ngữ bị lệch.** Chú ý những từ người tham gia dùng để mô tả tính năng sau khi dùng thử vài phút. Nếu họ nói "nó tìm trên mạng" nhưng thực ra không phải, hay "nó nhớ từ lần trước" nhưng không có memory - bạn đang có vấn đề mô hình tư duy, và nó sẽ gây ra rất nhiều thất vọng sau này.

**Pattern re-prompt.** Khi nhận output không như ý, người dùng có thử lại không? Và họ thay đổi input như thế nào? Người dùng không thay đổi gì mà kỳ vọng kết quả khác là dấu hiệu hiểu sai căn bản cách LLM hoạt động. Người dùng viết lại rõ ràng hơn với nhiều context hơn - đang học, và đó là tín hiệu tốt.

### Sự lệch lạc trong niềm tin

Đây là pattern đáng chú ý nhất: người dùng *tự tin quá mức* vào output của AI so với những gì output đó thực sự bảo đảm. Nó xuất hiện khi người ta bỏ qua bước xác minh cho nội dung do AI tạo ra - nội dung mà trong điều kiện bình thường họ sẽ kiểm tra lại, như code họ sẽ chạy thử, sự kiện họ sẽ tra cứu, hay gợi ý họ sẽ cân nhắc kỹ.

Trong các buổi test nội bộ tại Codepet, chúng tôi thấy điều này thường xuyên nhất với explanation feature: khi AI giải thích *tại sao* đoạn code hoạt động, người dùng có xu hướng tin vào lý giải đó mà không kiểm tra lại tư duy. Output nghe hợp lý, được trình bày một cách tự tin, và người dùng chỉ... chấp nhận. Đây là vấn đề UX - không phải vấn đề model.

### Vấn đề sai-nhưng-đúng

Chiều ngược lại cũng tồn tại: output về mặt kỹ thuật không chính xác nhưng người dùng vẫn diễn giải và hành động đúng - vì kiến thức domain của họ bù đắp cho chỗ thiếu hụt. Trông như chiến thắng trong test, nhưng thật ra rất mong manh. Output đó sẽ thất bại hoàn toàn với người dùng ít kinh nghiệm hơn.

Khi bạn thấy người tham gia tự bổ sung những điều bị bỏ sót trong đầu, hãy ghi lại và hỏi: "Điều gì khiến bạn thấy rõ ở đây?" Câu trả lời thường để lộ mảnh context mà người dùng mới hơn sẽ không có.

## Sau buổi test: tổ chức dữ liệu lộn xộn

User testing với AI feature tạo ra dữ liệu lộn xộn, không nhị phân. Một cách tốt để tổng kết: sắp xếp quan sát vào ba nhóm.

- **Khoảng cách kỳ vọng** - những thứ người dùng cho là AI sẽ làm nhưng thực ra không làm
- **Thất bại niềm tin** - khoảnh khắc người dùng từ chối output đúng hoặc chấp nhận output sai
- **Lệch lạc từ ngữ** - những từ hoặc khái niệm người dùng dùng không khớp với cách tính năng thực sự hoạt động

Cách phân loại này buộc bạn suy nghĩ về feedback như là vấn đề mô hình tư duy - không chỉ là bug UI. Một button khó tìm là vấn đề layout. Một người dùng nghĩ AI "phân tích toàn bộ codebase" của họ trong khi nó chỉ đọc file hiện tại - đó là vấn đề kỳ vọng mà không có lượng polish UI nào có thể sửa được.

## Chỉ số quan trọng nhất

Sau tất cả các buổi, hãy tự hỏi: người dùng có thể giải thích tính năng chính xác cho người chưa dùng không? Không phải chính xác kiểu pitch bán hàng - mà chính xác ở cấp độ cơ chế. Họ có hiểu AI đang nhìn thấy gì, tạo ra gì, và đại khái khi nào nó hoạt động tốt so với khi nào dễ trật không?

Nếu hầu hết người tham gia làm được điều này - tính năng đã sẵn sàng ship. Nếu không - vấn đề không phải model, mà là design. Và không lượng fine-tuning nào sửa được điều đó.

---

Để biết thêm về thiết kế AI feature mà người dùng tin tưởng, xem [Cách thiết kế AI feature để người dùng tin](/vi/blog/how-to-design-ai-features-users-trust) và [Tại sao người dùng ngừng dùng AI feature sau tuần đầu](/vi/blog/why-ai-feature-adoption-stalls). Nếu bạn đang build product và muốn đọc thêm về những gì chúng tôi học được từ người dùng thật, danh mục [User Insights](/vi/blog/category/user-insights) là điểm bắt đầu.
