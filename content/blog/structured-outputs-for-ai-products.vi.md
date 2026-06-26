---
title: "Structured output: lớp đáng tin cậy mà sản phẩm AI của bạn đang thiếu"
description: "Văn bản tự do từ LLM ổn khi làm chatbot. Nhưng khi bạn parse AI response trong code, structured output không còn là tùy chọn nữa."
date: "2026-06-26"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["structured-outputs", "llm", "ai-products", "json-mode", "reliability", "ship"]
---

Có một khoảnh khắc khá kinh điển trong hành trình xây sản phẩm AI - khi bạn ngồi nhìn output của model và nhận ra rằng nó hoàn toàn không thể dùng được theo cách bạn muốn.

Thường thì nó diễn ra như thế này: bạn xây một tính năng phân tích code của người dùng, yêu cầu model trả về điểm độ khó, danh sách lỗi cụ thể, và gợi ý bước tiếp theo. Model trả về... một đoạn văn. Không phải một object có cấu trúc - một đoạn văn, trong đó điểm khó được nhúng vào câu thứ hai, các lỗi rải rác trong prose, còn gợi ý thì nằm đâu đó ở cuối. Bạn viết parser. Parser xử lý được 70% response. 30% còn lại phá vỡ tính năng theo những cách rất khó giải thích với người dùng.

Đó là lúc structured output trở thành từ khóa quan trọng trong cuộc đời của bạn.

## Structured output là gì

Mặc định, language model trả về văn bản tự do - response trông giống đoạn hội thoại, không phải một object mà máy tính có thể đọc được. Structured output là khi bạn ràng buộc response đó vào một hình dạng có thể đoán trước: thường là JSON, đôi khi là Markdown với schema cụ thể, hoặc thậm chí một trường duy nhất có kiểu dữ liệu rõ ràng.

API của các model hiện đại cung cấp một vài cách để đạt được điều này:

- **JSON mode.** Bảo model trả về JSON hợp lệ. Hầu hết API lớn đều hỗ trợ - nó ngăn JSON bị lỗi cú pháp, nhưng không kiểm soát được các trường nào cần có mặt.
- **Function calling / tool use.** Bạn định nghĩa schema của một "hàm" với các tham số có kiểu dữ liệu cụ thể, model "gọi" hàm đó bằng cách trả về các giá trị khớp. API validate hình dạng trước khi response đến tay bạn.
- **Schema-constrained generation.** Một số runtime mã nguồn mở cho phép định nghĩa JSON Schema rồi điều hướng quá trình sinh token để đảm bảo output tuân theo. Chậm hơn, nhưng chắc chắn hơn.
- **Structured output schemas.** Các provider như Anthropic và OpenAI hiện cho phép bạn truyền JSON Schema kèm theo request, và họ đảm bảo response khớp với schema đó.

Với phần lớn builders, lựa chọn thực tế là giữa JSON mode (đơn giản, nhanh, nhưng không hoàn toàn đáng tin) và schema-constrained output (thêm một chút overhead, nhưng đáng tin cậy hơn đáng kể).

## Khi nào bạn thực sự cần structured output

Không phải mọi AI call đều cần. Tính năng tạo ra giải thích dạng văn bản cho người mới học không cần JSON - "output" đó chính là thứ người dùng đọc trực tiếp. Structured output thêm giá trị khi:

**Bạn đang parse output trong code.** Nếu server của bạn cần đọc một trường cụ thể từ response, bất kỳ sự lệch lạc nào so với hình dạng mong đợi đều dẫn đến runtime error hoặc silent failure - và silent failure là loại tệ nhất, vì bạn không biết có chuyện gì xảy ra.

**Bạn đang chain các AI call với nhau.** Nếu output của một call trở thành input context cho call tiếp theo, hình dạng lỏng lẻo ở vòng đầu tiên sẽ nhân lên thành dữ liệu rác ở vòng hai. Hãy định nghĩa schema từ sớm.

**Bạn đang render response thành UI components.** Danh sách các lỗi cụ thể khác hoàn toàn so với đoạn văn nói *về* các lỗi - UI của bạn cần những item riêng biệt để render thành card, badge, hoặc checkbox.

**Bạn cần lưu và query output.** Nếu đang persist AI-generated metadata vào database, bạn cần các trường có thể index và filter một cách đáng tin cậy.

## Pattern triển khai cơ bản

Giả sử bạn xây tính năng review code của người mới và cần trả về: điểm độ khó (1–5), tối đa ba lỗi cụ thể, và một bước hành động tiếp theo.

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "code_review",
        "description": "Return a structured review of the user's code.",
        "input_schema": {
            "type": "object",
            "properties": {
                "difficulty": {
                    "type": "integer",
                    "description": "Điểm độ khó từ 1 (đơn giản) đến 5 (phức tạp)",
                    "minimum": 1,
                    "maximum": 5
                },
                "issues": {
                    "type": "array",
                    "items": {"type": "string"},
                    "maxItems": 3,
                    "description": "Các lỗi cụ thể tìm thấy trong code"
                },
                "next_step": {
                    "type": "string",
                    "description": "Một điều cụ thể người dùng nên thử tiếp theo"
                }
            },
            "required": ["difficulty", "issues", "next_step"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "code_review"},
    messages=[
        {
            "role": "user",
            "content": f"Review đoạn Python này:\n\n{user_code}"
        }
    ]
)

# Model bị buộc phải dùng tool — lấy structured input
review = response.content[0].input
print(review["difficulty"], review["issues"], review["next_step"])
```

Tham số `tool_choice` buộc model phải sử dụng tool - điều này đảm bảo hình dạng của response. Code của bạn có thể tin tưởng rằng các trường luôn có mặt.

## Giới hạn của structured output

Structured output giải quyết vấn đề về hình dạng. Nó không giải quyết vấn đề về chất lượng.

Điều thú vị là model vẫn có thể trả về JSON hoàn toàn hợp lệ với `difficulty` là 3, hai lỗi nghe có vẻ hợp lý, và một next_step - nhưng sai về cả ba. Schema validate container, không validate nội dung bên trong.

Đây là lý do structured output và [LLM eval](/vi/blog/how-to-write-llm-evals-for-your-ai-product) đi đôi với nhau tự nhiên: khi bạn đã có thể parse output thành các trường cụ thể, bạn có thể viết kiểm tra tự động cho những trường đó. Điểm `difficulty` có tương quan với độ phức tạp của code không? Các `issues` có thực sự cụ thể không, hay chỉ là lời nhận xét chung chung? `next_step` có thực sự là thứ người mới bắt đầu có thể làm được không?

Hình dạng làm cho nội dung trở nên kiểm tra được. Còn việc kiểm tra - vẫn là việc của bạn.

> Structured output là sự khác biệt giữa "tính năng AI của tôi đôi khi hoạt động" và "tính năng AI của tôi hoạt động, và tôi biết chính xác nó trả về gì mỗi lần."

## Validation: khi cấu trúc vẫn trượt

Dù đã có constraint, production vẫn sẽ làm bạn bất ngờ. Model thường trả về ba trường, đôi khi chỉ hai. Trường integer đột nhiên là string. Trường required bị null.

Một vài pattern phòng thủ đáng học:

- **Luôn validate phía server, kể cả khi đã có schema enforcement.** Hãy coi AI output như user input - xác minh trước khi dùng.
- **Định nghĩa fallback cho từng trường.** Nếu `difficulty` bị thiếu, default về null và hiển thị message generic thay vì crash.
- **Log schema violations.** Khi response không khớp schema, log raw output. Bạn sẽ nhanh chóng nhận ra pattern: edge case nào hay xảy ra, input nào liên tục làm model bị trượt.
- **Thêm retry wrapper.** Với các non-streaming call, retry khi validation fail - kèm một nudge nhẹ trong follow-up message - sẽ bắt được phần lớn trường hợp lệch mà không ảnh hưởng đến người dùng.

## Đừng over-engineer schema

Có một cám dỗ hay gặp là định nghĩa schema khổng lồ - hai mươi trường cho mọi thông tin có thể mà model sẽ sản sinh. Suy cho cùng, điều đó nghe rất hợp lý - "tốt hơn là có quá nhiều hơn quá ít." Nhưng thực tế lại ngược lại.

Càng nhiều trường bắt buộc, model càng phải "điền vào chỗ trống" nhiều hơn - và xác suất hallucinate giá trị cho những trường nó không có dữ liệu chắc chắn sẽ càng cao. Hãy giữ schema gọn: chỉ định nghĩa các trường bạn thực sự dùng trong application code. Nếu bạn thêm một trường "phòng trường hợp cần", đó là dấu hiệu schema đang đi trước sản phẩm của bạn.

Bắt đầu với ba đến năm trường. Thêm khi UI hoặc logic downstream thực sự cần đến.

---

Structured output biến AI response từ văn bản thô thành application data - thứ mà code của bạn có thể tin cậy, UI của bạn có thể render nhất quán, và eval suite của bạn có thể kiểm tra theo tiêu chí cụ thể. Đó thường là khoảng cách thực tế giữa một AI experiment và một AI product được ship.

Để hiểu thêm về cách làm cho AI feature vững chắc hơn dưới tải thật, [How to Write System Prompts That Actually Work in Production](/vi/blog/system-prompts-that-work-in-production) là bài đọc bổ sung tự nhiên. Và nếu bạn đang xây dựng trong lĩnh vực [AI Products](/vi/blog/category/building-ai-products), có nhiều pattern từ thực tế product work đang được chia sẻ ở đó.
