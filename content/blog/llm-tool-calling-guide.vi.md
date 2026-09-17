---
title: "Tool calling trong LLM: hướng dẫn thực chiến cho người xây sản phẩm AI"
description: "Tool calling biến LLM từ một cỗ máy tạo văn bản thành AI thực sự làm được việc. Đây là cách thiết kế, triển khai và ship tính năng này mà không làm vỡ production."
date: "2026-06-23"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["tool-calling", "llm", "ai-products", "function-calling", "build", "ship"]
---

Khoảnh khắc một AI chuyển từ *nói* sang *làm* - đó là lúc mọi thứ trở nên thực sự thú vị. Tool calling, hay còn gọi là function calling, là cơ chế tạo ra bước chuyển đó. Nó cho phép model quyết định gọi một hàm bên ngoài, nhận kết quả thật về, rồi dệt kết quả đó vào câu trả lời của nó.

Nếu bạn từng xây dựng bất cứ thứ gì với AI ngoài một chatbot đơn giản, chắc chắn bạn đã gặp cái tường quen thuộc ấy - nơi mà text generation đơn thuần không còn đủ nữa. Người dùng hỏi "trạng thái đơn hàng của tôi đang ở đâu?" và model tự tin... bịa. Tool calling là thứ giúp bạn vượt qua cái tường đó, và là nền tảng để xây nên những AI feature thực sự có thể ship được.

## Tool calling là gì, và tại sao nó quan trọng

Ý tưởng cốt lõi khá đơn giản. Bạn định nghĩa một tập hợp các tool - mỗi tool có tên, mô tả, và schema tham số. Trong quá trình sinh response, thay vì tự sản xuất thông tin, model có thể "dừng lại" và yêu cầu gọi một tool. Ứng dụng của bạn chạy hàm đó, gửi kết quả trở lại, và model tiếp tục.

Trông như thế này:

```
User: "Thời tiết Hà Nội hôm nay thế nào?"
→ Model quyết định: cần gọi get_weather(city="Hanoi")
→ App gọi weather API
→ App nhận về: {"temp": 32, "condition": "nắng nóng", "feels_like": 38}
→ Model trả lời: "Hà Nội hôm nay 32°C nhưng chỉ số nhiệt cảm nhận
   lên tới 38°C do độ ẩm cao."
```

Model không "biết" thời tiết. Nó biết cách hỏi - và biết dùng câu trả lời. Ranh giới đó quan trọng hơn nhiều người nghĩ.

## Vòng lặp của tool calling

Hầu hết các implementation trong production đều theo một vòng lặp tương tự:

1. **Gửi** tin nhắn của user cùng với định nghĩa các tool đến model.
2. **Kiểm tra** response - nếu model trả về một tool call, thực thi nó.
3. **Thêm** kết quả của tool vào conversation.
4. **Gửi lại** cho model để nhận response cuối cùng.
5. Lặp lại nếu model tiếp tục gọi thêm tool.

Vòng lặp này trông đơn giản, nhưng tác động lên latency và chi phí thì rất thật. Mỗi tool call là ít nhất thêm một round-trip - và khi model "xích" nhiều lần gọi liên tiếp, độ trễ tích lũy nhanh hơn bạn tưởng. Ít tool nhưng được thiết kế chắc thường hiệu quả hơn nhiều tool nhỏ lẻ.

## Thiết kế tool tốt - chỗ hầu hết mọi người làm sai

Đây là điều chúng tôi thấy lặp đi lặp lại: khả năng model chọn đúng tool phụ thuộc gần như hoàn toàn vào cách bạn mô tả nó. Một số nguyên tắc:

**Viết description cho model, không phải cho người.** Trường `description` của tool là một prompt. Hãy nói rõ khi nào nên dùng tool này, đầu vào nó mong đợi là gì, và nó trả về cái gì. Mô tả mơ hồ dẫn đến gọi sai hoặc bỏ qua.

**Đặt tên tool như một hành động.** `search_knowledge_base` tốt hơn `knowledge_base`. `create_calendar_event` tốt hơn `calendar`. Động từ truyền đạt ý định - model đọc tên trước khi đọc description.

**Tham số càng gọn càng tốt.** Mỗi tham số tùy chọn là một quyết định model phải tự đưa ra. Không cần thiết thì bỏ đi. Dùng enum thay vì free-text string bất cứ khi nào có thể - chúng giới hạn lựa chọn của model và giảm invalid call.

**Một tool, một mục đích.** Tool nào làm ba việc sẽ bị gọi sai một nửa thời gian. Nếu bạn thấy mình viết "HOẶC" trong mô tả, hãy tách tool đó ra.

Đây là ví dụ về một tool schema được viết tốt:

```json
{
  "name": "search_user_notes",
  "description": "Tìm kiếm trong ghi chú cá nhân của user. Dùng khi user hỏi về thứ họ có thể đã lưu, viết, hoặc tham chiếu trước đó. Trả về tối đa 5 kết quả được xếp hạng với tiêu đề, đoạn trích, và ngày.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Truy vấn tìm kiếm - dùng từ khóa từ câu hỏi của user, không phải nguyên câu hỏi."
      }
    },
    "required": ["query"]
  }
}
```

Chú ý description nói rõ *khi nào* dùng tool, nó trả về gì, và có hướng dẫn sử dụng ngay trong description của tham số. Mức độ cụ thể này tạo ra sự khác biệt rõ ràng trong production.

## Tool calling vs RAG: chọn cái nào?

Đây là điểm hay bị nhầm lẫn. Cả hai đều lấy thông tin từ bên ngoài - nhưng theo cách khác nhau và phục vụ mục đích khác nhau.

**RAG** lấy context trước và nhồi vào prompt trước khi generation bắt đầu. Phù hợp với knowledge base rộng, tài liệu, hoặc khi bạn luôn muốn ground model trong một corpus nhất định. Chúng tôi đã viết chi tiết về [cách xây RAG cho ghi chú cá nhân](/vi/blog/build-personal-rag-for-notes) nếu bạn muốn bắt đầu từ đó.

**Tool calling** phù hợp hơn khi retrieval là có điều kiện - tức là đôi khi cần, đôi khi không. Khi bạn cần dữ liệu real-time. Hoặc khi bạn muốn thực hiện một hành động, không chỉ tra cứu. Nếu AI của bạn có thể cần gọi API tùy theo câu hỏi - dùng tool. Nếu bạn đang lấy giá trực tiếp, truy vấn database, hay ghi vào hệ thống - dùng tool.

Trong thực tế, nhiều sản phẩm production dùng cả hai: RAG cho kiến thức tĩnh, tool cho hành động động.

## Những thứ cần chuẩn bị trước khi vào production

Làm cho tool calling chạy được trong demo mất một buổi chiều. Làm nó đáng tin cậy trong production thì cần hơn thế.

> **Sai lầm chúng tôi hay thấy nhất:** team thêm 20+ tool vào hệ thống production đầu tiên rồi tự hỏi tại sao model cứ gọi sai. Tool surface ít hơn nhưng được mô tả cẩn thận hơn hầu như luôn vượt trội hơn.

**Xử lý lỗi nghiêm túc.** Tool của bạn sẽ thất bại - rate limit, network timeout, đầu vào không hợp lệ, kết quả rỗng. Hãy xây wrapper trả về thông báo lỗi có cấu trúc mà model có thể hiểu, thay vì stack trace thô. `{"error": "no_results", "message": "Không tìm thấy ghi chú nào."}` luôn tốt hơn HTTP 500.

**Latency có giới hạn.** Mỗi tool call kéo dài thời gian phản hồi. Đặt timeout nghiêm ngặt cho external call. Nếu tool mất hơn 2–3 giây, user nhận ra ngay. Hãy cân nhắc streaming để hiển thị tiến trình trong khi tool đang chạy.

**Chi phí cộng dồn nhanh.** Tool calling đồng nghĩa với nhiều completion hơn cho mỗi tin nhắn user. Đo lường độ sâu gọi trung bình và tính vào unit economics. Hệ thống [eval](/vi/blog/how-to-write-llm-evals-for-your-ai-product) tốt nên bao gồm cả chi phí-per-response, không chỉ chất lượng.

**Giới hạn số lượng tool.** Đừng đưa cho model 30 tool "phòng khi cần". Model hoạt động tốt hơn với 5–10 tool được định nghĩa rõ ràng. Nếu thư viện tool của bạn lớn, hãy route tập hợp phù hợp đến model dựa trên context.

## Khi tool calling không hoạt động - và cách phát hiện sớm

Các failure mode phổ biến nhất:

- **Model bỏ qua tool** - thường là vấn đề description. Hãy làm rõ hơn khi nào cần gọi.
- **Model gọi với tham số sai** - thường là schema mơ hồ. Thêm ví dụ hoặc ràng buộc chặt hơn.
- **Model gọi sai tool** - thường là tên hoặc description chồng chéo. Phân biệt rõ hơn.
- **Vòng lặp vô hạn** - model cứ gọi tool mãi mà không trả về response. Đặt giới hạn số lượt.

System prompt được viết tốt cũng giúp ích rất nhiều ở đây - hãy nói với model cách sử dụng tool, phải làm gì khi tool thất bại, và khi nào cần dừng lại để phản hồi dù chưa có đủ thông tin. Chúng tôi đã viết riêng về [cách viết system prompt hoạt động được trong production](/vi/blog/system-prompts-that-work-in-production) - đó là bước tiếp theo tự nhiên sau khi bạn nắm được tool calling.

## Từ AI tạo văn bản đến AI làm được việc

Tool calling là nền tảng của agentic AI. Một khi model của bạn có thể gọi tool và dùng kết quả, bạn không chỉ đang sinh ra văn bản nữa - bạn đang xây dựng phần mềm có khả năng suy luận, hành động, và lặp lại. Đó là một loại sản phẩm khác về chất.

Hãy bắt đầu với một tool. Ship nó. Đo lường. Thêm cái tiếp theo chỉ khi cái đầu tiên đã đáng tin cậy. Con đường từ "AI chatbot" đến "AI thực sự làm được việc" được xây từng function call đáng tin cậy một - và hiệu ứng cộng dồn khi bạn có ba hay bốn tool chạy tốt thực sự đáng ngạc nhiên.

Và điều quan trọng nhất cần nhớ: viết tool description như thể đó là prompt quan trọng nhất trong hệ thống của bạn. Bởi vì đối với model đang phải quyết định làm gì tiếp theo - đó chính xác là điều đó.
