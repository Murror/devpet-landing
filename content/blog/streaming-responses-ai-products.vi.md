---
title: "Streaming AI: tại sao phản hồi nhanh lại cảm giác thông minh hơn"
description: "Streaming giúp ứng dụng AI của bạn cảm giác nhanh hơn rõ rệt mà không cần đổi model. Cách implement, những thứ hay vỡ, và khi nào thì không cần dùng."
date: "2026-07-06"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["streaming", "ai", "product", "ux", "api", "performance"]
---

Mở một cuộc trò chuyện với Claude hay bất kỳ sản phẩm AI nào bây giờ, bạn sẽ thấy ngay một điều: chữ xuất hiện từng từ một, ngay lúc đó, trước khi toàn bộ câu trả lời sẵn sàng. Đây không phải tình cờ, cũng không phải vì model nhanh hơn - mà là vì người xây dựng sản phẩm đó đã hiểu rằng *cách một thứ cảm giác* và *tốc độ thật của nó* là hai chuyện khác nhau hoàn toàn.

Streaming là một trong những quyết định kỹ thuật trông có vẻ nhỏ nhặt nhưng lại tạo ra sự khác biệt lớn trong trải nghiệm người dùng. Và như nhiều thứ trong AI product, phần khó không phải là code - mà là hiểu khi nào nên dùng, khi nào không, và những góc khuất nào đang chờ bạn ở cuối con đường.

## Streaming thực ra là gì

Khi không có streaming, một API call hoạt động như gửi form: bạn gửi request, server xử lý một lúc, rồi trả về toàn bộ câu trả lời cùng một lúc. Model generate từng token từ đầu đến cuối trước khi bất cứ thứ gì rời khỏi server.

Với streaming, server gửi từng token ngay khi nó được tạo ra. Frontend nhận và hiển thị dần dần - vài từ đầu tiên xuất hiện gần như ngay lập tức, rồi câu trả lời đầy dần ra trong vài giây tiếp theo.

Model bên dưới không thay đổi. Prompt không thay đổi. Số token cũng vậy. Tổng thời gian từ lúc gửi request đến lúc token cuối cùng đến tay người dùng gần như giống hệt. Thứ thay đổi duy nhất là **time to first token** - bao lâu người dùng phải chờ trước khi thấy bất cứ điều gì.

Khoảng thời gian đó là thứ định nghĩa toàn bộ trải nghiệm.

## Tại sao nó quan trọng hơn con số latency

Con người giỏi nhận ra một UI có đang *làm gì đó* không - nhưng lại rất dở trong việc ước lượng thời gian thực tế đã trôi qua. Màn hình trắng ba giây cảm giác như một cái chờ khó chịu. Ba giây chữ xuất hiện từng từ cảm giác như một cuộc trò chuyện.

Đây chính là lý do cốt lõi của streaming: nó biến *chờ đợi* thành *đọc*. Sự chú ý của người dùng chuyển từ "bao giờ cái này xong" sang "nó đang nói gì" - và phần lớn câu trả lời đã xuất hiện trước khi cảm giác mất kiên nhẫn kịp bùng lên.

Còn một hiệu ứng phụ mà nhiều product designer bỏ qua: streaming cho phép người dùng **ngắt**. Họ đọc đoạn đầu, thấy AI đang đi sai hướng, và nhấn dừng - thay vì chờ một câu trả lời dài và sai, rồi hỏi lại. Khả năng điều chỉnh real-time đó thay đổi cách người ta tương tác với sản phẩm của bạn.

> Thật ra, sự khác biệt giữa streaming và không streaming không chỉ là UX polish. Nó thay đổi toàn bộ mô hình tương tác - từ request-response sang hội thoại thật sự.

## Cách implement

Đây là ví dụ tối giản dùng Anthropic SDK. Pattern gần như giống hệt với SDK của OpenAI - một khi hiểu rồi, bạn có thể chuyển đổi qua lại dễ dàng.

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function streamResponse(userMessage: string) {
  const stream = await client.messages.stream({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: userMessage }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  const finalMessage = await stream.getFinalMessage();
  return finalMessage;
}
```

Điểm mấu chốt so với một `messages.create()` thông thường: bạn lặp qua stream như một async generator, mỗi chunk cho bạn một mảnh nhỏ của text. Trong một web app, bạn pipe các chunk đó lên frontend qua server-sent event hoặc ReadableStream response - trình duyệt sau đó append từng delta vào text đang hiển thị.

Trong Next.js App Router, pattern cơ bản trông như thế này:

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message } = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      const aiStream = await client.messages.stream({ /* ... */ });
      for await (const chunk of aiStream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

## Ba vấn đề hay gặp mà tutorial không kể

Streaming trông đơn giản cho đến khi bạn va vào thực tế.

**Partial output parsing.** Nếu bạn cần structured output - danh sách action items, JSON trả về từ model - streaming làm việc parse khó hơn nhiều. Bạn không thể gọi `JSON.parse()` trên một chuỗi mới được giao một nửa. Giải pháp thực tế: stream prose cho người dùng, nhưng dùng non-streaming call cho structured data. Đừng cố parse JSON đang hình thành - đó là con đường dẫn đến bug khó debug. Bài viết về [structured outputs](/blog/structured-outputs-for-ai-products) nói chi tiết hơn về pattern này.

**Lỗi giữa chừng.** Một non-streaming call chỉ có hai trạng thái: thành công hoặc thất bại. Nhưng một streaming call có thể gửi được 300 token rồi *mới* gặp rate limit hay context limit. Error boundary của bạn phải xử lý partial response - và UX của "câu trả lời bị đứt giữa" cần được thiết kế riêng: hiển thị những gì đã đến được không? Có nút retry không? Đây là chi tiết nhỏ nhưng quan trọng.

**Hủy giữa chừng.** Người dùng *sẽ* nhấn dừng. Khi đó bạn cần abort sạch API call đang chạy phía trên - không thì model vẫn cứ generate token và bạn vẫn cứ trả tiền cho chúng, dù người dùng đã chuyển sang việc khác. AbortController pattern xử lý được điều này, nhưng là thêm wiring mà tutorial cơ bản thường bỏ qua. Làm từ đầu - đừng để sau.

## Khi nào không cần streaming

Streaming là default tốt cho chat, câu trả lời dài, và bất cứ thứ gì người dùng đang ngồi nhìn chờ. Nhưng có một số trường hợp bỏ qua nó đi:

- **Khi cần structured output.** JSON, tables, kết quả function call - bất cứ thứ gì bạn parse bằng code. Hãy tích lũy toàn bộ rồi parse một lần.
- **Khi response rất ngắn.** Streaming một câu ba từ thêm overhead không cần thiết.
- **Khi task chạy background.** Tóm tắt document, generate report, chạy evals hàng loạt - người dùng không đang nhìn màn hình. Streaming chỉ thêm phức tạp mà không có UX benefit.
- **Khi chain nhiều API call.** Nếu output của call trước làm input cho call sau, bạn cần toàn bộ response trước khi tiếp tục - stream ở đây không có ý nghĩa gì.

Bài viết về [cách cho app AI có bộ nhớ](/blog/how-to-give-your-ai-app-memory) đi sâu vào cách quản lý state qua nhiều lần trao đổi - phần quan trọng khi bạn đã có streaming hoạt động và muốn đảm bảo hội thoại cảm giác liền mạch.

## Takeaway

Hãy thêm streaming sớm - sớm hơn bạn nghĩ là cần thiết. Retrofit streaming vào một product đã được xây theo kiểu batch response rất khó chịu: UI state model, loading indicator, error handling - tất cả đều đang giả định có một tín hiệu "done" rõ ràng, và streaming xóa tín hiệu đó đi.

Bản thân việc implement không nhiều code. Phần thật sự tốn công là suy nghĩ UX: xử lý partial state thế nào, lỗi giữa stream thế nào, nút stop làm gì. Nhưng khi đã qua được những thứ đó, sản phẩm của bạn cảm giác khác hẳn - như một thứ đang nghĩ cùng người dùng, chứ không phải một thứ đang xử lý request của họ.

Suy cho cùng, người dùng không đo latency bằng millisecond. Họ đo bằng cảm giác. Và streaming - dù không thay đổi một dòng logic nào của model - chính là thứ làm cho cảm giác đó đúng.

Bạn có thể tìm thêm về các quyết định kỹ thuật khi xây AI product trong mục [Xây dựng sản phẩm AI](/vi/blog/category/building-ai-products). Và nếu bạn đã có streaming chạy rồi đang nghĩ bước tiếp theo là gì, [prompt versioning trong production](/blog/prompt-versioning-production-code) thường là phần xuất hiện ngay sau đó.
