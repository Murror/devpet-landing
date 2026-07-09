---
title: "Nhật ký lập trình: cách ghi lại insight mà không sợ mất đi"
description: "Hầu hết nhật ký lập trình chết yểu sau tuần đầu. Đây là hệ thống tối giản giúp bạn giữ lại những gì học được ngay lúc nó xảy ra - và dùng AI để lấy lại khi cần."
date: "2026-07-09"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["coding-journal", "second-brain", "ai", "learning", "developer-workflow", "knowledge-management"]
---

Cái cảm giác này chắc không xa lạ. Bạn ngồi debug suốt hai tiếng, cuối cùng hiểu ra vấn đề nằm ở đâu - cái cảm giác "ồ ra là thế" rõ ràng đến từng chi tiết. Rồi ba tháng sau, đứng trước đúng cái lỗi đó, trong đầu không còn một manh mối nào về lần trước mình đã giải quyết như thế nào. Insight bay mất ngay khi bạn đóng terminal.

*Nhật ký lập trình* là giải pháp cho điều đó. Vấn đề là hầu hết những lần thử đều chết yểu trong vòng hai tuần đầu.

## Tại sao nhật ký lập trình thường không sống sót

Thật ra, lỗi không nằm ở kỷ luật - mà ở thời điểm sai và rào cản quá cao. Cách tiếp cận phổ biến nhất: tạo một trang Notion mới, đặt tên "Nhật ký lập trình", viết một entry dài và chỉnh chu sau một ngày làm việc đã cạn kiệt năng lượng. Entry thứ hai ngắn hơn một nửa. Entry thứ ba chỉ còn vài dòng. Entry thứ tư không bao giờ xuất hiện.

Vấn đề là recap cuối ngày yêu cầu bạn phải *tái dựng lại* từ ký ức - mà ký ức, dù chỉ bốn tiếng sau, đã bắt đầu mờ đi. Bạn nhớ mình đã fix được cái gì đó, nhưng cái khoảnh khắc vỡ lẽ lúc đó - thứ thật sự đáng ghi - đã tan vào không khí rồi.

## Ghi gì mới thật sự có ích

Nhật ký lập trình không phải nhật ký công việc. Nó là **learning capture** - cụ thể hơn, là những khoảnh khắc khi mô hình tư duy của bạn thay đổi. Những khoảnh khắc đó có một cảm giác riêng: sự rõ ràng đột ngột sau một vùng mơ hồ, cái "ồ ra thế" khi một khái niệm cuối cùng cũng rơi vào đúng chỗ của nó.

Những gì đáng giữ lại:

- **Bug discoveries** - không phải cái fix, mà là *nguyên nhân thật sự*. "Lỗi này xảy ra vì mình đã giả định X, nhưng thật ra Y mới đúng."
- **Sửa lại mô hình tư duy** - những lúc bạn nhận ra mình đã hiểu sai một khái niệm từ lâu.
- **Quyết định trong vùng mờ** - tại sao bạn đi hướng này thay vì hướng kia, và bạn nhận ra điều gì sau đó. (Những quyết định kiến trúc lớn hơn thì thuộc về [decision log](/vi/blog/decision-log-for-builders), một công cụ khác.)
- **Những cách tiếp cận đã thất bại** - và lý do cụ thể tại sao. Đây là vàng - vì chúng ngăn bạn đi lại cùng ngõ cụt.
- **"Cần tìm hiểu thêm cái này"** - những rabbit hole bạn phát hiện nhưng chưa có thời gian đào sâu.

Không nên ghi: danh sách việc cần làm, bạn đã ship gì hôm nay, kế hoạch tuần sau. Nhật ký là cho những gì bạn *học được*, không phải những gì bạn *đã làm*.

## Thời điểm ghi quyết định mọi thứ

Cách duy nhất thật sự hoạt động là ghi *ngay lúc* insight xảy ra - không phải cuối ngày, không phải trong weekly review, mà ngay khi điều gì đó vừa rõ ra trong đầu.

Điều đó có nghĩa là rào cản để viết phải thấp đến mức gần như không còn nữa. Một câu là một entry hoàn toàn hợp lệ. Bạn không viết cho ai đọc - bạn viết cho chính mình ba tháng sau, người sẽ biết ơn dù chỉ là một gợi ý nhỏ.

Một thói quen thực tế: giữ một file scratchpad mở bên cạnh editor. Mỗi khi có điều gì đó vỡ ra - khi bạn hiểu *tại sao*, khi session debug tiết lộ điều bạn chưa biết trước đó - viết ngay một câu. Đừng lo về cấu trúc. Capture là cho khoảnh khắc hiện tại; chỉnh sửa có thể đến sau.

```
[2026-07-09] Tại sao useEffect cleanup lại quan trọng
Nhận ra: nếu cleanup không unsubscribe, subscription cũ vẫn chạy
khi component remount. Tốn 40 phút cho cái này.
Điểm mấu chốt: cleanup = dọn dẹp *effect trước đó*, không phải effect hiện tại.
```

Không cần bóng bẩy. Không cần đầy đủ. Nhưng ba tháng sau, nó sẽ nói với bạn đúng thứ bạn cần nghe.

## Khi AI biến nhật ký thành công cụ hoàn toàn khác

Một nhật ký trong file text thông thường đã có ích. Nhưng cũng nhật ký đó, với AI làm query interface - hoá ra là một thứ khác hẳn.

Cách đơn giản nhất: paste những entry liên quan vào AI session khi bạn đang giải quyết vấn đề tương tự. Đang gặp khó với state management trong React? Kéo ba entry gần nhất về state bug vào. AI thấy được những mô hình tư duy cũ của bạn, có thể nhận ra pattern đang tái diễn, và đưa ra phản hồi được calibrate theo cách *bạn* cụ thể hay nhầm lẫn - không phải theo cách một developer chung chung nào đó hay nhầm.

> "Mình đã gặp loại vấn đề này trước đây. Notes của mình cho thấy mình hay giả định X khi thật ra Y mới đúng. Lần này mình đang bỏ qua điều gì?"

Một prompt đó cho AI một lăng kính được calibrate theo *tư duy của bạn*, không phải theo sách giáo khoa.

### Pattern mà bạn không thể tự nhìn thấy từ bên trong

Sau vài tháng ghi chép, bạn có thể nhờ AI phân tích toàn bộ tập entry như một tổng thể:

- "Mình hay gặp loại bug nào nhất?"
- "Có khoảng trống hiểu biết nào cứ lặp đi lặp lại không?"
- "Khái niệm nào mình đã phải học lại nhiều hơn một lần?"

Câu trả lời thường vừa khiêm tốn vừa sáng tỏ. Pattern mà bạn không thể nhìn thấy từ bên trong một session debug đơn lẻ sẽ hiện ra rõ ràng khi năm mươi session được đặt cạnh nhau. Nếu bạn muốn notes đó có thể search ở quy mô lớn hơn, bài viết về [personal RAG](/vi/blog/build-personal-rag-for-notes) có hướng dẫn xây dựng một lớp retrieval riêng - nhưng ngay cả một file text đơn giản query cùng AI cũng cho kết quả tốt hơn bộ nhớ tự nhiên nhiều.

### Nhật ký lập trình và decision log bổ sung cho nhau

Đáng nói là hai công cụ này không thay thế nhau - chúng phục vụ những mục đích khác nhau theo cách tự nhiên bổ trợ. *Decision log* ghi lại bạn đã chọn gì và tại sao. *Nhật ký lập trình* ghi lại bạn đã hiểu được gì trong quá trình đó. Theo thời gian, bạn có thể nhìn lại những quyết định cũ dưới ánh sáng của những gì bạn học được sau đó - loại kiểm tra ngược chiều này gần như không thể làm bằng ký ức, nhưng từ notes thì rất tự nhiên.

## Hệ thống tối thiểu để thật sự duy trì

Suy cho cùng, nhật ký lập trình khả thi nhất trông như thế này:

1. **Một file duy nhất** - ở đâu bạn mở nhanh được từ editor là được. `LEARNINGS.md` trong thư mục project. Một daily note trong Obsidian. Không quan trọng - một chỗ duy nhất, và luôn mở sẵn.
2. **Tối thiểu một câu mỗi session** - ghi ngay lúc insight xảy ra. Ngay cả "Vẫn chưa hiểu X hoạt động như thế nào, nhưng có lẽ liên quan đến Y" cũng đáng giữ lại.
3. **Năm phút lướt qua mỗi tuần** - không phải review, chỉ là scroll. Bạn sẽ bắt gặp những thứ mình đã viết mà quên mất, và thỉnh thoảng một cái gì đó sẽ hữu ích ngay cho việc bạn đang làm.

Không cần template. Không cần word count. Không cần ceremony.

> Hệ thống kiến thức tốt nhất là cái bạn thật sự dùng - không phải cái phức tạp nhất bạn thiết kế vào chiều Chủ nhật và bỏ dở vào chiều thứ Tư.

## Điều đọng lại

Nhật ký lập trình hoạt động khi nó nắm bắt insight ngay lúc insight xảy ra - không phải như một bản tổng kết ngược về ngày làm việc. Hạ thấp rào cản đến mức viết thấy dễ hơn không viết. Để AI lo phần nặng là nhận ra pattern và kết nối câu hỏi hiện tại với những câu trả lời trong quá khứ. Sau vài tháng, bạn có thứ tốt hơn ký ức - một hồ sơ có thể search được về cách tư duy của bạn thật sự vận hành, và một cú head start mỗi lần vấn đề quen thuộc quay lại.
