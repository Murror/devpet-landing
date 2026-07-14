---
title: "Vòng lặp cải tiến: làm sao để tính năng AI ngày càng tốt hơn sau khi ra mắt"
description: "Hầu hết sản phẩm AI chững lại ngay sau khi ra mắt. Đây là cách xây vòng lặp cải tiến thực sự: logging, tagging output, tìm mẫu lỗi, và tinh chỉnh prompt liên tục."
date: "2026-07-14"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai-product", "feedback-loop", "prompt-engineering", "production", "iteration"]
---

Có một khoảng thời gian kỳ lạ xảy ra sau khi bạn ship một tính năng AI.

Trước đó, mọi thứ rất rõ ràng — viết system prompt, test edge case, điều chỉnh output format, rồi deploy. Cái cảm giác được làm việc cụ thể, có tiến độ rõ ràng. Nhưng sau khi feature lên production, một sự mơ hồ kỳ lạ xuất hiện - và phần lớn builder lặng lẽ chuyển sang việc tiếp theo. Những output yếu, những use case chưa được nghĩ đến, những lần model trả lời lạc đề: chúng tích tụ trong im lặng, từ từ bào mòn niềm tin của người dùng mà không ai nhận ra.

Điều thú vị là, những builder xây được AI feature mà người dùng thật sự tin tưởng không phải là những người viết được prompt hoàn hảo ngay từ đầu. Đó là những người biết cách xây vòng lặp.

## Ghi lại mọi thứ — trước khi bạn cần đến chúng

Sai lầm đầu tiên hầu hết team mắc phải không phải là kỹ thuật, mà là thói quen: không log AI interaction, hoặc chỉ log đủ cho mục đích tính phí.

Vấn đề là bạn không thể biết mình cần debug cái gì cho đến khi nó hỏng - mà với AI product, nó gần như chắc chắn sẽ hỏng theo những cách bạn không đoán trước được. Vì vậy, cách an toàn nhất là log càng nhiều càng tốt ngay từ ngày đầu, trong khi việc bổ sung infrastructure còn đơn giản.

Tối thiểu cần capture:

- **Toàn bộ prompt** (system + messages), đúng như gửi đến model
- **Response gốc của model**, trước khi qua bất kỳ bước post-processing nào
- **Model và các tham số** (temperature, phiên bản model...)
- **Session ID** để có thể dựng lại ngữ cảnh cuộc hội thoại
- **Timestamp**, để đối chiếu với thời điểm deploy khi xảy ra sự cố

```json
{
  "id": "msg_01abc",
  "model": "claude-sonnet-5",
  "timestamp": "2026-07-14T09:31:00Z",
  "prompt_tokens": 1842,
  "system_prompt_hash": "a9f3...",
  "input": "...",
  "output": "...",
  "session_id": "user_9281_session_47"
}
```

Hash system prompt thay vì lưu nguyên văn giúp log gọn hơn đáng kể, trong khi vẫn xác định được chính xác phiên bản prompt nào đang chạy khi lỗi xảy ra.

Nếu bạn xử lý dữ liệu nhạy cảm hoặc có user ở EU, bạn sẽ cần chính sách retention và quy trình redaction - nhưng infrastructure logging cần được dựng lên trước những cuộc trò chuyện đó, chứ không phải sau khi có sự cố.

## Gắn nhãn output: tốt hay chưa tốt

Log cho bạn biết *chuyện gì đã xảy ra*. Nhãn mới cho bạn biết *nó diễn ra thế nào*.

Cách đơn giản nhất là thêm nút thumbs-up / thumbs-down cạnh mỗi output AI. Một click, người dùng phản hồi ngay. Đây là nguồn dữ liệu có nhãn mà bạn không tốn công thu thập.

Nhưng tín hiệu từ người dùng có điểm mù đáng kể - những ai bounce vì output kém chẳng bao giờ dừng lại để rate nó. Vì vậy, cần kết hợp thêm tín hiệu hành vi ngầm định:

- Người dùng có copy output không? (thường là tốt)
- Họ có chỉnh sửa nó ngay lập tức không? (tín hiệu lẫn lộn)
- Họ có xóa hết và gõ lại từ đầu không? (gần như chắc chắn là tệ)
- Họ có thử lại cùng một prompt không? (hầu như chắc chắn là tệ)

Kết hợp đánh giá tường minh và hành vi ngầm định sẽ cho bạn bức tranh phong phú hơn nhiều so với từng loại đơn lẻ. Mục tiêu không phải là một dataset hoàn hảo - mà là có một "bucket output chưa tốt" đáng tin cậy để đào sâu vào khi cần.

## Tìm ra mẫu lỗi — không phải từng lỗi riêng lẻ

Khi đã có một loạt output bị flag, công việc thật sự mới bắt đầu: hiểu *tại sao* chúng thất bại.

Đừng nhìn từng trường hợp một cách riêng biệt. Câu hỏi cần đặt ra mang tính cấu trúc hơn: *có loại lỗi nào cứ lặp đi lặp lại không?* Một số pattern hay gặp trong thực tế:

- **Format drift** — model bỏ qua cấu trúc output bạn chỉ định khi input quá dài hoặc phức tạp
- **Context blindness** — model bỏ qua ngữ cảnh từ trước trong cuộc hội thoại, chỉ tập trung vào tin nhắn gần nhất
- **Edge-case collapse** — một kiểu input cụ thể (câu hỏi diễn đạt theo một cách nhất định, input không phải tiếng Anh, đoạn code được nhúng vào) liên tục cho output yếu hơn rõ rệt
- **Instruction conflict** — system prompt có mâu thuẫn ngầm mà model giải quyết theo các hướng khác nhau tùy từng ngữ cảnh

Nhóm lỗi theo pattern, không theo ví dụ. Hai mươi lỗi trông có vẻ khác nhau hoàn toàn đôi khi đều xuất phát từ cùng một vấn đề gốc rễ. Sửa nguyên nhân gốc - đó mới là đòn bẩy thật sự.

## Biến mỗi lỗi thành một eval

Đây là bước phần lớn builder bỏ qua, và cũng là bước tạo ra hiệu ứng kép đáng kể nhất theo thời gian.

Mỗi failure pattern bạn xác định được chính là cơ hội để viết eval: một bài test có thể bắt đúng loại lỗi đó trong tương lai. Nếu bạn phát hiện model tạo ra danh sách bullet points khi người dùng hỏi tiếp (thay vì viết dạng văn xuôi như được yêu cầu), hãy viết một test cụ thể cho điều đó.

```python
def test_followup_produces_prose():
    response = call_model(
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": "Giải thích về mạng neural"},
            {"role": "assistant", "content": "..."},
            {"role": "user", "content": "Cho tôi xem một ví dụ được không?"}
        ]
    )
    assert not response.startswith("- "), "Follow-up tạo ra bullets, mong đợi văn xuôi"
```

Chỉ cần mười đến hai mươi bài test như vậy - được rút ra trực tiếp từ lỗi production thực tế - là đủ để biến việc điều chỉnh prompt từ một trò đoán mò thành quy trình có phương pháp. Để xây dựng hệ thống eval bài bản hơn từ đầu, [cách viết LLM eval cho AI product](/vi/blog/how-to-write-llm-evals-for-your-ai-product) sẽ đi sâu vào phần này.

## Đóng vòng lặp: tinh chỉnh, test, ship

Đến đây, bạn có thể iterate với sự tự tin thật sự.

Bạn đã có failure pattern cụ thể. Đã có eval để tái hiện nó. Thử một thay đổi trong prompt, chạy eval, kiểm tra xem lỗi đã được giải quyết chưa - đồng thời xem có lỗi mới nào xuất hiện không. Đây là vòng lặp khiến AI feature thật sự tiến bộ theo thời gian, thay vì cứ mãi "mắc kẹt" ở mức chất lượng lúc ra mắt.

Một vài điều giúp quá trình này bớt đau đầu hơn trong thực tế:

- **Version prompt cùng với code.** Thay đổi system prompt là thay đổi code — nó cần được review và theo dõi trong lịch sử phiên bản. [Quản lý phiên bản prompt cho production](/vi/blog/prompt-versioning-production-code) hướng dẫn cách thiết lập điều này một cách thực tế.
- **Giữ eval suite đủ nhỏ để chạy được trong mỗi lần deploy.** Nếu chạy mất mười phút, bạn sẽ không chạy nó — đó là sự thật phũ phàng mà ai cũng hiểu khi deadline đến. Mười lăm test tập trung luôn tốt hơn một trăm test chậm.
- **Ship thay đổi prompt theo từng bước.** A/B test khi có thể. Nếu user base đủ lớn, thử nghiệm với 10% người dùng trước khi tung ra toàn bộ là lựa chọn khôn ngoan.

> Những kỹ sư xây được AI feature đáng tin cậy không phải là những người viết đúng prompt ngay từ đầu - họ là những người giỏi tìm ra cái gì đang sai và sửa nó trước khi người dùng nhận ra pattern.

## Vòng lặp chính là sản phẩm

Suy cho cùng, phần lớn AI feature ra mắt ở khoảng 70% tiềm năng thật sự của mình. 30% còn lại nằm trong vòng lặp — trong những quan sát bạn thu thập được, những pattern bạn nhận ra, những eval bạn xây dựng, và những thay đổi prompt bạn thực hiện tháng này qua tháng khác.

Ranh giới giữa một AI feature mà người dùng dần tin tưởng và một feature họ lặng lẽ ngừng dùng thường nằm ở đây: team đó có coi việc ship là điểm kết thúc, hay là phát súng bắt đầu?

Xây logging. Xây tagging. Xây eval. Không phải vì bạn cần chúng ngay từ ngày đầu - mà vì khi cần đến, và chắc chắn bạn sẽ cần, dữ liệu đã có sẵn ở đó chờ bạn rồi.

Vòng lặp - đó mới là thứ biến một feature thành một sản phẩm thực sự.
