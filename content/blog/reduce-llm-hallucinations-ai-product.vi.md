---
title: "Làm thế nào để giảm hallucination trong sản phẩm AI của bạn"
description: "Những kỹ thuật thực tế để giảm hallucination của LLM trong môi trường production — từ grounding, structured outputs đến evals và thiết kế UX giữ được niềm tin của người dùng."
date: "2026-07-22"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["hallucinations", "llm", "reliability", "prompt-engineering", "evals", "ai-product"]
---

Có một loại cảm giác mà bất kỳ ai xây dựng sản phẩm AI cũng từng nếm qua - khoảnh khắc nhận ra model vừa tự tin đưa ra một thông tin hoàn toàn không có thật. Một con số bịa đặt, một tên API không tồn tại, một chính sách mà sản phẩm chưa bao giờ có. Người dùng chụp màn hình gửi lên mạng. Và vì model nói với giọng chắc nịch, họ tin.

Hallucination không phải là lỗi có thể vá được. Đây là đặc tính cốt lõi của cách large language model hoạt động: model dự đoán token tiếp theo dựa trên các pattern đã học, và đôi khi những pattern đó dẫn đến một nơi không có thật. Vấn đề không phải là loại bỏ hoàn toàn hallucination - điều đó hiện tại chưa thể làm được. Vấn đề là thiết kế sản phẩm sao cho hallucination hoặc không đến được tay người dùng, hoặc nếu đến thì không gây hại.

Dưới đây là những gì thực sự có tác dụng.

## Cung cấp dữ liệu thật thay vì dựa vào trí nhớ của model

Kỹ thuật hiệu quả nhất là **đưa thông tin cần thiết vào ngay trong prompt**. Thay vì để model tự nhớ lại từ dữ liệu training, bạn chủ động lấy thông tin liên quan và nhét thẳng vào context.

Đây là nền tảng của RAG (Retrieval-Augmented Generation). Thay vì hỏi:

```
"Gói đăng ký của người dùng này bao gồm những gì?"
```

Bạn làm thế này:

```
Gói đăng ký của người dùng: Pro — không giới hạn dự án, 5 ghế cho team, API access.

Dựa trên thông tin trên, gói này bao gồm những gì?
```

Khi model đã có câu trả lời ngay trước mắt, nó không cần phải tự nghĩ ra. RAG cắt giảm đáng kể hallucination về thông tin thực tế cho mọi thứ mang tính đặc thù - docs của bạn, dữ liệu của người dùng, knowledge base của sản phẩm.

> Nguyên tắc vàng: nếu câu trả lời tồn tại ở đâu đó trong hệ thống, hãy lấy nó ra trước. Đừng để model phải đoán.

[Context Windows for Product Builders](/vi/blog/context-windows-for-product-builders) đi sâu vào cách suy nghĩ về những gì bạn đưa vào context và bao nhiêu là đủ.

## Dùng structured outputs để kiểm soát những gì model trả về

Text tự do là nơi hallucination ẩn náu. Khi bạn yêu cầu model trả về một JSON object với các trường cụ thể, model bị buộc phải tuân theo một schema - và các API hiện đại cho phép bạn enforce schema đó ngay ở tầng API call.

Thay vì "tóm tắt mục tiêu của người dùng", hãy yêu cầu:

```json
{
  "primaryGoal": "...",
  "confidence": "high | medium | low",
  "sourceQuote": "..."
}
```

Lúc này bạn có ba thứ trong tay: format đáng tin để UI render, tín hiệu về độ tin cậy để quyết định có hiển thị ngay hay đưa vào hàng đợi xem xét, và trường `sourceQuote` buộc model phải neo câu trả lời vào một thứ có thật. Chính trường cuối đó bắt được rất nhiều thông tin bịa đặt - nếu model không tìm được câu trích dẫn nào để dẫn nguồn, nó buộc phải thừa nhận điều đó.

Xem thêm tại [Structured Outputs for AI Products](/vi/blog/structured-outputs-for-ai-products) để biết cách triển khai trong thực tế.

## Viết system prompt chặt chẽ hơn

Hallucination thường xảy ra khi system prompt quá thưa thớt. Một model được hỏi câu hỏi mở trong môi trường không có rào cản sẽ dùng bất cứ thứ gì nghe có vẻ hợp lý - kể cả thông tin tự nghĩ ra.

Một system prompt tốt cho tính năng liên quan đến thông tin thực tế cần định nghĩa rõ:

1. **Model biết gì** - nguồn thông tin nào được phép dùng
2. **Phải làm gì khi không chắc** - "Nếu không biết, hãy nói thẳng. Đừng đoán."
3. **Điều gì nằm ngoài phạm vi** - những chủ đề sản phẩm không được phép trả lời

```
Bạn là gia sư lập trình cho người mới bắt đầu. Bạn giúp người dùng hiểu
các lỗi và khái niệm trong code của họ.

Nếu được hỏi về các chủ đề không liên quan đến lập trình, hãy nói rằng
đó nằm ngoài phạm vi của bạn.

Đừng bao giờ tự nghĩ ra tên thư viện, số version, hay tên API mà bạn
không chắc chắn. Nếu không chắc, hãy nói "Bạn nên kiểm tra docs chính
thức cho vấn đề này."
```

Điều này không ngăn được tất cả hallucination, nhưng tạo ra một hàng rào. [System Prompts That Work in Production](/vi/blog/system-prompts-that-work-in-production) đi sâu hơn vào cách cấu trúc những prompt này mà không làm chúng cồng kềnh.

## Giảm temperature cho những tác vụ cần độ chính xác

Temperature kiểm soát mức độ "sáng tạo" của model. Với những tác vụ đòi hỏi độ chính xác - trích xuất dữ liệu, trả lời câu hỏi thực tế, tóm tắt tài liệu - hãy đặt về 0 hoặc rất gần 0. Bạn đánh đổi sự đa dạng trong cách diễn đạt lấy output nhất quán và bám sát thực tế hơn.

Giữ temperature cao hơn cho những việc cần sáng tạo: brainstorming, viết biến thể, tạo ý tưởng. Thông số phải khớp với mục tiêu.

```ts
// Trích xuất thông tin — temperature 0
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  temperature: 0,
  messages: [/* ... */],
})

// Brainstorming sáng tạo — temperature 0.8
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  temperature: 0.8,
  messages: [/* ... */],
})
```

## Để model tự kiểm tra lại câu trả lời của mình

Kỹ thuật tự kiểm tra bị bỏ ngỏ nhiều hơn mức đáng có. Thay vì một lần gọi model, bạn thực hiện hai lần:

1. **Lần một**: tạo ra câu trả lời
2. **Lần hai**: yêu cầu model đối chiếu câu trả lời với tài liệu gốc

```
Câu trả lời sau đây có phản ánh chính xác nội dung trong tài liệu này không?
Trả lời CÓ hoặc KHÔNG, sau đó giải thích bất kỳ điểm không chính xác nào.

Tài liệu: [nguồn đã lấy về]
Câu trả lời: [phản hồi từ lần gọi đầu]
```

Cách này tốn thêm thời gian và chi phí, nên chỉ dùng cho những tính năng có tác động lớn - tóm tắt y tế, dữ liệu tài chính, giải thích pháp lý. Trong những bối cảnh đó, ngăn được một output sai trước khi đến tay người dùng là đáng giá.

## Viết evals trước khi ship

Cách để phát hiện các pattern hallucination trước khi người dùng gặp là viết evals: những bài test tự động kiểm tra tính năng AI của bạn đối chiếu với output mẫu đã biết trước là đúng. Một tập 20–30 test case - input thực tế cùng output kỳ vọng - chạy với mỗi lần thay đổi prompt sẽ bắt được regression trước khi đưa lên production.

Một eval nhắm vào hallucination có thể so sánh output của model với tập tài liệu tham chiếu và gắn cờ những phản hồi chứa thông tin không có trong nguồn đó. Bạn hoàn toàn có thể bắt đầu với một file spreadsheet và một script đơn giản trước khi xây dựng gì phức tạp hơn.

[How to Write LLM Evals for Your AI Product](/vi/blog/how-to-write-llm-evals-for-your-ai-product) hướng dẫn từng bước - đây là một trong những việc có giá trị đòn bẩy cao nhất trước khi ra mắt và cũng là một trong những việc bị bỏ qua nhiều nhất.

## Thiết kế fallback UX ngay từ đầu

Dù đã có tất cả những lớp bảo vệ trên, hallucination vẫn sẽ lọt qua. Câu hỏi quan trọng là: người dùng sẽ thấy gì khi điều đó xảy ra?

Một số pattern UX hiệu quả:

- Hiển thị mức độ tin cậy cạnh kết quả ("Dựa trên thông tin gói đăng ký của bạn")
- Thêm link "Xem nguồn" cho những thông tin thực tế mà model lấy từ dữ liệu có thật
- Tích hợp cơ chế phản hồi nhanh "Có hữu ích không?" để thu thập những lỗi người dùng phát hiện ra
- Đặt kỳ vọng trung thực ngay trong sản phẩm — "Hỗ trợ bởi AI — hãy xác minh lại cho các quyết định quan trọng"

Người dùng dễ chấp nhận AI sai hơn khi họ biết đang dùng AI và được nhắc nhở phải kiểm tra lại. Điều phá vỡ niềm tin là những thông tin sai được đưa ra với giọng chắc nịch, không có bất kỳ tín hiệu nào cho thấy model có thể không chắc chắn. **Thiết kế cho sự trung thực, không phải cho vẻ toàn tri.**

## Điều mang về từ bài này

Hallucination là đặc tính của công nghệ, không phải là lỗi đang chờ được vá. Điều bạn kiểm soát được là những lớp xung quanh nó:

- **Grounding** — cung cấp dữ liệu đúng để model không phải tự đoán
- **Structured outputs** — bắt buộc schema neo câu trả lời vào nguồn thực
- **System prompt** — định nghĩa rõ "khi không biết thì làm gì"
- **Temperature** — bằng 0 cho tác vụ thực tế, cao hơn cho sáng tạo
- **Tự kiểm tra** — gọi hai lần cho những tính năng quan trọng
- **Evals** — phát hiện regression trước khi người dùng thấy
- **Fallback UX** — đặt kỳ vọng trung thực ngay trong sản phẩm

Xây đủ bảy lớp này vào và phần lớn hallucination sẽ hoặc bị bắt, hoặc có thể xử lý được. Không hoàn hảo - nhưng đó là một sản phẩm người dùng có thể tin tưởng, và đó là thứ thực sự tạo ra sự khác biệt về lâu dài.
