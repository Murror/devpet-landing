---
title: "Đo trước khi tối ưu: con bug khiến chúng tôi nhận ra mình đã sai"
description: "Một người dùng báo rằng những session dài làm Codepet giật và ngốn bộ nhớ. Chúng tôi biết chính xác phải sửa gì — và phép đo chứng minh chúng tôi sai hoàn toàn. Một câu chuyện kỹ thuật ngắn về việc cưỡng lại điều hiển nhiên."
date: "2026-06-11"
updated: "2026-06-11"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Nhà sáng lập, Codepet"
tags: ["engineering", "performance", "swiftui", "building-in-public"]
featured: false
---

Có những lỗi mà bạn vừa nghe mô tả đã thấy nguyên nhân hiện ra trong đầu - rõ ràng đến mức gần như không cần suy nghĩ. Một người dùng nhắn cho chúng tôi một lỗi đúng kiểu ấy: sau một ngày dài code, những session mà Codepet ghi lại trở nên *khổng lồ*, và mỗi lần mở một session dài như thế, app lại giật, lại phình bộ nhớ lên trông thấy.

Chúng tôi biết ngay vấn đề nằm ở đâu. Hoặc ít nhất là chúng tôi tưởng thế. Đây là câu chuyện về việc bản sửa lỗi mà chúng tôi chắc chắn nhất hoá ra lại là bản sửa sai - và về hai phút đo đạc đã cứu chúng tôi khỏi việc ship nó ra ngoài.

## Chẩn đoán theo phản xạ

Để hình dung, cần biết một chút về phần này của Codepet. Tab Reflection dựng lại phiên làm việc của bạn thành một câu chuyện: mỗi prompt, mỗi tool call, mỗi lần AI sửa file - tất cả được ghi thành các event rồi khâu lại thành một mạch đọc liền lạc. Một phiên làm việc dày đặc nghĩa là rất nhiều event. Cái session mà người dùng kia đang mở có tới **1.074** event.

Thế là lời chẩn đoán gần như tự viết ra. *Đương nhiên* là chậm rồi - chúng tôi đang giữ hàng nghìn event trong bộ nhớ, có những cái là cả một file diff hay một đống output dài dằng dặc, lại còn nhồi toàn bộ lịch sử vào chung một mảng khổng lồ. Cách sửa quá hiển nhiên: chặn cái mảng ấy lại. Giữ 500 event gần nhất, vứt phần còn lại, xong chuyện.

Chúng tôi còn viết hẳn ra rồi. Cảm giác rất "đúng". Nó là kiểu thay đổi mà khi nhìn vào diff trông thật chỉn chu, thật có trách nhiệm.

> Bản vá nguy hiểm nhất là bản vá trông thật có trách nhiệm khi nhìn vào diff.

## "Đo trước đã"

Trước khi merge, chúng tôi tự bắt mình làm cái việc chẳng hào nhoáng gì: đo thật xem bộ nhớ thực sự đang đi đâu.

Kết quả khiến chúng tôi phải khựng lại. Trên **toàn bộ 3.272 event** của cả lịch sử, tổng dung lượng văn bản chỉ vỏn vẹn **0,16 MB**. Event lớn nhất dài đúng **985 ký tự** - không một event nào trong cả kho đủ lớn để chạm tới cái ngưỡng an toàn mà chúng tôi đã lo sốt vó. Cái câu chuyện "hàng nghìn event nặng nề ngốn bộ nhớ" mà chúng tôi tự kể cho mình nghe, quy ra con số thật, chỉ là một sai số làm tròn.

Còn cái cap mà chúng tôi đã hí hửng viết ra? Nó không vô hại - nó gây hại. Mảng đó không chỉ là một cuốn nhật ký, nó là *nguồn* để app dựng lại **mọi session** trong lịch sử của bạn. Chặn nó ở con số 500 không cắt đi mỡ thừa, mà sẽ khiến những session cũ lặng lẽ biến mất và băm cái session lớn kia thành một mẩu vụn. Chúng tôi hẳn đã "sửa" được lời than phiền về hiệu năng bằng cách âm thầm xoá đi lịch sử của chính người dùng.

Chúng tôi revert nó trước khi nó kịp ra khỏi máy.

## Thủ phạm thật sự

Khi đã loại dữ liệu ra khỏi diện tình nghi, vấn đề thật hiện ra rõ mồn một. Cái giá phải trả không nằm ở việc *lưu* phiên làm việc - mà ở việc *vẽ* nó ra. Mở một session là dựng cùng lúc một view cho từng turn một: parse Markdown, quét từng dòng tìm thuật ngữ để gắn link tra cứu, khởi tạo trạng thái cho hiệu ứng gõ chữ - tất cả 1.074 event, ngay lập tức, bất kể bạn có bao giờ cuộn xuống tới chúng hay không.

Session không hề nặng. Cái nặng là hành động vẽ tất cả ra cùng một lúc.

Những bản sửa tiếp theo đều nhỏ và nhàn nhạt, mà thường thì đó lại là dấu hiệu bạn đã chạm đúng tầng cần sửa:

- **Vẽ kiểu lười.** Mỗi turn giờ chỉ được dựng khi nó cuộn vào tầm nhìn, thay vì cả session bung ra ngay khoảnh khắc bạn vừa bấm vào. Đây mới là bản sửa thực sự quan trọng.
- **Xem trước, đừng đổ hết.** Trong phần chi tiết kỹ thuật, những event dài giờ chỉ hiện một đoạn xem trước kèm nút "Show more", để một turn đã mở không phải dàn ra toàn bộ nội dung file cho từng dòng.
- **Cache lại phần parse.** Đoạn Markdown đã parse một lần sẽ được dùng lại thay vì parse lại mỗi khi bạn cuộn tới cuộn lui.
- **Giữ lại một lớp đề phòng rẻ tiền.** Chúng tôi vẫn thêm một giới hạn rộng rãi cho độ dài văn bản của *từng* event - không phải vì dữ liệu hôm nay cần, mà để mai này một cái log 10 Mb bất thường không thể bắt cả cái tab làm con tin.

## Điều chúng tôi thật sự học được

- **Chẩn đoán nghe thuyết phục và chẩn đoán đúng không phải là một.** Cái của chúng tôi nghe thuyết phục *chính vì* nó khớp với một câu chuyện sẵn có trong đầu: "dữ liệu lớn thì chậm". Mà câu chuyện thì không phải là phép đo.
- **Hãy tối ưu đúng cái tầng nơi cái giá thực sự phát sinh.** Sự chậm chạp là có thật, chỉ là chúng tôi định vị nó thấp hơn nơi nó xảy ra một tầng. Bộ nhớ vô can; cái phải trả giá là phần render.
- **Có những "tối ưu" thật ra đang xoá đi giá trị của người dùng.** Phiên bản chúng tôi suýt ship sẽ xoá lịch sử để thắng một bài benchmark mà chẳng ai yêu cầu. Việc đo đạc không chỉ chỉ cho chúng tôi một cách sửa tốt hơn - nó còn ngăn chúng tôi tạo ra một con bug tệ hơn.

Suy cho cùng, cả vòng đi đường vòng ấy tốn chừng hai phút đo đạc, và đổi lại nó chặn được một thay đổi sai một cách đầy tự tin lên đúng tính năng mà người dùng đang dựa vào. Cái giá đó, chúng tôi sẵn lòng trả - mọi lúc, không cần đắn đo.
