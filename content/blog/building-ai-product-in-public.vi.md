---
title: "Build in public: một năm đầu làm sản phẩm AI đã dạy chúng tôi điều gì"
description: "Chuyện thật về một năm làm app macOS chạy bằng AI — những ván cược được giá, những tính năng buộc phải buông, và đôi điều cho bất kỳ ai đang làm sản phẩm AI lúc này."
date: "2026-06-09"
updated: "2026-06-11"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Nhà sáng lập, Codepet"
tags: ["ai-products", "building-in-public", "startups", "macos"]
featured: true
---

Ngày đầu bắt tay vào Codepet, chúng tôi gói cả sản phẩm trong vỏn vẹn một câu: một AI dạy bạn làm phần mềm thật, thay vì chỉ cày cho hết mấy bài hướng dẫn. Một năm trôi qua, câu nói ấy vẫn còn nguyên - nhưng gần như mọi thứ nằm bên dưới nó thì đã được viết lại, ít nhất hai lần.

Đây là phiên bản không son phấn của câu chuyện: ván nào thắng, ván nào thua, và những bài học mà chúng tôi cứ ngỡ đã thuộc lòng, rồi vẫn phải học lại từ đầu.

## Hãy bắt đầu từ vòng lặp nhỏ nhất, nhưng phải "có hồn"

Bản prototype đầu tiên vừa tham vọng vừa chết yểu. Nó có giáo trình, có skill tree, có tám người bạn đồng hành, có cả một lộ trình hoành tráng - vậy mà rốt cuộc chẳng để làm gì, bởi cái vòng lặp cốt lõi nhất lại nhạt thếch.

Thứ cuối cùng tạo nên khác biệt hoá ra nhỏ đến mức hơi ngượng: bạn gõ một dòng code, và lập tức nhận lại một phản ứng *đúng chỗ* từ thú cưng của mình. Không phải kiểu "Giỏi lắm!" cho có, mà là "Cái `useEffect` này sẽ chạy lại sau mỗi lần render đấy - muốn xem vì sao không?"

> Đơn vị của một sản phẩm AI không phải là tính năng. Nó là một vòng lặp đủ ngắn để cho ta cảm giác đang trò chuyện.

Khi vòng lặp ấy "có hồn", mọi thứ còn lại mới có chỗ để bám vào. Chúng tôi xoá thẳng ba tháng công sức làm giáo trình, mà không tiếc một giây.

### Vậy chúng tôi rút ra điều gì

- **Hãy demo cái vòng lặp, đừng demo lộ trình.** Nếu 30 giây tương tác cốt lõi không khiến người ta nhổm người về phía trước, thì có chất thêm bao nhiêu tính năng cũng vô ích.
- **Tốc độ cũng là một tính năng.** Một câu trả lời đúng nhưng đến sau bốn giây sẽ thua một câu "tạm ổn" đến trong 400 mili-giây. Chúng tôi đã bỏ ra công sức kỹ thuật thật sự chỉ để thú cưng *phản hồi cho nhanh*.

## Hãy coi model là một mảnh ghép, đừng coi nó là cả sản phẩm

Giai đoạn đầu, chúng tôi bị prompt ám ảnh. Nhìn đâu cũng thấy một bài toán prompt. Cái bẫy nằm ở chỗ chỉnh prompt cho ta cái cảm giác đang tiến bộ - sửa một chút, ra câu trả lời mượt hơn, rồi ship.

Góc nhìn cứu chúng tôi khỏi cái bẫy đó rất đơn giản: **model chỉ là một mảnh ghép trong cả một hệ thống.** Phần lớn chất lượng đến từ những thứ vây quanh nó - việc lấy đúng đoạn code của người dùng, giao diện phản hồi, trí nhớ về thứ họ từng vật lộn hôm qua, và những "hàng rào" giữ cho AI đừng cầm tay chỉ việc quá đà.

Vài quyết định cụ thể:

- Chúng tôi quản lý prompt y như quản lý code, lúc nào cũng kèm eval. Một thay đổi prompt làm tốt hơn một trường hợp nhưng âm thầm phá hỏng năm trường hợp khác - đó là cách phổ biến nhất khiến một sản phẩm AI đi thụt lùi mà không ai hay.
- Chúng tôi lưu lại mọi lần người dùng *không đồng tình* với thú cưng. Chính những khoảnh khắc "cãi nhau" đó mới là tập dữ liệu giàu tín hiệu nhất chúng tôi có.
- Việc nào cần suy luận sâu thì để model mạnh nhất lo; mấy chuyện tầm phào thì giao cho model nhanh và rẻ hơn. Người dùng chẳng bao giờ biết model nào vừa trả lời - nhưng họ nhận ra ngay khi nó chậm.

## Cứ ship cái phiên bản còn khiến mình hơi ngại

Phiên bản Codepet mà chúng tôi thật sự tự hào thì phải sáu tháng nữa mới ra mắt. Còn phiên bản khiến chúng tôi hơi ngượng lại ra đúng hẹn - và dạy cho chúng tôi biết thứ gì *thật sự* sai, mà điều đó thì chưa bao giờ trùng với dự đoán ban đầu.

Build in public ép bạn phải như vậy. Một khi đã lỡ tuyên bố "cái này tháng này ra mắt", thì câu "chỉnh thêm một sprint nữa thôi" không còn miễn phí nữa.

### Những tính năng chúng tôi đã buông

| Tính năng | Vì sao phải buông |
| --- | --- |
| Một IDE đầy đủ ngay trong app | Người dùng đã có VS Code; hoá ra chúng tôi đang tự cạnh tranh với chính mình |
| Mục tiêu mỗi ngày kiểu streak | Gieo cảm giác tội lỗi chứ không gieo động lực - retention còn *tụt* |
| Tự sinh câu hỏi trắc nghiệm | Lại y như đi học; trong khi cả mục đích là để thoát khỏi cái cảm giác đó |

Trên giấy, cái nào cũng có vẻ thiết yếu. Vậy mà chỉ cần va vào người dùng thật, vài ngày là đủ để biết cái nào nên bỏ.

## Nếu bạn đang làm sản phẩm AI, đây là vài điều chúng tôi muốn nói

1. **Tìm cái vòng lặp trước đã.** Mọi thứ đều dồn lại quanh một tương tác cốt lõi đủ ngon. Đừng vội xây cái thật to khi cái lõi còn chưa chịu chạy.
2. **Hãy đo cả những lần AI sai.** Khoảnh khắc AI trả lời sai mà người dùng nhận ra, đáng giá hơn cả trăm dòng log của những lần "xuôi chèo mát mái".
3. **Đừng đem tốc độ ra thương lượng.** Với người dùng, "thông minh" và "nhanh" gần như là cùng một thứ.
4. **Viết ra cái "gu" của riêng mình.** Đội ngũ đông lên, "đầu ra tốt" không còn là điều hiển nhiên ai cũng hiểu giống nhau. Chúng tôi giữ một tài liệu sống, mô tả thế nào là một câu trả lời hay của thú cưng, kèm ví dụ đàng hoàng.

Một năm rồi, Codepet vẫn là một app macOS giúp người ta làm ra thứ thật bằng AI. Khác biệt là giờ chúng tôi đã biết *câu chữ nào* nằm bên dưới mới thật sự quan trọng - và để đến được đó, chúng tôi đã ship, đã quan sát, và đã sẵn sàng xoá bỏ cả những ý tưởng mình tâm đắc nhất.

Nếu bạn cũng đang làm một thứ tương tự, chúng tôi rất muốn nghe câu chuyện của bạn. Bài tới trong loạt này sẽ mổ xẻ bộ eval mà chúng tôi dùng để giữ cho chất lượng của thú cưng không bị "trôi" mỗi khi model bên dưới đổi thay.
