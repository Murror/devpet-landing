---
title: "RAG, fine-tuning, hay long context? Chọn đúng chiến lược bộ nhớ cho sản phẩm AI"
description: "Ba cách phổ biến để cho LLM biết bối cảnh — RAG, fine-tuning, và long context — và cách chọn đúng trước khi bạn phải viết lại toàn bộ."
date: "2026-07-16"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["rag", "fine-tuning", "context window", "llm", "ai product", "memory"]
---

Hầu hết sản phẩm AI đều bắt đầu từ cùng một điểm xuất phát: gọi API, nhận phản hồi, ship. Nhưng không đến vài tuần sau, câu hỏi không tránh khỏi sẽ xuất hiện - *làm sao để model biết những điều cần biết về sản phẩm của mình, về người dùng, về lĩnh vực đang xây dựng?*

Ba cách trả lời quen thuộc nổi lên trong mọi cuộc thảo luận: RAG (retrieval-augmented generation), fine-tuning, và long context window. Cả ba đều có thể hoạt động. Cả ba đều có cạm bẫy riêng. Chọn sai từ sớm đồng nghĩa với việc phải viết lại - mà lúc đó cái giá sẽ cao hơn nhiều so với hiện tại.

## LLM "nhớ" bằng cách nào?

Thật ra là không - theo nghĩa thông thường. LLM không có bộ nhớ giữa các lần gọi. Mỗi request đều bắt đầu từ tờ giấy trắng: model chỉ "biết" những gì bạn đưa vào context window của request đó. Vì vậy khi muốn AI hiểu điều gì đó - tài liệu sản phẩm, lịch sử tương tác của người dùng, toàn bộ codebase - bạn phải quyết định *cách* đưa kiến thức đó vào prompt.

Ba chiến lược giải quyết bài toán này theo cách khác nhau:

- **RAG**: truy xuất các đoạn thông tin liên quan ngay tại thời điểm nhận câu hỏi, rồi đưa vào prompt.
- **Fine-tuning**: "đúc" kiến thức hoặc hành vi vào trọng số của model thông qua quá trình training.
- **Long context**: nạp thẳng toàn bộ kiến thức cần thiết vào context window trong mỗi request.

Không cái nào là "tốt nhất" trong mọi tình huống - chúng giải quyết những vấn đề hoàn toàn khác nhau.

## Khi nào nên chọn RAG

RAG phù hợp nhất khi knowledge base của bạn lớn, thay đổi thường xuyên, hoặc cần truy vết được nguồn gốc. Hãy nghĩ đến: tài liệu sản phẩm, kho conversation cũ, knowledge base mà team cập nhật hàng tuần.

Vòng lặp cốt lõi khá đơn giản:

```
câu hỏi của user → embed → lấy các chunk liên quan → đưa vào prompt → sinh phản hồi
```

Sức mạnh của RAG nằm ở chỗ knowledge base tồn tại bên ngoài model. Khi docs thay đổi, bạn chỉ re-index - model vẫn như cũ. Khi người dùng hỏi tại sao AI nói điều gì đó, bạn có thể chỉ ra chính xác đoạn văn bản đã được truy xuất.

Điểm yếu nằm ở chất lượng retrieval và cách thiết kế chunk. Nếu embedding không trả về đúng đoạn cần thiết, model sẽ lấp đầy khoảng trống đó bằng những câu trả lời nghe có vẻ tự tin nhưng hoàn toàn bịa. Retrieval tệ làm model *tệ hơn* - không phải tốt hơn.

RAG cũng thêm độ trễ và hạ tầng: cần vector store, embedding pipeline, và thời gian truy xuất trước khi sinh phản hồi. Với sản phẩm nhỏ, đó là chi phí cần tính kỹ trước khi cam kết.

> Nếu knowledge base thay đổi nhiều hơn một lần mỗi tháng, hoặc nằm trong tài liệu thay vì ví dụ có cấu trúc, **hãy bắt đầu với RAG**.

## Khi nào nên chọn fine-tuning

Fine-tuning dạy model *hành vi mới*, không phải *kiến thức mới*. Đây là lựa chọn đúng khi bạn muốn model phản hồi theo định dạng cụ thể, giọng văn riêng, hay quy ước của domain mà khó mô tả hết trong system prompt.

Ví dụ kinh điển: dạy model luôn trả về JSON hợp lệ với schema cụ thể, dùng thuật ngữ đặc thù của ngành. Có thể thúc đẩy điều này bằng prompting - nhưng fine-tuning mới giúp ổn định điều đó một cách đáng tin cậy ở quy mô lớn.

Fine-tuning cũng hiệu quả khi bạn có thư viện lớn các cặp input-output chất lượng cao và muốn model học các mẫu từ đó. Hãy hình dung như một chương trình đào tạo: bạn đang dạy model thế nào là phản hồi tốt cho usecase cụ thể của mình.

**Điều fine-tuning không làm được**: bơm kiến thức cụ thể vào model. Model sau khi fine-tune không nhớ các sự kiện từ dữ liệu training một cách đáng tin cậy. Nếu bạn fine-tune trên docs của mình, model sẽ học *phong cách* phản hồi - nhưng không đảm bảo nhớ được từng chi tiết cụ thể bạn đưa vào. Đó là việc của RAG.

Fine-tuning cũng là lựa chọn tốn kém nhất để vận hành đúng cách: cần dataset được curate kỹ, hạ tầng training, eval để validate model sau khi tune, và quy trình refresh khi yêu cầu thay đổi.

> Nếu vấn đề là **tính nhất quán của hành vi** - định dạng, giọng văn, quy ước - fine-tuning xứng đáng đầu tư. Nếu là kiến thức, hãy dùng RAG.

## Khi nào nên chọn long context

Context window đã mở rộng đáng kể trong thời gian gần đây. Nhiều model hiện xử lý được 200k token - tương đương khoảng 500 trang văn bản - trong một lần gọi. Với nhiều sản phẩm, điều đó đủ để bỏ qua cả RAG lẫn fine-tuning.

Long context là cách đơn giản nhất: nạp thẳng kiến thức vào prompt - cả codebase, một bộ tài liệu, toàn bộ lịch sử conversation - và để model suy luận trên đó. Không cần retrieval pipeline, không cần training pass.

Cách này hoạt động tốt đáng ngạc nhiên cho:
- **Công cụ hỗ trợ viết code**: nạp toàn bộ project context vào một prompt
- **Hỏi đáp trên tài liệu**: tập tài liệu nhỏ vừa khít vào window
- **Lịch sử conversation**: những session đủ ngắn để giữ nguyên context

Vấn đề là chi phí. Điền đầy context window 200k token trong mỗi request tốn tiền nhanh, ngay cả ở mức sử dụng vừa phải. Hóa ra model cũng có xu hướng chú ý tốt hơn vào phần đầu và cuối của context dài - nên vẫn có thể "trượt" nội dung ở giữa, dù window lớn đến đâu.

Điều đáng nói hơn: long context dễ gãy khi scale. Khi sản phẩm lớn lên, những gì vừa 200k token sẽ không còn vừa nữa - và đột nhiên bạn cần RAG anyway. Nếu xây dựng hướng đến scale, hãy thiết kế cho RAG ngay từ đầu, dù có thể dùng long context như bước đệm ban đầu.

> Dùng long context khi vấn đề **nhỏ, ổn định, và chi phí chưa phải ràng buộc**. Lên kế hoạch chuyển sang RAG.

## Framework để chọn

| Dấu hiệu | Lựa chọn phù hợp |
|---|---|
| Knowledge base thay đổi hàng tuần hoặc thường xuyên hơn | RAG |
| Cần truy vết nguồn gốc phản hồi | RAG |
| Muốn định dạng / giọng văn / phong cách nhất quán | Fine-tuning |
| Có 500+ cặp input-output chất lượng cao | Fine-tuning |
| Knowledge base dưới ~100k token | Long context |
| Chi phí chưa phải ràng buộc | Long context (rồi RAG) |
| Cần cả kiến thức lẫn hành vi nhất quán | RAG + fine-tuning kết hợp |

## Codepet dùng cách nào

Ở Codepet, các AI companion cần biết về project hiện tại của người dùng, trình độ của họ, và phản hồi từ các session trước. Suy cho cùng, đây là bài toán retrieval - context theo từng người dùng rất lớn, cá nhân hóa cao, và được cập nhật sau mỗi session.

Chúng tôi dùng RAG để truy xuất lịch sử người dùng và project context liên quan trước mỗi phản hồi. Model gốc xử lý phong cách giảng dạy và giọng văn - chưa cần fine-tuning vì prompting cẩn thận cộng với system prompt chi tiết đã đủ để thiết lập tone. Long context bù vào những chỗ retrieval còn thiếu.

Công thức: **RAG cho kiến thức, prompting cho hành vi, long context như phương án dự phòng**. Không có gì quá phức tạp - hầu hết sản phẩm AI ở production đều hội tụ về đây theo thời gian, câu hỏi chỉ là mất bao nhiêu lần viết lại để đến đó.

## Điều quan trọng nhất cần nhớ

Đừng chọn chiến lược bộ nhớ vì nghe "xịn" nhất - hãy chọn cái đơn giản nhất giải quyết đúng vấn đề:

- Người dùng hỏi những câu cần trả lời từ dữ liệu của bạn → RAG
- Model cần hành xử khác đi → fine-tuning
- Dữ liệu vừa vào trong context window → long context

Bắt đầu đơn giản. Chiến lược đúng thường hiện ra rõ nhất khi bạn ngồi cạnh một người dùng thật và quan sát model "trượt" ở đâu. Đó cũng là lúc những [eval bạn đã viết trước đó](/vi/blog/how-to-write-llm-evals-for-your-ai-product) bắt được regression khi bạn thay đổi chiến lược - và cứu bạn khỏi một lần regression âm thầm trên production mà không ai nhận ra.
