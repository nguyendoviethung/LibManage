# Sentiment Analysis Service

Dịch vụ phân tích cảm xúc (sentiment analysis) cho hệ thống quản lý thư viện, sử dụng Python để phân tích comment đánh giá sách.

## Cấu trúc thư mục

```
python-sentiment/
├── config/
│   └── database.py          # Cấu hình kết nối database
├── models/
│   └── sentiment_analyzer.py # Model phân tích cảm xúc
├── utils/
│   ├── db_fetcher.py        # Lấy reviews từ database
│   └── db_saver.py          # Lưu kết quả vào database
├── main.py                  # Script chính để chạy pipeline
├── requirements.txt         # Python dependencies
└── README.md               # Tài liệu này
```

## Cài đặt

### 1. Cài đặt Python dependencies

```bash
cd python-sentiment
pip install -r requirements.txt
```

### 2. Cấu hình database

**Cách 1: Sử dụng file .env (khuyến nghị)**

```bash
cp .env.example .env
# Chỉnh sửa file .env với thông tin database của bạn
```

**Cách 2: Sử dụng environment variables**

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=LibManage
export DB_USER=postgres
export DB_PASSWORD=2107
```

**Cách 3: Chỉnh sửa trực tiếp trong `config/database.py`**

```python
DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'dbname': 'LibManage',
    'user': 'postgres',
    'password': '2107'
}
```

### 3. Test kết nối database

```bash
python test_connection.py
```

### 4. Chuẩn bị model

Bạn cần có file model đã được train sẵn: `models/sentiment_model_bilingual.pkl`

Nếu chưa có, bạn có thể train model bằng cách:

```bash
# Cần có file dataset.csv với format: text, label
python train_model.py --dataset dataset.csv
```

## Sử dụng

### Phân tích tất cả reviews chưa được phân tích

```bash
python main.py
```

### Phân tích giới hạn số lượng reviews

```bash
python main.py --limit 100
```

### Phân tích một review cụ thể

```bash
python main.py --review-id 123
```

### Tùy chỉnh batch size

```bash
python main.py --limit 500 --batch-size 100
```

## Cách hoạt động

1. **Lấy dữ liệu**: Script sẽ query database để lấy các reviews chưa có sentiment analysis
2. **Phân tích**: Sử dụng model ML để phân tích cảm xúc của comment
3. **Lưu kết quả**: Lưu kết quả vào bảng `review_sentiments` với:
   - `sentiment_label`: -1 (negative), 0 (neutral), 1 (positive)
   - `confidence`: Độ tin cậy (0.0 - 1.0)
   - `model_version`: Phiên bản model
   - `predicted_at`: Thời gian phân tích

## Chạy định kỳ (Cron Job)

Để tự động phân tích reviews mới, bạn có thể setup cron job:

```bash
# Chạy mỗi giờ
0 * * * * cd /path/to/LibManage/python-sentiment && python main.py >> logs/sentiment.log 2>&1

# Chạy mỗi ngày lúc 2h sáng
0 2 * * * cd /path/to/LibManage/python-sentiment && python main.py >> logs/sentiment.log 2>&1
```

## Model Training

Nếu bạn muốn train lại model, cần có file `dataset.csv` với format:
- `text`: Comment text
- `label`: Sentiment label (-1, 0, 1)

Sau đó chạy script training (cần tạo riêng).

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra thông tin kết nối trong `config/database.py`
- Đảm bảo PostgreSQL đang chạy
- Kiểm tra firewall và network

### Lỗi model không tìm thấy
- Đảm bảo file `models/sentiment_model_bilingual.pkl` tồn tại
- Kiểm tra đường dẫn trong `SentimentAnalyzer.__init__()`

### Lỗi import module
- Đảm bảo đã cài đặt tất cả dependencies: `pip install -r requirements.txt`
- Kiểm tra Python version (khuyến nghị Python 3.8+)

## Logs

Script sẽ log các thông tin quan trọng:
- Số lượng reviews được tìm thấy
- Tiến trình xử lý
- Kết quả phân tích
- Lỗi nếu có

## Notes

- Model hỗ trợ cả tiếng Việt và tiếng Anh
- Tự động phát hiện ngôn ngữ
- Có cơ chế lọc spam/gibberish
- Xử lý batch để tối ưu hiệu suất

py -3.11 -. venv venv 
source venv/Scripts/activate