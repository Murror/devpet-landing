---
title: "Cách viết eval cho sản phẩm AI trước khi ship"
description: "Ship tính năng AI mà chưa có eval là đang đoán mò. Đây là một framework nhẹ — golden input, rubric rõ ràng, một lần chấm điểm — có thể xây trong một buổi chiều."
date: "2026-06-13"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["evals", "llm", "testing", "ai-products", "prompt-engineering", "ship"]
---

Ship một tính năng AI khác với ship code thông thường. Bạn demo cho vài người, nhận được những cái gật đầu tán thành, rồi đẩy lên production. Câu trả lời trông ổn; giọng điệu có vẻ đúng. Hai tuần sau, người dùng bắt đầu hỏi những câu lạ, support queue phình ra, và bạn ngồi nhìn chằm chằm vào các output - tự hỏi có điều gì thay đổi không.

Thật ra không có gì thay đổi cả. Vấn đề là bạn chưa từng định nghĩa "tốt" có nghĩa là gì ngay từ đầu.

Đó chính xác là khoảng trống mà eval lấp đầy.

## Eval là gì - theo nghĩa thực tế

Eval là bộ test case dành riêng cho hành vi của language model. Đơn giản nhất, nó là một danh sách đầu vào đi kèm với kết quả kỳ vọng - hoặc phổ biến hơn, với *tiêu chí* để đánh giá xem một output có đạt yêu cầu không.

Test truyền thống thường nhị phân: hàm trả về 42 hay không. Eval lại đo những thứ mơ hồ hơn nhiều. Response này có thực sự hữu ích không? Nó có đi lạc chủ đề không? Giọng điệu có vừa khuyến khích vừa không nghe sáo rỗng không? Đây không phải câu hỏi có đáp án đơn giản, và đó chính là lý do hầu hết các team cứ đẩy chúng lại "sau này" - mà sau này không bao giờ đến.

Có ba dạng eval đáng chú ý:

- **Exact-match.** Với những output cố định — JSON có cấu trúc, nhãn phân loại, một định dạng cụ thể — bạn kiểm tra xem output có khớp chính xác với giá trị kỳ vọng không.
- **Rubric-based.** Bạn viết ra tiêu chí cụ thể cho một response tốt — ví dụ: "đề xuất ít nhất một bước hành động cụ thể" hay "không xin lỗi quá một lần" — rồi chấm theo tiêu chí đó, bằng tay hoặc nhờ một LLM call riêng.
- **Regression.** Bạn có tập input mà trước đây đã cho kết quả chấp nhận được. Sau mỗi lần thay đổi prompt, bạn chạy lại để chắc chắn không có gì bị hỏng.

Hầu hết các product team cần cả ba dạng này. Nhưng nếu đang bắt đầu từ zero, hãy bắt đầu với rubric-based - đó là dạng dạy bạn nhiều nhất về sản phẩm của mình.

## Tại sao team lại bỏ qua eval

Lý do thật ra khá đơn giản: eval nghe có vẻ học thuật. Nó gợi đến nghiên cứu khoa học hoặc ML platform hơn là cái sprint mà bạn vừa phải build onboarding flow vừa fix bug push notification.

Ngoài ra, không ai thực sự "sở hữu" việc này. ML engineer nghĩ eval là vấn đề của model quality. Product manager nghĩ đó là QA. Designer thì không có mặt trong cuộc trò chuyện. Kết quả là ticket không ai nhặt.

Và rồi có cái suy nghĩ quen thuộc: "tôi sẽ nhận ra response tệ ngay khi thấy nó." Điều đó đúng khi bạn đọc output thủ công, khi mọi thứ còn nhỏ. Nó không còn đúng nữa ở lần thay đổi prompt thứ hai, lần điều chỉnh parameter thứ ba, hay cái version được đẩy lên lúc 11 giờ đêm thứ Sáu.

> Khi có nhiều hơn một người chạm vào prompt, bạn cần tiêu chí được viết ra. Nếu không, "tốt" sẽ có nghĩa khác nhau với từng người trong team.

## Phương pháp 10 golden input

Đây là framework eval đơn giản nhất mà bạn có thể xây trong một buổi chiều:

**1. Viết 10 input đại diện.** Hãy nghĩ đến toàn bộ phổ người dùng thực tế — người mới bắt đầu hỏi điều gì đó ngây thơ, chuyên gia hỏi điều gì đó sắc sảo, người dùng đang bực bội, người dùng mù mờ về nhu cầu của mình. Viết ví dụ thực tế, không phải category trừu tượng.

**2. Với mỗi input, viết tiêu chí đạt.** Không phải "response tốt" mà là thứ có thể kiểm tra được. "Có ví dụ code cụ thể." "Không ngụ ý rằng user đang sai." "Trả lời trong vòng 100 từ." "Kết thúc bằng một câu hỏi giúp user đi sâu hơn." Càng cụ thể càng tốt.

**3. Thêm 2–3 edge case.** Input trống. Input hoàn toàn không liên quan đến tính năng. Input dài gấp ba lần bình thường. Đây là những trường hợp để xem sản phẩm có "vỡ trận" khi gặp điều bất thường không.

**4. Chạy sau mỗi lần thay đổi prompt.** Không chỉ trước khi launch - mà trước mỗi lần thay đổi. Một prompt regression tệ không kém gì code regression, và thường xuyên hơn bạn nghĩ.

Dưới đây là cấu trúc tối giản:

```python
evals = [
    {
        "input": "Tôi không biết bắt đầu từ đâu với project này",
        "criteria": [
            "gợi ý một bước đầu tiên cụ thể",
            "không dội cho user quá nhiều lựa chọn"
        ]
    },
    {
        "input": "",
        "criteria": [
            "xử lý khéo léo",
            "không crash hoặc trả về rỗng"
        ]
    },
]

for case in evals:
    response = call_your_llm(case["input"])
    # chấm điểm theo tiêu chí — thủ công trước, tự động sau
    print(response)
```

Bước chấm điểm - thủ công hay tự động - tùy bạn. Hãy bắt đầu bằng tay. Việc đọc từng output và đối chiếu với tiêu chí đã viết sẵn sẽ dạy bạn nhiều hơn bất kỳ dashboard nào.

## LLM-as-judge: khi nào nên dùng, khi nào cẩn thận

Khi tập eval đã lớn hơn khoảng 50 case, chấm tay trở thành nút thắt thực sự. LLM-as-judge là giải pháp tự nhiên: bạn truyền input, output và rubric vào một model call riêng, rồi nhờ nó chấm theo thang điểm đơn giản.

Cách này hoạt động tốt khi cần phát hiện những lỗi rõ ràng — response lạc đề, định dạng bị vỡ, vi phạm một quy tắc phong cách đã viết rõ. Cũng hữu ích khi cần đánh giá giọng điệu ở quy mô lớn: response có nghe khuyến khích không, có quá dài dòng không, có dùng jargon không cần thiết không.

Đáng nói là: LLM judge thường đánh giá cao những response nghe trơn tru và tự tin, dù bên trong có chứa lỗi tinh vi. Nó cũng có thiên kiến về vị trí — nếu cho so sánh hai lựa chọn, nó có xu hướng ưu tiên cái đầu tiên nhiều hơn xác suất ngẫu nhiên cho phép. Và nó có vấn đề sycophancy kinh điển: nhờ nó chấm output của chính nó, điểm số sẽ khá hào phóng.

Nguyên tắc đơn giản: dùng LLM-as-judge cho kiểm tra format và phong cách; với những thứ liên quan đến độ chính xác hay chất lượng học thuật, hãy tự tay đọc.

## Regression - phần thực sự tích lũy giá trị

Giá trị thực của eval không nằm ở việc bắt lỗi trước khi launch - mà là biết được khi nào một thay đổi prompt làm hỏng thứ trước đó vẫn chạy tốt.

Giải pháp đơn giản: sau mỗi lần deploy prompt, chạy tập golden của bạn và ghi lại pass/fail cho từng tiêu chí. Khi một test trước đó pass bỗng nhiên fail, bạn có một regression cụ thể để điều tra. Không còn chuyện "hình như lúc test vẫn ổn" — bạn có diff.

Ở Codepet, chúng tôi chạy một tập eval nhỏ trước mỗi thay đổi liên quan đến chất lượng feedback. Chưa đến hai mươi case, phần lớn là rubric-based, và nó đã bắt được nhiều regression hơn chúng tôi kỳ vọng - bao gồm một lần mà thay đổi prompt chúng tôi rất tự tin đã lặng lẽ làm câu trả lời bị cụt giữa chừng trên context window ngắn.

## Năm eval đầu tiên - bắt đầu từ đây

Nếu chưa biết bắt đầu từ đâu, đây là danh sách tối giản để chạy được thứ gì đó ngay hôm nay:

- **Happy path.** Một input điển hình, đầy đủ. Output có làm đúng việc của nó không?
- **Input mơ hồ.** User mô tả nhu cầu rất mờ nhạt. Output có hỏi lại để làm rõ thay vì đoán bừa không?
- **Input lạc đề.** Thứ gì đó hoàn toàn ngoài phạm vi tính năng. Output có redirect khéo léo không?
- **Input dài.** Gấp ba lần độ dài thông thường. Output có giữ được mạch lạc, hay bắt đầu cẩu thả ở cuối không?
- **Input nhạy cảm.** Điều gì đó có thể đi sai — sự bực bội, gợi ý về sự tự ti, một chủ đề nặng nề. Output có xử lý với sự cẩn trọng phù hợp không?

Đó là điểm xuất phát. Tuần sau thêm năm case nữa. Đến khi có ba mươi, bạn sẽ tự hỏi làm sao trước đây lại ship mà không có chúng.

---

Xây dựng sản phẩm AI nhất quán nghĩa là biết "tốt" trông như thế nào *trước khi* người dùng nói với bạn rằng nó không tốt. Eval là cách để bạn chuyển kiến thức đó thành thứ bền vững. Không cần phức tạp — chỉ cần tồn tại.

Nếu bạn muốn đọc thêm về vòng phản hồi giữa người dùng thực và chất lượng sản phẩm, [500 người mới học code đã dạy chúng tôi điều gì](/vi/blog/what-beginners-taught-us-learning-to-code-with-ai) là một bài tiếp theo đáng đọc. Và nếu bạn đang trong quá trình ship một tính năng hiện có, câu chuyện trong [Đo lường trước khi tối ưu](/vi/blog/measure-before-you-optimize) sẽ nhắc bạn điều gì xảy ra khi tin vào trực giác hơn đo lường - và cả khi kết quả đo lường bất ngờ hơn bạn tưởng.
