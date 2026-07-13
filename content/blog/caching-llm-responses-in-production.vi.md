---
title: "Ba chiến lược cache response của LLM để cắt giảm chi phí AI"
description: "Prompt caching, exact response caching và semantic caching — ba lớp tối ưu không thể thiếu khi bạn muốn sản phẩm AI vừa nhanh vừa tiết kiệm."
date: "2026-07-13"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["caching", "llm", "cost", "latency", "production", "ai-products"]
---

Hầu hết những ai đã từng deploy một tính năng AI lên production đều biết cảm giác đó - response chậm, bill API leo thang từng tuần. Người ta hay nghĩ đến cách tối ưu prompt, chọn model nhỏ hơn, hay giảm `max_tokens`. Nhưng có một giải pháp bị bỏ qua nhiều hơn mức đáng có: caching.

Thật ra, nghe có vẻ mâu thuẫn. LLM sinh text mới mỗi lần gọi - đó là lý do người ta dùng nó. Cache ở đây nghĩa là gì? Hoá ra, nhiều hơn bạn tưởng - và được triển khai đúng cách, caching có thể cắt giảm cả latency lẫn chi phí token đáng kể mà không ảnh hưởng đến trải nghiệm người dùng.

## Tại sao caching quan trọng với sản phẩm AI

Mỗi lần gọi LLM, bạn trả hai loại giá: tiền token và thời gian chờ của người dùng. Hai cái này lại cộng hưởng nhau - càng nhiều token, response càng chậm, bill càng cao, người dùng càng nản.

Nhìn vào logs production của hầu hết sản phẩm AI, sẽ thấy một vài mẫu lặp đi lặp lại:

- System prompt dài 2.000 token được gửi đi trong mỗi request, dù không thay đổi gì cả
- Những câu hỏi gần giống nhau từ hàng trăm người dùng khác nhau ngày qua ngày
- Các response "tĩnh" - mô tả sản phẩm, hướng dẫn onboarding, nội dung help - không cần sinh mới mỗi lần

Cache không phá vỡ "phép màu" của AI. Nó làm cho phép màu đó nhanh hơn.

## Chiến lược 1: Prompt caching ở cấp provider

Đây là win đơn giản nhất và gần như miễn phí. Anthropic, OpenAI và nhiều provider khác hiện đã hỗ trợ **prompt caching** ngay ở cấp API - tức là phần computation cho prefix prompt được lưu lại, request tiếp theo với cùng prefix không cần tính toán lại từ đầu.

Với Anthropic, bạn đánh dấu phần cần cache bằng `cache_control`:

```typescript
const response = await anthropic.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: SYSTEM_PROMPT, // dài, tĩnh, tốn kém
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: userMessage }],
})
```

Phần được cache sẽ giảm chi phí input token tới 90% và cải thiện latency đáng kể. Cache có TTL khoảng 5 phút - đủ để xử lý traffic burst của hầu hết ứng dụng.

> **Quy tắc đơn giản:** Nếu system prompt của bạn dài hơn 1.000 token, hãy bật prompt caching ngay hôm nay. Đây là thay đổi một dòng với tác động hoàn toàn đo lường được.

## Chiến lược 2: Cache toàn bộ response với prompt xác định

Với những prompt mà đầu vào giống nhau và đầu ra không cần thay đổi - tóm tắt một changelog, trích xuất key points từ FAQ, hay sinh welcome message cho người dùng mới - bạn có thể cache cả response.

Điều kiện: đặt `temperature: 0` để output xác định, rồi cache theo hash của full prompt.

```typescript
const cacheKey = `llm:${hash(systemPrompt + userMessage)}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)

const response = await callLLM(systemPrompt, userMessage)
await redis.setex(cacheKey, 3600, JSON.stringify(response)) // TTL 1 giờ
return response
```

Cách này cực kỳ hiệu quả cho nội dung "đọc nhiều" - help docs, mô tả sản phẩm, nội dung giáo dục tĩnh. Nó cũng bảo vệ bạn một phần khi provider gặp sự cố: những path đã được cache vẫn trả về được.

Nhược điểm là nguy cơ serve nội dung cũ. Hãy đặt TTL cẩn thận và xây dựng cơ chế invalidation khi nội dung gốc thay đổi. Với các tính năng AI phụ thuộc vào dữ liệu động - context người dùng, tồn kho real-time, thông tin phiên làm việc - exact caching thường là lựa chọn sai.

## Chiến lược 3: Semantic caching cho sản phẩm hội thoại

Đây là chiến lược phức tạp nhất - và hiệu quả nhất với tính năng AI hướng người dùng. Thay vì cache theo khớp chính xác, bạn **embed** query của người dùng và tìm các query *tương đồng về ngữ nghĩa* trong vector store.

Người dùng A hỏi "làm sao đổi mật khẩu?" - người dùng B hỏi "tôi quên pass rồi phải làm gì?" - semantic cache có thể nhận ra đây là cùng ý định và trả về response đã lưu, không cần gọi thêm LLM.

Luồng cơ bản:

1. Embed query đầu vào
2. Tìm query tương tự trong vector store (cosine similarity vượt ngưỡng)
3. Nếu khớp, trả về cached response
4. Nếu không, gọi LLM và lưu cặp (query, response) mới vào store

Ngưỡng similarity là tham số quan trọng nhất. Quá chặt thì cache hit rate thấp. Quá lỏng thì trả về câu trả lời sai. Bắt đầu với `0.92` và điều chỉnh dựa trên eval set của bạn.

### Khi nào semantic caching phản tác dụng

Semantic caching ngầm giả định rằng các câu hỏi tương đồng về ý nghĩa sẽ có câu trả lời tốt giống nhau - điều này không đúng khi context quan trọng.

"Số dư tài khoản của tôi là bao nhiêu?" từ người dùng A và B là câu hỏi giống nhau về mặt ngữ nghĩa, nhưng tuyệt đối không được dùng chung cache. Bất kỳ prompt nào chứa dữ liệu cá nhân, session state, hay thông tin thời gian thực đều là antipattern của semantic caching. Cách phòng ngừa: scope cache key theo từng user hoặc loại trừ rõ ràng các intent nhất định.

Đây cũng là lý do việc [xây dựng LLM evals tốt](/vi/blog/how-to-write-llm-evals-for-your-ai-product) trước khi deploy semantic caching trở nên quan trọng - bạn cần baseline để biết khi nào cached response thực sự tốt, không chỉ là nhanh.

## Kết hợp ba chiến lược

Suy cho cùng, hầu hết sản phẩm AI production đều hưởng lợi từ cả ba lớp làm việc cùng nhau:

| Lớp | Cache gì | Phù hợp nhất cho |
|---|---|---|
| Provider prompt caching | KV computation của system prompt | Mọi sản phẩm có system prompt tĩnh |
| Exact response cache | Toàn bộ cặp (prompt → response) | Prompt xác định, nội dung tĩnh |
| Semantic cache | Query tương đồng ý định | Tính năng hội thoại, help, FAQ |

Cải thiện latency chồng lên nhau theo từng lớp: provider caching giảm warm-up của model, exact caching loại bỏ hoàn toàn lời gọi LLM, semantic caching xử lý phần "đuôi dài" của những câu hỏi người dùng liên tục lặp lại.

Nếu mới bắt đầu, hãy thêm prompt caching trước - đây là thay đổi ít effort nhất với kết quả chắc chắn nhất. Sau đó mới layer thêm exact response caching cho các prompt lặp lại nhiều nhất. Để semantic caching cho khi bạn đã có solid evals và volume traffic đủ để biện hộ cho vector infrastructure.

## Điều cần chú ý

Caching có thể che giấu các prompt regression. Nếu bạn cập nhật system prompt nhưng cached response vẫn serve từ phiên bản cũ, người dùng nhận hành vi lỗi thời - và eval của bạn không bắt được.

Hãy xây dựng cache invalidation vào [pipeline phản hồi AI](/vi/blog/streaming-responses-ai-products) từ đầu - dù là versioning cache key theo prompt hash hay có bước "clear cache" thủ công trong release checklist. Đây là một phần của nguyên tắc mà cả mục [Building AI Products](/vi/blog/category/building-ai-products) đều nhấn mạnh: ship có chủ ý, đo lường với dữ liệu thật, invalidate một cách có suy nghĩ.

Mục tiêu là tốc độ và tiết kiệm - *mà không* che giấu những gì AI của bạn đang thực sự làm. Cache output. Đừng bao giờ cache hiểu biết.
