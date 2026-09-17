---
title: "Cách viết system prompt đứng vững khi ra sản phẩm thật"
description: "Hầu hết system prompt chỉ đủ cho demo. Đây là khung tư duy để viết một prompt thực sự ổn định khi người dùng thật - và edge case thật - bắt đầu kéo đến."
date: "2026-06-16"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["system-prompt", "prompt-engineering", "llm", "ai-products", "ship", "production"]
---

Có một khoảnh khắc mà hầu hết người build AI feature đều trải qua - thường vào sáng thứ Hai, sau một cuối tuần ra mắt suôn sẻ đến bất ngờ. Model bắt đầu trả lời những thứ không ai muốn, người dùng báo lỗi theo cách chưa từng nghĩ tới, và hóa ra thủ phạm không phải là bug nào trong code - mà là cái system prompt viết vội trong buổi tối trước khi demo.

Thật ra đây không phải rủi ro. Đây là một cấu trúc lỗi có thể dự đoán được. Và quan trọng hơn, có thể sửa.

## Tại sao system prompt thường vỡ khi ra thực tế?

Phản ứng đầu tiên khi AI feature hoạt động sai thường là đổ lỗi cho model - đổi model, logic là vậy, rồi mọi thứ sẽ khá hơn. Nhưng vấn đề là, hầu hết các lỗi hành vi không đến từ model. Chúng đến từ prompt.

Có ba nguyên nhân phổ biến nhất:

- **Prompt chỉ mô tả kịch bản lý tưởng.** Bạn viết cho trường hợp người dùng hỏi đúng câu vào đúng lúc. Còn khi họ hỏi lạc đề, thiếu thông tin, hoặc muốn thứ feature không thiết kế để làm - model phải tự điền vào chỗ trống. Và cách nó điền thường không phải cách bạn muốn.
- **Những ràng buộc quan trọng không được nói ra.** Bạn biết feature này không được làm gì. Nhưng nếu không viết rõ trong prompt, model không biết. Ranh giới nào không được vẽ trước thì sẽ bị tự vẽ theo cách không ai kiểm soát.
- **Prompt được viết bằng ngôn ngữ demo, không phải ngôn ngữ người dùng.** Test case của bạn thường là những câu hỏi được đặt cẩn thận. Người dùng thật viết tắt, nói thiếu chủ ngữ, đặt câu sai ngữ pháp. Prompt được tinh chỉnh cho câu hỏi đẹp sẽ dễ lạc lối khi gặp câu hỏi thật.

## Bốn thành phần của một system prompt đủ vững

Một prompt tốt không nhất thiết phải dài. Nó cần phải *đầy đủ*. Bốn phần dưới đây xử lý được phần lớn mọi tình huống:

### 1. Role - model là ai trong feature này?

Đây là câu đầu tiên trong prompt, và nó quan trọng hơn bạn nghĩ. Không phải "bạn là một trợ lý hữu ích" - mà phải đủ cụ thể để model có thể tự suy ra khi gặp tình huống bạn chưa viết sẵn.

```
Bạn là coding coach trong app Codepet.
Nhiệm vụ là giúp người học hiểu *tại sao* code của họ
hoạt động như vậy - không phải chỉ sửa lại cho đúng.
```

Khi model gặp edge case nằm ngoài dự đoán, một role rõ ràng cho nó cái neo để suy luận, thay vì đoán mò.

### 2. Context - những gì model cần biết

Đây là phần bạn tiêm dữ liệu thực tế vào: người dùng đang ở đâu trong hành trình, đang làm bài tập gì, code của họ trông như thế nào. Đừng để model suy diễn những thứ bạn đã biết sẵn.

```
Người dùng đang học Python. Bài hiện tại về vòng lặp.
Code của họ: {user_code}
```

Giữ phần này tập trung vào sự thật - không cần giải thích lý do, chỉ cần dữ kiện.

### 3. Constraints - những gì model không được làm

Đây là phần hầu hết các prompt bỏ qua - và cũng là phần quan trọng nhất khi sản phẩm ra ngoài thực tế.

```
Không viết solution thay cho người dùng. Nếu bị hỏi thẳng,
hãy dẫn dắt bằng câu hỏi gợi mở. Chỉ trả lời về bài tập
hiện tại - không giải đáp câu hỏi ngoài phạm vi.
```

Viết constraints cho những failure mode bạn đã thấy - và những cái bạn có thể tưởng tượng ra. Mỗi khi model làm điều không ai mong muốn, đó là một constraint chưa được viết ra.

### 4. Output format - bạn muốn nhận lại cái gì?

Nếu UI cần một hình dạng cụ thể - JSON, một đoạn văn ngắn, danh sách có thứ tự - hãy nói rõ. Model đọc ví dụ nhanh hơn đọc mô tả trừu tượng, nên nếu có thể, đưa kèm một ví dụ cụ thể.

```
Trả lời trong 2-3 câu. Giọng thân thiện, khích lệ.
Không đưa code vào câu trả lời trừ khi người dùng
đã chia sẻ code trước.
```

## Ba chiến thuật giúp prompt chịu được áp lực thực tế

Ngoài bốn phần trên, có những điều phân biệt prompt chỉ đẹp trong demo với prompt thực sự hoạt động khi scale:

**Viết cho failure mode, không phải cho happy path.** Sau tuần đầu ra mắt, lấy một mẫu output và chủ động tìm những cái xấu. Mỗi output tệ là một constraint bạn chưa viết. Thêm nó vào.

**Dùng few-shot example ngay trong prompt.** Với những task đòi hỏi sắc thái - giọng điệu, mức độ chi tiết, cách xử lý câu hỏi mơ hồ - một vài cặp ví dụ cụ thể thường hiệu quả hơn nhiều đoạn giải thích dài. Model học từ ví dụ nhanh hơn học từ quy tắc.

**Ghim format, không ghim nội dung.** Từ ngữ thì hãy để model tự chọn - vocabulary của nó rộng hơn của bạn. Nhưng cấu trúc output thì phải kiểm soát. Ràng buộc nội dung quá nhiều làm response cứng nhắc; để format quá tự do làm nó khó đoán.

## Thử nghiệm trước khi nó thành bug report

Cách tốt nhất để bắt lỗi prompt là trước khi ship. Ngay cả một bộ [test case nhỏ](/vi/blog/how-to-write-llm-evals-for-your-ai-product) - mười lăm tình huống bao phủ luồng chính và những edge case bạn đã nghĩ tới - cũng đủ để phát hiện phần lớn sự cố trước người dùng.

Chạy những test này sau mỗi lần thay đổi prompt. Một prompt được cải thiện ở happy path nhưng phá vỡ ba edge case không phải là cải thiện - đó là một đánh đổi được thực hiện mà không hay biết.

> Mục tiêu không phải là một prompt hoàn hảo. Mà là một prompt bạn có thể thay đổi với sự tự tin - vì bạn biết nó cần làm gì, và bạn có cách kiểm chứng điều đó.

## Thêm hay viết lại?

Khi prompt già đi, sẽ có xu hướng vá bằng cách chắp thêm: thêm một ràng buộc, thêm một đoạn giải thích, thêm một ngoại lệ. Một lúc nào đó, cái prompt ban đầu vài trăm token trở thành một bức tường 2.000 token tự mâu thuẫn với chính nó.

Quy tắc đơn giản: **nếu một constraint hoặc một example nhỏ giải quyết được vấn đề, hãy thêm vào. Nếu bạn liên tục viết thêm để khắc phục những gì instructions trước đó gây ra - đó là lúc cần viết lại từ đầu, từ phần role.**

Dấu hiệu rõ nhất là khi bạn đang "chiến đấu" với model - thêm ràng buộc để triệt tiêu những gì instruction trước tạo ra. Thường thì đây là triệu chứng của một khoảng cách giữa role bạn đã định nghĩa và thứ người dùng thực sự muốn từ feature.

## Prompt cũng là code - cần được đối xử như vậy

Trong [hành trình xây dựng AI product](/vi/blog/category/building-ai-products), system prompt thường bị xem nhẹ - viết một lần rồi thôi, không ai quản lý phiên bản, không ai test có hệ thống. Nhưng đó lại là một trong những thứ ảnh hưởng nhiều nhất đến trải nghiệm người dùng.

Viết nó cẩn thận. Test nó có hệ thống. Và khi người dùng thật đến - theo những cách bạn chưa nghĩ tới - bạn sẽ vui vì đã làm vậy.
