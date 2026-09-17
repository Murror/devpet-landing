---
title: "Cách xây dựng hệ thống RAG cá nhân cho ghi chú của bạn"
description: "Hướng dẫn thực tế để xây dựng pipeline RAG cá nhân — giúp AI tìm kiếm trong ghi chú và tài liệu của bạn trước khi trả lời."
date: "2026-06-15"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["RAG", "second brain", "knowledge management", "AI tools", "productivity"]
---

AI của bạn có một điểm mù đáng ngạc nhiên - nó không biết gì về bạn cả. Đóng cửa sổ chat lại, mở một cửa sổ mới, và toàn bộ bối cảnh bạn từng chia sẻ - quyết định thiết kế, những đoạn code mất công giải thích, những thứ bạn ghi chú vội trong lúc làm việc - đều tan biến như chưa từng tồn tại. Mỗi cuộc trò chuyện đều bắt đầu từ con số không. Đây chính là vấn đề mà RAG được tạo ra để giải quyết, và xây dựng một hệ thống RAG cá nhân từ kho ghi chú của mình thực ra không khó như nhiều người nghĩ.

RAG (Retrieval-Augmented Generation) hoạt động theo một nguyên tắc đơn giản đến mức gần như tầm thường: trước khi trả lời câu hỏi của bạn, hệ thống sẽ tìm kiếm trong kho văn bản được chỉ định, lấy ra những đoạn liên quan nhất, rồi đưa chúng vào prompt cùng với câu hỏi. Model đọc ghi chú của bạn, rồi mới trả lời. Bạn giữ kiến thức dưới dạng văn bản thuần túy; AI học cách sử dụng chúng.

Bài này hướng dẫn bạn xây dựng pipeline RAG cá nhân từ đầu - một hệ thống có thể tìm kiếm trong chính ghi chú, tài liệu và đoạn code của mình.

## Tại sao RAG cá nhân lại đáng đầu tư

Lý do phản đối đầu tiên thường là: "Sao không paste ghi chú thẳng vào chat cho nhanh?" Với một ghi chú thì được. Nhưng khi kho tài liệu của bạn lên đến hàng trăm file - biên bản họp, quyết định kỹ thuật, giải thích code, nghiên cứu tham khảo - bạn không thể ngồi lọc thủ công cái gì liên quan mỗi lần nữa. Tầng retrieval làm điều đó tự động thay bạn.

Đáng nói hơn là sự khác biệt về chất. AI đọc *chính ghi chú của bạn*, viết *bằng giọng văn của bạn*, sẽ cho ra những câu trả lời có chiều sâu hơn hẳn kiểu trả lời chung chung. Nó có thể nhắc lại quyết định bạn đưa ra hai tháng trước, pattern bạn ghi nhớ tuần rồi, ràng buộc kỹ thuật mà bạn chỉ mới thoáng ghi chú qua. Đây là kiểu hỗ trợ khác về chất - gần hơn nhiều với hình ảnh [AI như người bạn đồng hành tư duy thực sự](/vi/blog/ai-as-thought-partner-not-search-engine) hơn là một công cụ tra cứu chung chung mà bạn phải nhắc lại bối cảnh mỗi lần dùng.

Và theo thời gian, nó còn làm cho thói quen ghi chú của bạn sinh ra lợi tức mới. Mỗi ghi chú bạn viết là một lần retrieval trong tương lai. Đầu tư tư duy bắt đầu tích lũy.

## Bốn bước của một pipeline RAG

Hệ thống RAG có bốn thành phần chính - và khi thấy chúng được trình bày rõ ràng, toàn bộ cơ chế sẽ không còn huyền bí nữa:

**1. Chunk** — Chia ghi chú thành những đoạn nhỏ hơn, thường vài trăm từ mỗi đoạn. Chunking quan trọng vì embedding model hoạt động tốt hơn với những đoạn văn tập trung, và vì bạn muốn lấy ra đúng đoạn cần thiết, không phải cả một file mười trang.

**2. Embed** — Chạy mỗi chunk qua embedding model để tạo ra vector - một dãy số mã hóa ý nghĩa ngữ nghĩa của đoạn văn đó. Các đoạn có ý nghĩa tương tự sẽ có vector gần nhau. Model làm cho sự tương đồng trở nên chính xác và có thể tìm kiếm được.

**3. Store** — Lưu các vector (kèm văn bản gốc) vào vector database. Với setup cá nhân, các lựa chọn local như [Chroma](https://www.trychroma.com) hay SQLite với extension `sqlite-vec` là đủ. Không cần hạ tầng cloud.

**4. Retrieve** — Khi có câu hỏi, embed câu hỏi đó theo cùng cách, rồi tìm những chunk có vector gần nhất. Đưa những chunk này vào model làm context cùng với câu hỏi.

Đơn giản vậy thôi. Pipeline này thực sự tuyến tính đến mức đó.

## Xây dựng hệ thống RAG đầu tiên trong 30 phút

Dưới đây là phiên bản tối giản bằng Python, dùng `chromadb` để lưu trữ vector và Anthropic API để sinh câu trả lời:

```python
import chromadb
import anthropic
from pathlib import Path

# 1. Chunk và index ghi chú
client = chromadb.Client()
collection = client.create_collection("my-notes")

notes_dir = Path("~/notes").expanduser()
for i, note_file in enumerate(notes_dir.glob("**/*.md")):
    text = note_file.read_text()
    # chia đơn giản: mỗi block ~400 từ
    chunks = [text[j:j+1600] for j in range(0, len(text), 1600)]
    collection.add(
        documents=chunks,
        ids=[f"{i}-{k}" for k in range(len(chunks))]
    )

# 2. Truy vấn
def ask(question: str) -> str:
    results = collection.query(query_texts=[question], n_results=3)
    context = "\n\n---\n\n".join(results["documents"][0])

    anthropic_client = anthropic.Anthropic()
    response = anthropic_client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": (
                f"Ngữ cảnh từ ghi chú của tôi:\n\n{context}"
                f"\n\nCâu hỏi: {question}"
            )
        }]
    )
    return response.content[0].text

print(ask("Tháng trước tôi đã quyết định gì về database schema?"))
```

Đây là phiên bản cố tình đơn giản. Chroma tự xử lý embedding qua model tích hợp sẵn; bạn chỉ cần thêm tài liệu và truy vấn. Phiên bản production sẽ cần chunking thông minh hơn (tôn trọng ranh giới heading), metadata phong phú hơn (đường dẫn file, ngày tạo, tag), và cách ghép context khéo léo hơn. Nhưng phiên bản này đã chạy được - và chạy được mới là điều quan trọng nhất lúc đầu.

## Nên đưa những gì vào index - và bỏ qua những gì

Không phải ghi chú nào cũng xứng đáng có mặt trong RAG index. Những ứng cử viên tốt nhất là:

- **Quyết định và lý do đằng sau** — "Tại sao chọn X thay vì Y." Đây là những ghi chú giúp bạn không phải tranh luận lại những vấn đề đã được giải quyết - với chính mình hoặc với cả đội.
- **Giải thích kỹ thuật bằng lời của bạn** — Ghi chú viết theo cách bạn suy nghĩ, trong bối cảnh của bạn. Hữu ích hơn tài liệu chính thức vì nó đã được lọc qua đầu bạn rồi.
- **Biên bản họp và action item** — Tốt cho những câu hỏi "chúng ta đã thống nhất điều gì?"
- **Pattern code và snippet tham chiếu** — Những cài đặt bạn muốn dùng lại nhiều lần.

> Bỏ qua to-do list hàng ngày, bản nháp chưa đến kết luận, và bất cứ thứ gì quá phụ thuộc bối cảnh nhất thời đến mức chỉ gây nhiễu. Tín hiệu thắng khối lượng, mọi lúc.

### Giữ index luôn cập nhật

Một index lỗi thời còn tệ hơn không có index - bạn sẽ nhận được những câu trả lời tự tin nhưng sai. Hãy thiết lập script re-index mỗi khi có file thay đổi. Hầu hết vector database đều hỗ trợ upsert, nên bạn chỉ cần xử lý những gì mới hoặc đã sửa. Một cron job đơn giản hoặc file-watcher hook là đủ.

## Tích hợp vào workflow thực tế

Điểm tích hợp quan trọng nhất là bất kỳ nơi nào bạn đang làm việc thực sự. Với nhiều developer, đó là terminal hoặc editor. Bạn có thể expose hệ thống RAG dưới dạng CLI tool:

```bash
$ notes-ask "Quyết định về authentication là gì?"
```

Hoặc bọc nó trong một web interface nhỏ gọn mở trong tab trình duyệt. Vấn đề cốt lõi là giảm ma sát đến mức tối thiểu - nếu cần nhiều hơn vài phím tắt để truy xuất ghi chú, bạn sẽ không dùng.

Phần thưởng tích lũy theo thời gian chính là điều cốt lõi của việc [xây dựng một bộ não thứ hai biết suy nghĩ cùng bạn](/vi/blog/building-a-second-brain-that-thinks-with-you): hệ thống ngày càng thông minh hơn khi bạn sử dụng, vì mỗi ghi chú bạn viết là một câu trả lời trong tương lai. Bạn không chỉ đang lưu trữ kiến thức - mà đang xây dựng một tầng retrieval làm cho kiến thức đó thực sự tiếp cận được khi cần, không cần phải context-switch đi tìm.

## Điều cụ thể cần làm ngay

Bắt đầu thật nhỏ. Chọn một thư mục ghi chú - tài liệu kỹ thuật, biên bản họp, bất cứ thứ gì bạn có nhiều nhất - và xây dựng pipeline tối giản ở trên. Chạy năm đến mười câu truy vấn. Quan sát chỗ nào chưa ổn: có thể chunk quá lớn, có thể thiếu metadata, có thể những chunk được lấy ra chưa ghép vào nhau tốt. Những điểm yếu đó chính là roadmap của bạn.

Mục tiêu không phải là một hệ thống hoàn hảo ngay từ đầu. Mà là vượt qua cái cảm giác bực bội "AI không biết gì về tôi cả" - và xây dựng thứ gì đó ngày càng thông minh hơn khi kho ghi chú của bạn tăng lên.

Ghi chú thì bạn đã có sẵn rồi. Pipeline chỉ là việc của một cuối tuần. Thứ duy nhất còn thiếu là sợi dây kết nối hai thứ đó lại với nhau.
