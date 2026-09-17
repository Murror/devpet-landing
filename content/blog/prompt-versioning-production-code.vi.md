---
title: "Prompt cũng là code - và cần được version hóa như vậy"
description: "Prompt của bạn sẽ thay đổi hàng chục lần sau khi ship. Đây là cách quản lý, test và deploy chúng như production code thực sự."
date: "2026-06-19"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["prompt-engineering", "llm", "ai-products", "production", "system-prompt", "ship"]
---

Có một khoảnh khắc quen thuộc trong vòng đời của mọi sản phẩm AI: ai đó chỉnh vài dòng trong system prompt, ship lên production, rồi một tuần sau bạn ngồi nhìn hàng loạt phàn nàn của người dùng mà không biết chuyện gì đã xảy ra.

Không phải API bị lỗi. Không phải dependency vừa cập nhật. Chỉ là một đoạn văn ngắn, được sửa với đầy tự tin - và đã âm thầm làm thay đổi toàn bộ hành vi của tính năng. Không có diff. Không có audit trail. Không có cách rollback.

**Vấn đề là**: prompt là code. Nhưng hầu hết các team không đối xử với nó như vậy - và sớm muộn gì cũng trả giá.

## Tại sao prompt thay đổi - và tại sao điều đó lại nguy hiểm

Khi lần đầu ship một tính năng AI, prompt thường là thứ khiến demo trông ổn. Rồi thực tế ập đến. Người dùng làm những điều không ai ngờ tới. Một edge case xuất hiện. Một thành viên trong team viết lại ngữ điệu vì cảm giác nó "hơi cứng." Model provider âm thầm cập nhật base model. Sản phẩm mở rộng thêm usecase mới và prompt được gắn thêm một đoạn vào cuối.

Đến tháng thứ ba, prompt đã trở thành một mớ vá víu mà không ai thực sự hiểu rõ - nằm đâu đó trong file `.env`, một dòng trong database, hoặc một trang Notion được chia sẻ. Khi có sự cố, chúng ta bắt đầu tìm kiếm trong Slack xem ai đã chỉnh cái này lần cuối.

Vấn đề không phải là prompt cần thay đổi - chúng phải thay đổi, đó là điều lành mạnh. Điều không lành mạnh là chúng thay đổi mà thiếu đi những công cụ giúp code evolve một cách có kiểm soát: lịch sử phiên bản, review, testing, và khả năng rollback.

## Versioning prompt có nghĩa là gì

Thật ra, versioning prompt không phức tạp: đối xử với prompt như là những artifact cần được theo dõi và kiểm soát - chứ không phải runtime config mà ai muốn sửa lúc nào cũng được.

Trong thực tế, điều này gói gọn trong bốn việc:

1. **Lưu prompt trong source control.** Không phải database, không phải `.env`, không phải spreadsheet. Một file `.txt` hoặc `.md` được commit vào repo, chỉnh sửa qua pull request như bất kỳ đoạn code nào khác.
2. **Đặt tên phiên bản rõ ràng.** `v1`, `v2`, hoặc content hash - không phải `final`, `final_v2`, hay `prompt_moi_chinh_chinh_nay`.
3. **Gắn mỗi thay đổi với một lý do.** Một câu trong commit message là đủ. "Thêm xử lý cho trường hợp input trống." "Rút ngắn response sau phản hồi của người dùng." Đây là audit trail của bạn.
4. **Chạy eval trước khi merge.** Thay đổi prompt mà không có eval cũng giống như merge code mà không có CI. Xem [Cách viết LLM eval cho AI product](/blog/how-to-write-llm-evals-for-your-ai-product) để có một setup tối giản chỉ mất một buổi chiều.

> Prompt nằm trong database thì dễ chỉnh - và chính sự tiện lợi đó là nguồn gốc của vấn đề. Khi càng dễ thay đổi mà không cần review, khả năng ai đó sẽ làm vậy càng cao, và khả năng ai đó nhận ra khi mọi thứ đi lệch lại càng thấp.

## Setup tối giản

Bạn không cần một nền tảng quản lý prompt chuyên dụng để làm tốt việc này. Một cấu trúc file phẳng và vài quy ước đủ để bắt đầu - kể cả với team nhỏ.

Đây là cấu trúc hoạt động tốt:

```
prompts/
  coaching-feedback.v1.md
  coaching-feedback.v2.md    ← hiện tại
  coding-hint.v1.md          ← hiện tại
```

Tên file làm rõ phiên bản ngay lập tức. Phiên bản hiện tại luôn là số cao nhất - không có `_final` hay `_prod`. Khi muốn thay đổi một prompt, bạn tạo file mới, chạy eval, rồi cập nhật reference trong một commit duy nhất.

Một loader đọc đúng file:

```python
def load_prompt(name: str, version: str = "latest") -> str:
    if version == "latest":
        files = sorted(Path("prompts").glob(f"{name}.v*.md"))
        path = files[-1]
    else:
        path = Path(f"prompts/{name}.{version}.md")
    return path.read_text()
```

Intentionally tối giản - vì giá trị không nằm ở tooling. Nó nằm ở kỷ luật: prompt được quản lý ở cùng một nơi, theo cùng một quy trình với phần còn lại của codebase.

## Staging và rollback

Hai tính năng tự nhiên xuất hiện khi có versioning - và mỗi cái đều đủ để justify toàn bộ quá trình setup.

**Staging.** Chạy phiên bản prompt mới trong môi trường shadow trước khi promote lên production. Bạn gọi cả phiên bản hiện tại lẫn phiên bản mới trên traffic thật - mà không expose response cho user - rồi so sánh output theo eval. Chỉ promote khi phiên bản mới nhất quán vượt qua.

**Rollback.** Nếu một prompt đang gây ra output xấu, rollback chỉ là thay đổi một dòng reference về phiên bản trước. So với việc phải đào bới Slack hay Notion tìm text cũ, hy vọng đó đúng là phiên bản cuối tốt, rồi ship hotfix trong lúc đang căng thẳng - một lệnh `git revert` trông hấp dẫn hơn nhiều.

Với những builder solo, chỉ riêng khả năng rollback đã đủ để justify cả quy trình. Bạn sẽ cần đến nó.

### Dynamic prompt thì sao?

Nhiều tính năng AI xây dựng prompt động - ghép user context, lịch sử hội thoại, tài liệu đã retrieve, hoặc output của tool vào một template lúc runtime.

Nguyên tắc versioning vẫn áp dụng - nhưng cho *template*, không phải chuỗi đã được lắp ghép. Template là artifact ổn định, cần được review. Phần động chỉ là input.

```python
TEMPLATE = load_prompt("coaching-feedback", "v2")

def build_prompt(user_code: str, error_message: str) -> str:
    return TEMPLATE.format(
        user_code=user_code,
        error_message=error_message
    )
```

Thứ thay đổi giữa các phiên bản là template: các instruction, persona, output constraints, giọng điệu. Thứ thay đổi lúc runtime là dữ liệu. Giữ hai thứ tách biệt và versioning vẫn khả thi dù tính năng ngày càng phức tạp hơn.

## Nơi giá trị thực sự nằm ở đó

Đáng nói là, sức mạnh thực sự của việc đối xử với prompt như code không phải ở cấu trúc file - mà là kỷ luật review đi kèm.

Khi một thay đổi prompt đến qua pull request, cả team có thể đọc diff từng từ, hỏi "tại sao" trước khi merge, yêu cầu eval pass như một điều kiện bắt buộc, và quan trọng hơn - link PR đến đúng user complaint hay product feedback đã dẫn đến thay đổi đó.

Context này tích lũy theo thời gian. Hai tháng sau, khi bạn đang debug một hành vi kỳ lạ và tự hỏi liệu prompt có luôn làm vậy không - bạn có thể trace ngược về PR, đọc lại discussion, và biết. Nếu không có version history, bạn chỉ có thể đoán.

Để có thêm góc nhìn về cách viết prompt có cấu trúc tốt ngay từ đầu, [Cách viết system prompt thực sự hoạt động trong production](/blog/system-prompts-that-work-in-production) là bước tiếp theo hữu ích - bài đó về phần viết, bài này về quy trình quản lý xung quanh nó. Bức tranh toàn cảnh hơn về chất lượng sản phẩm AI nằm ở mục [Building AI Products](/blog/category/building-ai-products), nơi ba yếu tố - prompt tốt, versioning, và eval - cộng hưởng với nhau.

## Bắt đầu từ đây

Nếu bạn đang ship một tính năng AI hôm nay và chưa có gì trong số này, hãy bắt đầu với một việc duy nhất: move prompt hiện tại vào một file trong repo, commit nó, và ghi lại mục đích của nó trong commit message. Đó là phiên bản một.

Mọi thứ khác - naming convention, eval gate, staging - có thể đến sau. Kỷ luật "prompt nằm trong source control" là phần khó nhất để thiết lập, và nó là nền tảng cho tất cả những gì tiếp theo.

---

Suy cho cùng, prompt thay đổi là vì sản phẩm thay đổi - và đó là điều tốt. Điều không tốt là thay đổi trong vô hình, không có lịch sử, không có review, không có cách undo. Những công cụ cần thiết đã có sẵn - chúng chính là thứ bạn vẫn dùng cho phần còn lại của codebase.
