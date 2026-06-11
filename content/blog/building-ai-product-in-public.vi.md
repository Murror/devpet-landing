---
title: "Build in public: Một năm đầu làm sản phẩm AI đã dạy tụi mình điều gì"
description: "Chuyện thật về việc làm một app macOS chạy bằng AI — những ván cược ăn tiền, những tính năng phải xoá thẳng tay, và vài lời cho bất kỳ ai đang làm sản phẩm AI lúc này."
date: "2026-06-09"
updated: "2026-06-11"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Nhà sáng lập, Codepet"
tags: ["ai-products", "building-in-public", "startups", "macos"]
featured: true
---

Hồi mới bắt tay làm Codepet, tụi mình tóm cả sản phẩm trong đúng một câu: một AI dạy bạn làm phần mềm thật, chứ không phải cày cho xong mấy bài hướng dẫn. Một năm trôi qua, câu đó vẫn y nguyên — nhưng gần như mọi thứ *nằm dưới* nó thì đã viết lại ít nhất hai lần.

Đây là phiên bản không màu mè của câu chuyện: ván nào ăn, ván nào thua, và những bài học mà tụi mình cứ phải học đi học lại.

## Hãy bắt đầu từ vòng lặp nhỏ nhất mà vẫn "có hồn"

Bản prototype đầu tiên vừa tham vọng vừa… chết yểu. Nó có giáo trình, có skill tree, có tám người bạn đồng hành, có cả một lộ trình hoành tráng — mà rốt cuộc vô nghĩa, bởi cái vòng lặp cốt lõi chẳng có gì vui.

Thứ cuối cùng làm nên khác biệt lại nhỏ đến mức hơi quê: bạn gõ một dòng code, thú cưng phản ứng lại ngay, mà phản ứng *đúng chỗ*. Không phải kiểu "Giỏi lắm!", mà là "Cái `useEffect` này chạy lại mỗi lần render đó nha — coi thử vì sao không?"

> Đơn vị của một sản phẩm AI không phải là tính năng. Nó là một vòng lặp đủ ngắn để cảm giác như đang trò chuyện.

Khi cái vòng lặp đó "có hồn", mọi thứ còn lại mới có chỗ bám vào. Tụi mình xoá luôn ba tháng làm giáo trình, mà chẳng tiếc tí nào.

### Rút ra được gì

- **Demo cái vòng lặp, đừng demo lộ trình.** Nếu 30 giây tương tác cốt lõi không khiến người ta nhổm người tới, thì thêm bao nhiêu tính năng cũng vô ích.
- **Tốc độ cũng là một tính năng.** Một câu trả lời đúng nhưng tới sau bốn giây sẽ thua một câu "tạm ổn" tới trong 400ms. Tụi mình đổ công sức kỹ thuật thật sự chỉ để thú cưng *phản hồi cho nhanh*.

## Coi model là một mảnh ghép, đừng coi nó là cả sản phẩm

Giai đoạn đầu tụi mình bị ám ảnh prompt. Vấn đề gì nhìn cũng ra vấn đề prompt. Cái bẫy nằm ở chỗ: chỉnh prompt cho ta *cảm giác* đang tiến bộ — sửa tí, ra câu trả lời ngon hơn, rồi ship.

Góc nhìn cứu tụi mình là: **model chỉ là một mảnh ghép trong cả hệ thống.** Phần lớn chất lượng đến từ những thứ *xung quanh* nó — lấy đúng đoạn code của người dùng, giao diện phản hồi, trí nhớ về thứ họ vật lộn hôm qua, và mấy "hàng rào" ngăn AI cầm tay chỉ việc quá đà.

Vài quyết định cụ thể:

- Tụi mình quản lý prompt y như quản lý code, kèm eval đàng hoàng. Một thay đổi prompt làm tốt hơn một ca nhưng âm thầm phá hỏng năm ca khác — đó là cách phổ biến nhất khiến một sản phẩm AI đi lùi.
- Tụi mình ghi lại mọi lần người dùng *không đồng ý* với thú cưng. Mấy khoảnh khắc "cãi" đó là tập dữ liệu nhiều tín hiệu nhất tụi mình có.
- Việc nào cần suy luận sâu thì dùng model mạnh nhất, còn tám chuyện linh tinh thì dùng model nhanh và rẻ hơn. Người dùng không biết model nào trả lời đâu — nhưng họ biết ngay khi nó chậm.

## Cứ ship cái phiên bản còn thấy hơi quê

Phiên bản Codepet mà tụi mình tự hào thì phải sáu tháng nữa mới ra. Phiên bản khiến tụi mình hơi ngại lại ra đúng hẹn — và dạy cho tụi mình biết thứ gì *thật sự* sai, mà thứ đó chưa bao giờ giống dự đoán ban đầu.

Build in public ép bạn phải vậy. Một khi đã lỡ nói "cái này tháng này ra", thì câu "chỉnh thêm một sprint nữa thôi" không còn miễn phí.

### Những tính năng tụi mình đã xoá

| Tính năng | Vì sao bị "khai tử" |
| --- | --- |
| Một IDE đầy đủ ngay trong app | Người dùng có VS Code rồi; hoá ra tụi mình tự cạnh tranh với chính mình |
| Mục tiêu mỗi ngày kiểu streak | Tạo cảm giác tội lỗi chứ không tạo động lực — retention còn *tụt* |
| Tự sinh câu hỏi trắc nghiệm | Y như đi học lại; mà cả mục đích là để thoát khỏi cái cảm giác đó |

Cái nào trên giấy cũng có vẻ thiết yếu. Vậy mà chỉ cần chạm vào người dùng thật, vài ngày là rõ cái nào nên bỏ.

## Nếu bạn đang làm sản phẩm AI, đây là vài điều tụi mình muốn nói

1. **Tìm cái vòng lặp trước đã.** Mọi thứ dồn lại từ một tương tác cốt lõi đủ ngon. Đừng lo làm cái to khi cái lõi còn chưa chạy.
2. **Đo cả những lần AI sai.** Khoảnh khắc AI trả lời sai mà người dùng nhận ra, đáng giá hơn cả trăm log của những lần "xuôi chèo mát mái".
3. **Đừng thương lượng về tốc độ.** Với người dùng, "thông minh" và "nhanh" gần như là cùng một thứ.
4. **Viết ra cái "gu" của mình.** Đội đông lên, "đầu ra tốt" không còn hiển nhiên nữa. Tụi mình giữ một tài liệu sống mô tả thế nào là một câu trả lời hay của thú cưng, kèm ví dụ hẳn hoi.

Một năm rồi, Codepet vẫn là một app macOS giúp mọi người làm ra thứ thật bằng AI. Khác là giờ tụi mình biết *câu nào* nằm dưới mới là câu quan trọng — và để tới được đó, tụi mình đã ship, đã quan sát, và sẵn sàng xoá luôn cả những ý tưởng tâm đắc của mình.

Nếu bạn cũng đang làm thứ gì tương tự, tụi mình rất muốn nghe. Bài tới trong series này sẽ mổ xẻ bộ eval mà tụi mình dùng để giữ chất lượng của thú cưng không bị "trôi" mỗi khi model bên dưới thay đổi.
