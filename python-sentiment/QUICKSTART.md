# Quick Start Guide

## Bước 1: Cài đặt

```bash
cd python-sentiment
pip install -r requirements.txt
```

## Bước 2: Cấu hình Database

Tạo file `.env` hoặc chỉnh sửa `config/database.py` với thông tin database của bạn.

## Bước 3: Test kết nối

```bash
python test_connection.py
```

## Bước 4: Chuẩn bị Model

Nếu bạn đã có model file `models/sentiment_model_bilingual.pkl`, bỏ qua bước này.

Nếu chưa có, train model:
```bash
python train_model.py --dataset dataset.csv
```

## Bước 5: Chạy phân tích

```bash
# Phân tích tất cả reviews chưa được phân tích
python main.py

# Phân tích giới hạn 100 reviews
python main.py --limit 100

# Phân tích một review cụ thể
python main.py --review-id 123
```

## Cấu trúc dữ liệu

### Input (từ database)
- Bảng `reviews`: chứa comment đánh giá
- Cột `comment`: text cần phân tích

### Output (lưu vào database)
- Bảng `review_sentiments`: kết quả phân tích
  - `sentiment_label`: -1 (negative), 0 (neutral), 1 (positive)
  - `confidence`: độ tin cậy (0.0 - 1.0)
  - `model_version`: phiên bản model
  - `predicted_at`: thời gian phân tích

## Troubleshooting

1. **Lỗi import module**: Đảm bảo đã cài đủ dependencies
2. **Lỗi kết nối database**: Kiểm tra thông tin trong `config/database.py`
3. **Model không tìm thấy**: Đảm bảo file `models/sentiment_model_bilingual.pkl` tồn tại

