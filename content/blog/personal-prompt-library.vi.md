---
title: "Thư viện prompt cá nhân - đừng để mỗi session AI bắt đầu từ số không"
description: "Một thư viện prompt cá nhân được chăm chút biến mỗi buổi làm việc với AI thành một bước đà — đây là cách xây dựng nó để nó tự lớn theo thời gian."
date: "2026-07-10"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["prompts", "second-brain", "ai-workflow", "productivity", "knowledge-management"]
---

Có một điều kỳ lạ xảy ra mỗi khi bạn mở một cuộc trò chuyện mới với AI - bạn lại trở thành người mới.

Không phải AI quên bạn (dù thật ra nó cũng quên thật), mà là *bạn* đang quên chính mình - quên cái cách hỏi đã hiệu quả tuần trước, quên cái framing giúp bạn thoát khỏi một đoạn code bí trong dự án cũ. Mỗi session lại bắt đầu từ đầu. Mỗi lần lại phải thử sai cho đến khi tìm lại được "chìa khóa" đó.

Giải pháp không phải là một model tốt hơn. Là một thư viện prompt.

## Thư viện prompt là gì - và không phải là gì

Khi nghe "thư viện prompt", nhiều người nghĩ ngay đến những danh sách "1000 ChatGPT prompt tốt nhất" tràn lan trên mạng. Thật ra, đó gần như là thứ vô dụng nhất bạn có thể lưu lại - generic đến mức chẳng áp dụng được vào bất kỳ công việc nào thực sự cụ thể.

**Thư viện prompt cá nhân** là thứ khác hẳn. Đó là bộ sưu tập những prompt mà *bạn* - với công việc riêng của mình, với dự án đang chạy, với những điểm mù đặc trưng của mình - đã kiểm chứng là có tác dụng. Nó gần với một tài sản second brain hơn: giống [decision log](/vi/blog/decision-log-for-builders) hay coding journal - tích lũy giá trị theo thời gian, trở nên sắc bén hơn qua mỗi lần bạn cập nhật.

Điểm mấu chốt là tính cá nhân. Một developer Swift viết macOS app cần lưu những prompt hoàn toàn khác với người mới học Python lần đầu. Không ai có thể xây thư viện này thay bạn, và không có danh sách nào làm sẵn sẽ đủ tốt.

## Ba loại prompt đáng lưu lại

Qua thực tế làm việc với AI đủ nhiều để thấy pattern, có ba loại prompt tỏ ra đáng tin cậy nhất khi được đưa vào thư viện.

### Task starter - mở đúng tông từ đầu

Đây là những prompt giúp bạn vào đúng "trạng thái tư duy" ngay từ đầu, thay vì mất năm phút đầu để "dạy" AI bối cảnh công việc qua nhiều vòng thử.

```
Bạn đang giúp mình refactor một Swift view model. App target macOS 14+.
Ưu tiên readability trước, performance sau. Mình sẽ paste code - hãy chỉ
ra MỘT cải tiến cụ thể và giải thích trade-off trước khi đề xuất thay đổi.
```

Một task starter tốt rất hẹp - nó không cố làm "prompt đa năng". Nó được tối ưu cho đúng một loại việc bạn làm đều đặn, và nhanh để gọi ra vì bạn đã làm sẵn cái công đoạn suy nghĩ rồi.

### Mental model activator - thay kính nhìn

Có những lúc bạn bí không phải vì thiếu thông tin, mà vì đang nhìn vấn đề từ một góc quá quen. Loại prompt này chuyển *cách AI lý luận*, không chỉ chuyển output.

> "Tiếp cận vấn đề này với tư cách người hoài nghi. Hãy lập luận *chống lại* cách implement mình vừa mô tả trước khi đề xuất giải pháp."

> "Mình sắp mô tả một tính năng. Hãy suy nghĩ như một user đã từng bị 'phản bội' bởi những tính năng tương tự. Điều gì khiến họ nghi ngờ?"

Hóa ra, cùng một thông tin - khi đặt trong một framing khác - thường mở ra thứ bạn đang bỏ qua. Không phải lúc nào cũng cần đến, nhưng khi thật sự kẹt, loại prompt này đáng giá hơn nhiều so với việc hỏi lại câu tương tự theo cách khác.

### Review framework - kiểm tra có hệ thống

Đây là những prompt có cấu trúc để đánh giá thành phẩm - code review, chỉnh sửa copy, phân tích quyết định thiết kế. Điểm mạnh không phải là chất lượng output từng lần, mà là tính *nhất quán* theo thời gian.

```
Review đoạn này theo 3 tiêu chí: (1) tính đúng đắn - có làm đúng như mình
nói không? (2) edge case - input nào sẽ làm nó gãy? (3) readability - dòng
nào mà người mới đọc sẽ phải dừng lại? Trả lời dạng danh sách, mỗi vấn đề
một dòng.
```

Suy cho cùng, khi bạn chạy cùng một review framework trên nhiều đoạn code qua nhiều tuần, bạn bắt đầu nhận ra *pattern lỗi của chính mình* - những lớp sai lầm cứ xuất hiện đi xuất hiện lại. Đó mới là chỗ học thật sự xảy ra.

## Cách xây dựng thư viện của bạn

Cơ học rất đơn giản: một file text, một note trong Obsidian, hay một trang Notion - bất cứ thứ gì bạn đã mở hàng ngày - chia thành ba phần theo ba loại trên. Khi một prompt thật sự hiệu quả - cho ra đúng thứ bạn cần ngay lần đầu - bạn copy nó vào.

Kỷ luật ở đây là **không** lưu tất cả mọi thứ. Hầu hết prompt quá gắn với bối cảnh để tái sử dụng. Dấu hiệu tốt để nhận ra: khi bạn thấy mình đang viết lại một prompt gần giống cái bạn đã viết trước đây - đó là tín hiệu rằng pattern này đáng được tổng quát hóa và lưu lại.

Khi lưu, hãy thêm một dòng giải thích dùng trong tình huống nào. Không phải vì bạn sẽ quên prompt - mà vì việc đặt tên use case *buộc* bạn tổng quát hóa nó đúng cách.

```markdown
## Review framework

### Code review - tập trung readability
*Dùng khi: trước khi merge PR, hoặc chia sẻ code với người mới*

Review đoạn này theo 3 tiêu chí: (1) tính đúng đắn...
```

## Kết nối thư viện với vòng học tập của bạn

Thư viện prompt kết nối tự nhiên với những công cụ second brain khác trong workflow của bạn. Khi bạn quyết định về cách tổ chức AI session của mình - "mình sẽ luôn dùng task starter ở đầu mỗi buổi refactor" - hãy log lý do đó vào [decision log](/vi/blog/decision-log-for-builders). Khi một review framework bắt được một lỗi bạn cứ mắc hoài, ghi chú vào coding journal. Thư viện prompt là công cụ *đang hoạt động*; các thứ kia là ký ức giúp công cụ ngày càng sắc bén hơn.

Nếu bạn đã quen với [spaced repetition để giữ kiến thức](/vi/blog/spaced-repetition-and-ai), những prompt tốt nhất của mình còn có thể trở thành flashcard - không phải để học thuộc từng chữ, mà để giữ các *pattern tư duy* ở trạng thái active và dễ gọi ra.

## Dọn thư viện - phần bị bỏ qua nhiều nhất

Một thư viện không bao giờ được pruning sẽ nhanh chóng trở thành rác. Vài tuần một lần, hãy rà qua và tự hỏi thật thà: *cái này mình có thật sự dùng không?* Nếu không, và nếu không thể chỉ ra một use case cụ thể sắp đến, hãy xóa nó đi.

Những thư viện prompt hoạt động tốt nhất thường cũng là những thư viện ngắn nhất - mười đến hai mươi prompt, được đặt tên rõ ràng, đã được rút gọn đến hình thức cốt lõi. Mỗi từ trong một prompt đã lưu đều phải xứng đáng có mặt ở đó. Hai mươi prompt bạn dùng thường xuyên thì hữu ích hơn nhiều so với hai trăm prompt bạn scroll qua mà không chạm vào.

## Lợi tức kép

Điều thú vị là một thư viện prompt được chăm sóc tốt không chỉ tiết kiệm thời gian. Nó thay đổi cách bạn *tiếp cận* mỗi session AI trước khi gõ ký tự đầu tiên.

Thay vì đối mặt với ô input trống và bắt đầu ứng tấu, bạn đến với sự rõ ràng: *đây là bài toán review code, mình sẽ dùng review framework; đây là lúc mình bí về quyết định thiết kế, mình sẽ dùng mental model activator*. Thư viện định hình *ý định* của bạn trước khi session bắt đầu - và sự rõ ràng trước session đó đáng giá hơn bất kỳ prompt đơn lẻ nào trong thư viện.

Bắt đầu nhỏ. Chọn một prompt bạn thấy mình đang viết lại từ trí nhớ thường xuyên nhất. Viết nó ra, tổng quát hóa một chút, lưu lại. Đó là mục đầu tiên. Phần còn lại sẽ tự đến.
