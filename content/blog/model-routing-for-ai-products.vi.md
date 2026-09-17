---
title: "Model routing: chọn đúng LLM cho từng công việc trong sản phẩm"
description: "Sản phẩm AI thông minh không dùng một model cho tất cả mọi thứ. Đây là cách route giữa các LLM theo độ phức tạp của task — và tiết kiệm chi phí mà không đánh đổi chất lượng."
date: "2026-07-19"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["llm", "model-routing", "cost-optimization", "ai-products", "architecture", "building-ai-products"]
---

Khi bắt đầu build một sản phẩm AI, gần như ai cũng làm theo một quy trình giống nhau: chọn model mạnh nhất mình có thể dùng, dẫn toàn bộ request qua đó, rồi ship. Đơn giản, hiệu quả, và trong giai đoạn đầu, hoàn toàn hợp lý.

Vấn đề là ở giai đoạn sau.

Khi người dùng tăng lên, hóa ra mỗi tương tác đều có giá - và hóa ra bạn đang dùng model đắt nhất của mình để trả lời những câu hỏi như "hãy phân loại cảm xúc của câu này" hay "tóm tắt đoạn văn này thành một dòng". Đó là lúc khái niệm **model routing** bắt đầu xuất hiện trong cuộc trò chuyện của mọi team.

Model routing không phức tạp. Nhưng nó là một trong những thay đổi có tỷ lệ lợi nhuận cao nhất bạn có thể áp dụng khi sản phẩm đã qua giai đoạn demo.

## Thật ra model routing là gì?

Nói đơn giản: thay vì cho tất cả task chạy qua một model, bạn phân loại chúng rồi điều phối mỗi loại đến model phù hợp nhất — về cả chất lượng lẫn chi phí.

Trong thực tế, hầu hết sản phẩm chỉ cần hai hoặc ba tầng:

- **Tầng nhanh** — model nhỏ, độ trễ thấp (như Claude Haiku hoặc GPT-4o mini): phân loại intent, tóm tắt ngắn, trích xuất thực thể, bất kỳ thứ gì chỉ cần *đúng* mà không cần *sâu sắc*.
- **Tầng chuẩn** — model tầm trung (Claude Sonnet, GPT-4o): những task cần sinh ra nhiều đoạn văn liền mạch, lập luận nhẹ, hoặc làm theo hướng dẫn phức tạp hơn.
- **Tầng mạnh** — model đỉnh nhất bạn có (Claude Opus, o1): dành riêng cho những thứ thực sự cần chiều sâu — review code phức tạp, phân tích kiến trúc, phản hồi nhiều lớp.

Điểm mấu chốt là: **độ phức tạp của task không phân bổ đều trong sản phẩm**. Phần lớn request thực ra rất đơn giản. Chỉ một số ít thực sự cần đến sức mạnh tối đa. Routing cho phép bạn khớp chi phí với nhu cầu thực tế, thay vì trả giá cao nhất cho mọi thứ.

## Làm thế nào để biết task nào thuộc tầng nào?

Hãy bắt đầu bằng cách liệt kê tất cả các AI call trong sản phẩm. Với mỗi call, đặt câu hỏi: *nếu model đưa ra câu trả lời sai, hậu quả là gì?*

Một tin nhắn chào hỏi được cá nhân hóa theo tên người dùng? Sai một chút cũng không sao — model nhỏ là đủ. Một lần review code cần phát hiện lỗi logic tinh vi trong 300 dòng? Đó là task tầng mạnh — một câu trả lời sai nhưng tự tin sẽ tệ hơn nhiều so với một câu trả lời chậm hơn nhưng đúng.

Một vài nguyên tắc thực tế:

- **Độ dài output là tín hiệu của độ phức tạp.** Task chỉ cần trả về một hoặc hai câu — model nhỏ xử lý được. Task cần sinh ra nhiều đoạn lập luận có cấu trúc — hãy nâng tầng.
- **Trích xuất thông tin rẻ hơn sinh nội dung.** Lấy các trường cụ thể từ văn bản (phân loại cảm xúc, trích xuất thực thể, kiểm tra schema) thường nằm trong khả năng của model nhỏ.
- **Khi người dùng đặt niềm tin trực tiếp vào output, đừng route xuống tầng rẻ.** Nếu một câu trả lời sai sẽ khiến người dùng mất tin tưởng vào sản phẩm, tầng mạnh là khoản đầu tư đáng giá.

## Xây một routing layer đơn giản

Cách triển khai nhanh nhất là một hàm nhận vào loại task và trả về model ID. Không cần gì phức tạp:

```typescript
type TaskTier = 'fast' | 'standard' | 'power'

const MODEL_FOR_TIER: Record<TaskTier, string> = {
  fast:     'claude-haiku-4-5-20251001',
  standard: 'claude-sonnet-5',
  power:    'claude-opus-4-8',
}

function routeToModel(taskType: string): string {
  const tier = TASK_TIERS[taskType] ?? 'standard'
  return MODEL_FOR_TIER[tier]
}

const TASK_TIERS: Record<string, TaskTier> = {
  'intent-detect':      'fast',
  'short-summary':      'fast',
  'content-classify':   'fast',
  'draft-reply':        'standard',
  'explain-concept':    'standard',
  'code-review':        'power',
  'architecture-plan':  'power',
}
```

Code này có vẻ "quá bình thường" — và đó chính xác là điều tốt. Routing logic được đặt ở một nơi, dễ đọc, dễ thay đổi, và có thể được version control cùng phần còn lại của codebase. Không có lớp inference nào ẩn đằng sau quyết định API đang chạy ở đâu.

> Đây cũng là nơi để thêm fallback. Nếu model tầng mạnh timeout hoặc lỗi, bạn có thể retry ở tầng chuẩn thay vì trả về lỗi cho user - một response hơi kém hơn bao giờ cũng tốt hơn không có response.

Khi bạn hiểu hơn về workload thực tế, bạn điều chỉnh map đó. Task ban đầu đặt ở `fast` có thể được nâng lên `standard` khi bạn phát hiện edge case. Task từng cần `power` có thể hạ xuống `standard` sau khi test chứng minh chất lượng vẫn giữ được. Routing map không phải là quyết định một lần - nó là sản phẩm sống.

## Bài toán kinh tế phía sau

Số liệu cụ thể thay đổi theo từng provider và thời điểm, nhưng hình dạng của vấn đề khá nhất quán: tầng nhanh thường có chi phí thấp hơn tầng mạnh đáng kể - có thể là 5x đến 20x. Nếu 70% request của bạn thuộc loại đơn giản và có thể xử lý bởi model nhỏ, thì chi phí tổng thể sẽ giảm mạnh chỉ từ một thay đổi kiến trúc duy nhất.

Nhưng đôi khi, lợi ích về **độ trễ** còn quan trọng hơn chi phí. Model nhỏ trả lời nhanh hơn - thường nhanh hơn đáng kể. Với những tương tác trực tiếp với người dùng, việc một câu trả lời đơn giản trả về trong dưới một giây thay vì bốn giây có thể tạo ra sự khác biệt lớn về cảm nhận chất lượng của sản phẩm.

## Những chỗ dễ vấp

**Đừng phân loại mọi request động bằng một LLM call khác.** Nếu bạn cần gọi một model chỉ để quyết định sẽ gọi model nào, bạn vừa tăng thêm chi phí và độ trễ trước khi task thực sự bắt đầu. Với task type đã biết trước — một nút bấm trong UI, một form có cấu trúc — rule-based routing là đủ và hiệu quả hơn nhiều.

**Task classification bị mờ dần theo thời gian.** Một task bạn phân loại là "đơn giản" rồi sẽ nhận được input phức tạp. Hãy theo dõi những lúc output từ tầng nhanh bị người dùng đánh dấu là sai, và dùng tín hiệu đó để reclassify.

**Thực sự test model rẻ hơn trước khi kết luận nó không đủ tốt.** Nhất là với những task có cấu trúc rõ ràng, bạn có thể bất ngờ về chất lượng của model nhỏ. Xem thêm hướng dẫn về [cách viết LLM eval cho sản phẩm AI](/vi/blog/how-to-write-llm-evals-for-your-ai-product) để có quy trình so sánh thực tế.

**Giữ routing logic ở một chỗ.** Logic routing bị rải rác trong codebase — kiểu `if environment === 'prod' dùng model rẻ hơn` — là cách nhanh nhất để biến routing thành nợ kỹ thuật. Map tập trung như ví dụ trên khiến mọi quyết định có thể quan sát và kiểm tra được.

## Điểm bắt đầu thực tế nhất

Nếu đây là lần đầu bạn làm model routing, hãy bắt đầu với đúng hai tầng — không phải ba. Chọn một hoặc hai task trong sản phẩm mà bạn tự tin là đơn giản và có cấu trúc rõ ràng. Chuyển những task đó xuống tầng nhanh. Đo chất lượng. Nếu ổn, mở rộng danh sách.

Đừng cố route mọi thứ ngay từ đầu. Mục tiêu là thiết lập infrastructure và thói quen đo lường, rồi từ đó lặp lại. Routing map chỉ là một dictionary - nó sẽ ngày càng tốt hơn khi bạn hiểu rõ hơn về workload thực tế của mình.

Kết hợp routing với [caching response](/vi/blog/caching-llm-responses-in-production) sẽ tạo ra hiệu ứng cộng hưởng: route task đơn giản xuống model nhỏ, rồi cache kết quả cho những input lặp lại. Đó là lúc bài toán kinh tế thực sự trở nên hấp dẫn. Còn nhiều bài viết liên quan trong chuyên mục [Xây dựng sản phẩm AI](/vi/blog/category/building-ai-products).

Suy cho cùng, hầu hết sản phẩm AI đều có những task không cần đến model mạnh nhất. Tìm ra những task đó và route đúng chỗ - đó là một trong những cải tiến ít rủi ro nhất nhưng có tác động lớn nhất bạn có thể làm. Bắt đầu nhỏ, đo mọi thứ, và để dữ liệu chỉ cho bạn biết khi nào cần escalate.
