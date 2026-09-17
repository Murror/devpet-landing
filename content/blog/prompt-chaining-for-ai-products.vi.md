---
title: "Prompt chaining: cách chia nhỏ tác vụ AI phức tạp thành từng bước tin cậy"
description: "Tìm hiểu prompt chaining là gì và khi nào nên dùng để xây dựng AI feature ổn định hơn — kèm ví dụ thực tế bất kỳ builder nào cũng có thể áp dụng ngay."
date: "2026-07-24"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["prompt-chaining", "llm", "ai-product", "prompting", "workflow", "reliability"]
---

Có một khoảnh khắc gần như builder nào cũng trải qua: bạn viết một prompt thật dài, thật chi tiết, gửi đi - rồi nhận về kết quả *gần đúng*, nhưng vẫn thiếu một chút. Bạn thêm hướng dẫn. Prompt phình to. Output bắt đầu lung lay. Bạn tiếp tục vá, tiếp tục thêm, cho đến lúc prompt của bạn dài hơn cả một bài blog và vẫn sai khoảng 20% số lần chạy.

Vấn đề không phải ở cách bạn viết prompt. Vấn đề là bạn đang yêu cầu model làm *quá nhiều thứ cùng một lúc*.

Giải pháp có tên: **prompt chaining** - tức là tách một tác vụ phức tạp thành một chuỗi các bước nhỏ hơn, mỗi bước chỉ làm một việc, làm thật tốt, rồi chuyển kết quả cho bước tiếp theo.

## Tại sao một prompt đơn không đủ

Khi bạn gửi một prompt lớn, model phải giữ nhiều mục tiêu cạnh tranh nhau trong cùng một "bộ nhớ làm việc": hiểu ý định người dùng, tìm kiếm kiến thức liên quan, áp dụng đúng định dạng, xử lý edge case, và xuất ra output sạch. Đó là quá nhiều. Khi một trong những bước đó khó hơn phần còn lại, model có xu hướng đi tắt ở những chỗ khác.

Hóa ra cách một chuyên gia giỏi làm việc cũng không khác nhau là mấy - họ không ngồi xuống và tạo ra kết quả hoàn chỉnh trong một lần. Họ nghiên cứu, phác thảo, viết nháp, sửa lại, rồi kiểm tra. Prompt chaining mô phỏng đúng cái nhịp đó: chia một yêu cầu lớn thành một chuỗi các lời gọi model, mỗi cái làm tốt một việc, rồi chuyển kết quả đi tiếp.

Điều bạn thu được: output nhất quán hơn, lỗi dễ tìm hơn, và khả năng biết chính xác bước nào đã sai.

## Bốn dạng chain bạn sẽ thực sự dùng

### 1. Chain tuần tự

Dạng đơn giản nhất: output của bước A trở thành input của bước B.

**Ví dụ:** người dùng gửi lên notes thô từ một buổi họp. Bước 1 trích xuất các action item. Bước 2 lấy những action item đó và soạn thảo email follow-up. Bước 3 định dạng lại email theo phong cách người dùng muốn.

Mỗi bước thì hẹp, dễ test, và dễ viết lại độc lập. Nếu giọng văn email chưa ổn, bạn chỉ cần sửa bước 3 - không cần đụng vào bước 1 hay 2.

### 2. Chain phân nhánh

Đôi khi bước tiếp theo phù hợp nhất lại phụ thuộc vào kết quả bước đầu tiên. Bạn phân loại intent trước, rồi định tuyến sang các prompt khác nhau tùy vào model phân loại thế nào.

```js
const intent = await classify(userMessage)

if (intent === 'bug_report') {
  return await handleBugReport(userMessage)
} else if (intent === 'feature_request') {
  return await handleFeatureRequest(userMessage)
} else {
  return await handleGeneralQuestion(userMessage)
}
```

Mỗi handler chỉ cần tập trung vào việc của mình. Prompt xử lý bug report không cần biết gì về feature request. Nó chỉ làm đúng một việc.

### 3. Chain map-reduce

Hữu ích khi bạn xử lý một tập hợp - nhiều tài liệu, nhiều review của người dùng, nhiều ticket hỗ trợ. Bước 1 "map": chạy cùng một prompt qua từng item để trích xuất dữ liệu có cấu trúc. Bước 2 "reduce": tổng hợp tất cả kết quả đó thành một câu trả lời cuối.

Ví dụ: tóm tắt mười cuộc phỏng vấn người dùng, rồi hỏi model tìm ra ba chủ đề xuất hiện nhiều nhất trong các bản tóm tắt đó. Bước reduce chỉ hoạt động tốt khi bước map đã cho ra output sạch, nhất quán từ mỗi item - điều này dễ đạt được hơn nhiều khi mỗi item được xử lý bởi cùng một prompt tập trung.

### 4. Chain xác thực trước - hành động sau

Trước khi thực hiện một hành động không thể hoàn tác - gửi email, ghi vào database, đăng nội dung - hãy thêm một bước kiểm tra. Yêu cầu model đánh giá output của chính nó theo một checklist, hoặc đưa bản nháp qua một prompt "phê bình" riêng.

Đây là một trong những chain có đòn bẩy cao nhất bạn có thể thêm vào AI product, vì nó bắt được cái đuôi dài của edge case mà prompt chính không xử lý được. Prompt phê bình chỉ có một việc: tìm ra vấn đề. Nó làm điều đó tốt hơn rất nhiều khi nó không phải đồng thời tạo ra nội dung.

> Cách tốt nhất để tăng độ tin cậy của LLM không phải lúc nào cũng là viết prompt tốt hơn - mà là thêm một bước có mỗi nhiệm vụ là kiểm tra kết quả của bước trước.

## Ví dụ thực tế: tạo changelog tự động

Giả sử bạn muốn biến các commit message thô thành một changelog rõ ràng, dễ đọc. Đây là cách một chain ba bước có thể hoạt động:

**Bước 1 — Trích xuất:** Phân tích các commit, lọc bỏ noise (merge commit, version bump), nhóm các thay đổi liên quan.

```
You are a developer assistant. Given these raw git commit messages, 
extract only the meaningful user-facing changes. Group them by type: 
Features, Fixes, Improvements. Ignore merge commits and version bumps.

Commits:
{commits}

Output as JSON.
```

**Bước 2 — Soạn thảo:** Chuyển JSON có cấu trúc thành văn xuôi.

```
You are a technical writer. Given these categorized changes in JSON, 
write a changelog section in a warm, clear voice for non-technical users.
Keep each item to one sentence.

Changes:
{step1_output}
```

**Bước 3 — Hoàn thiện:** Kiểm tra giọng văn và tính nhất quán.

```
Review this changelog draft. Flag any item that:
- is too technical for a non-developer
- repeats information from another item
- is vague ("improved performance" without saying what)

Return the revised draft with flags resolved.

Draft:
{step2_output}
```

Mỗi prompt ngắn, có mục đích rõ ràng, và dễ test riêng lẻ. Nếu bước soạn thảo cho ra văn phong nhàm chán, bạn chỉ sửa đúng prompt đó. Nếu bước hoàn thiện quá thủ cựu, bạn chỉnh riêng bước đó.

## Cách debug một chain bị hỏng

Khi chain thất bại, hãy dùng binary search: chạy bước 1 và bước 2 riêng lẻ trên cùng một input và kiểm tra output trung gian. Thông thường điểm thất bại sẽ khá rõ ràng. Nếu output của bước 1 trông sai, bạn biết cần tập trung vào đâu. Nếu bước 1 ổn nhưng bước 3 thất bại, hãy kiểm tra cách bạn đang đưa output từ bước 2 sang bước 3.

Việc log output trung gian trong quá trình phát triển là không thể thiếu. Đừng đợi đến khi debug lỗi production mới khám phá output các bước trong chain của bạn trông như thế nào. Hãy xây dựng khả năng quan sát đó ngay từ đầu.

Nếu bạn đang viết eval cho AI product - điều bạn nên làm - mỗi bước trong chain có thể có eval riêng, giúp quá trình lặp lại dựa trên test nhanh hơn nhiều. Tham khảo [cách viết LLM eval cho AI product](/vi/blog/how-to-write-llm-evals-for-your-ai-product) để có điểm khởi đầu thực tế.

## Khi nào dùng chain, khi nào dùng tool

Thật ra, prompt chaining và [LLM tool calling](/vi/blog/llm-tool-calling-guide) giải quyết các vấn đề khác nhau. Tool calling dành cho khi model cần lấy dữ liệu hoặc kích hoạt một hành động. Chaining dành cho khi bạn muốn cấu trúc chính bản thân quá trình suy luận - đảm bảo model làm việc qua bài toán từng bước thay vì ứng biến tất cả cùng một lúc.

Trong thực tế, bạn thường sẽ dùng cả hai: một chain mà một số bước dùng tool (tìm kiếm, tính toán, truy vấn database) và một số bước là suy luận thuần túy.

## Điều cần nhớ

Nếu bạn đang bị mắc kẹt với một AI feature phức tạp và prompt cứ phình ra mà output không cải thiện, hãy dừng lại và tự hỏi: **tôi có thể chia tác vụ này thành hai hoặc ba bước tập trung không?**

Thường thì câu trả lời là có. Hãy bắt đầu với một sequential chain: xác định những gì mỗi bước tạo ra, giữ prompt ngắn và cụ thể, và log output trung gian. Bạn sẽ nhận ra rằng feature trở nên dễ iterate hơn rất nhiều - và output trở nên nhất quán hơn rất nhiều.

Xây dựng chain đơn giản nhất có thể hoạt động. Rồi thêm bước chỉ khi bạn có lý do được chứng minh bằng lỗi thực tế quan sát được, không phải dự đoán.

Khám phá thêm các pattern trong [Xây dựng sản phẩm AI](/vi/blog/category/building-ai-products) - còn nhiều thứ hay phía trước.
