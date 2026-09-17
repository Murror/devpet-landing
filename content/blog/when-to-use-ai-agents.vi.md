---
title: "Khi nào nên dùng AI agent - và khi nào một LLM call là đủ"
description: "AI agent không phải lúc nào cũng là lựa chọn đúng. Đây là cách phân biệt khi nào nên xây agent đa bước và khi nào một LLM call đơn giản là đủ để ship."
date: "2026-06-27"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai-agents", "llm", "product-design", "architecture", "building-ai-products"]
---

Có một từ đang bị lạm dụng nặng nề trong thế giới AI lúc này - đó là "agent." Chatbot cũng được gọi là agent. Tính năng gọi một API rồi trả về kết quả cũng được gọi là agent. Bất cứ thứ gì chạm đến một mô hình AI hơn một bước cũng được gọi là agent. Khi mọi thứ đều là agent thì từ này mất đi ý nghĩa - và quan trọng hơn, bạn mất đi tín hiệu cần thiết để thiết kế tính năng AI cho tốt.

Thật ra, phần lớn những gì bạn sẽ build không cần agent. Và những tính năng thực sự cần agent thì cần vì những lý do rất cụ thể, rất dễ nhận ra. Hiểu được ranh giới đó sẽ giúp bạn tiết kiệm hàng tuần debug và tránh những cơn đau đầu về latency.

## Agent thực sự là gì

Một LLM call là một vòng khứ hồi duy nhất: bạn gửi prompt, nhận về kết quả. Vậy thôi - một đầu vào, một đầu ra, xong.

Agent thì khác. Agent là một LLM có khả năng:

- **Thực hiện hành động** - gọi tool, đọc file, tìm kiếm web, chạy code
- **Quan sát kết quả** - nhìn vào những gì tool trả về rồi tích hợp vào bước tiếp theo
- **Lặp lại cho đến khi xong** - tự quyết định khi nào task hoàn thành, hoặc bước tiếp theo là gì

Điều tạo nên bản chất của một agent không phải là độ phức tạp - mà là vòng lặp có phản hồi. Một LLM call đơn giản, dù prompt có tinh vi đến đâu, vẫn chỉ chạy một lần rồi trả về. Còn agent thì chạy, xem kết quả xảy ra, rồi tự quyết định làm gì tiếp theo.

Mỗi vòng lặp tạo ra một failure mode mới - và đó chính là nền tảng để hiểu khi nào nên dùng agent.

## Mặc định: bắt đầu với một LLM call đơn giản

Áp lực phải dùng agent là có thật. Agent trông có vẻ mạnh hơn, ấn tượng hơn, "AI" hơn. Nhưng với phần lớn tính năng sản phẩm, một prompt được xây dựng tốt - có thể chuỗi qua hai ba bước nối tiếp - là câu trả lời đúng.

LLM call đơn giản mang lại:

- **Tốc độ.** Một API round-trip, thường dưới hai giây.
- **Tính dự đoán được.** Format đầu ra, chi phí token, và latency đều nhất quán.
- **Dễ debug.** Khi có sự cố, bạn chỉ có một prompt cần sửa.
- **Rẻ để test.** Bạn có thể đánh giá ở quy mô lớn với một eval harness nhỏ.

Phần lớn tính năng AI - tóm tắt, phân loại, trích xuất, sinh nội dung, viết lại - về bản chất là những task "nhận đầu vào này, tạo ra đầu ra đó." Chúng không cần lặp. Không cần nhớ qua nhiều bước. Chúng chỉ cần một prompt tốt.

Ngay cả những task trông có vẻ phức tạp thường có thể phân rã thành chuỗi các LLM call riêng biệt thay vì một agent loop thật sự. Phân loại ticket hỗ trợ, rồi route đến đúng bộ phận, rồi soạn thảo câu trả lời - ba LLM call nối tiếp nhau, mỗi cái có đầu vào và đầu ra rõ ràng. Không cần agent.

Để xây dựng những prompt này một cách chuẩn chỉnh, [system prompts hoạt động được trong production](/vi/blog/system-prompts-that-work-in-production) đi sâu vào những yếu tố thực sự quan trọng khi bạn đang ship.

## Khi nào agent thực sự phát huy tác dụng

Có một loại task mà agent thực sự vượt trội - và hóa ra phạm vi đó khá hẹp khi bạn định nghĩa rõ ràng:

**Con đường thực hiện task chưa biết trước.** Agent cần nhìn vào kết quả từng phần để quyết định bước tiếp theo. Một web search agent phát hiện kết quả đầu tiên bị paywall và thử query khác. Một code-generation agent chạy test rồi sửa lỗi cho đến khi pass. Một research agent đọc một nguồn, nhận ra cần hai nguồn nữa, rồi theo đuổi các sợi chỉ đó.

**Task cần dùng tool theo cách mà output của tool này quyết định tool tiếp theo.** Gọi một tool, đọc kết quả, rồi gọi một tool khác dựa trên những gì bạn tìm được - đây là vòng lặp mà LLM call đơn lẻ không thể làm được.

**Task có trạng thái kết thúc rõ ràng nhưng con đường thì không chắc.** "Viết một hàm pass tất cả test này." "Tìm nhà hàng trong tầm đi bộ, đang mở cửa, và nhận đặt bàn." Đích đến cố định; con đường được khám phá dần.

> "Agent xứng đáng với sự phức tạp của nó khi task chỉ có thể được định nghĩa qua kết quả, không phải qua các bước cụ thể."

Nếu bạn có thể viết ra từng bước AI sẽ thực hiện trước khi nó bắt đầu - đó không phải là task cho agent. Đó là một pipeline. Hãy build pipeline đó - nhanh hơn, rẻ hơn, và đáng tin cậy hơn.

## Những chi phí ẩn

Agent hấp dẫn một phần vì demo trông ấn tượng. Nhưng thực tế trong production thì khác.

**Latency cộng dồn.** Mỗi tool call là một network round-trip. Một agent thực hiện năm hành động trước khi trả về câu trả lời có thể đang chờ năm API call bên ngoài theo thứ tự tuần tự. Điều trông có vẻ nhanh nhạy trong demo biến thành màn hình loading năm giây trong sản phẩm thật.

**Lỗi lan truyền.** Một LLM call đơn giản hoặc cho bạn output dùng được hoặc không. Một agent thực hiện một phần task - gọi tool 1, rồi thất bại ở tool 2 - để lại hệ thống của bạn trong trạng thái không xác định. Phục hồi gracefully từ partial execution là bài toán thực sự khó.

**Debug khó hơn theo cấp số nhân.** Với một LLM call, bạn debug prompt. Với agent, bạn debug prompt *và* decision logic *và* tool implementations *và* sequencing *và* terminal condition. Bề mặt cần kiểm tra nhân lên với từng bước.

```text
Single call:      1 thứ có thể sai
3-step pipeline:  3 thứ có thể sai (độc lập nhau)
Agent loop:       n thứ có thể sai (và tương tác với nhau)
```

Không có gì trong số này có nghĩa là agent xấu. Chỉ là chúng đắt - về latency, độ tin cậy, và công sức kỹ thuật. Chúng phải tự kiếm được chỗ đứng trong kiến trúc của bạn.

## Khung quyết định nhanh

Khi thiết kế một tính năng AI mới, hãy hỏi những câu này theo thứ tự:

1. **Task có một tập cố định, đã biết trước các bước?** → Build một pipeline các LLM call.
2. **Task có cần dùng output của một tool để quyết định hành động tiếp theo?** → Lúc này bạn có thể cần agent.
3. **Người dùng có thể chịu đựng thời gian chờ 5–15 giây trở lên?** → Agent chậm. Nếu không, hãy suy nghĩ lại.
4. **Bạn có thể định nghĩa rõ điều kiện kết thúc?** → Nếu không, agent có thể lặp mãi hoặc dừng quá sớm.
5. **Bạn có công cụ observability để debug lỗi đa bước?** → Nếu không, hãy bắt đầu với pipeline rồi thêm iteration sau.

Nếu bạn trả lời "có" cho câu 2, 3, và 4 - agent có thể là lựa chọn đúng. Ngược lại, một pipeline được thiết kế tốt sẽ phục vụ bạn tốt hơn - và người dùng sẽ cảm nhận được sự khác biệt về tốc độ phản hồi dù họ không thể nói lên điều đó.

## Để lại với bạn điều này

Phần lớn tính năng AI của bạn nên là LLM call đơn lẻ, hoặc chuỗi hai ba call. Agent mạnh mẽ, nhưng kèm theo chi phí thật về latency, độ tin cậy, và độ phức tạp khi debug. Hãy dành chúng cho những task mà con đường thực sự không thể biết trước - nơi iteration và tool feedback là thứ làm cho output trở nên khả thi.

Những người build được sản phẩm AI đáng tin cậy thường có chung một thói quen: họ chọn tool đơn giản nhất có thể hoạt động được, rồi thêm phức tạp chỉ khi tool đơn giản hơn đã thất bại rõ ràng. Bản năng đó - [đo trước khi tối ưu](/vi/blog/measure-before-you-optimize) - đúng trong kiến trúc AI cũng như ở bất cứ đâu trong phần mềm.

Bắt đầu với LLM call. Ship pipeline. Rồi thêm agent khi bạn thực sự cần đến nó.
