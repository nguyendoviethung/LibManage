# Hướng Dẫn Cài Đặt

## Lỗi: `ModuleNotFoundError: No module named 'psycopg2'`

Lỗi này xảy ra vì chưa cài đặt các Python packages cần thiết.

## Giải Pháp

### Bước 1: Kiểm tra Python version
```bash
python --version
# Nên là Python 3.8 trở lên
```

### Bước 2: Tạo Virtual Environment (Khuyến nghị)
```bash
cd python-sentiment

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Trên Windows (Git Bash):
source venv/Scripts/activate

# Trên Windows (CMD):
venv\Scripts\activate

# Trên Linux/Mac:
source venv/bin/activate
```

### Bước 3: Cài đặt Dependencies
```bash
# Đảm bảo đã kích hoạt virtual environment (sẽ thấy (venv) ở đầu dòng)
pip install -r requirements.txt
```

### Bước 4: Kiểm tra cài đặt
```bash
python test_connection.py
```

## Nếu vẫn gặp lỗi

### Lỗi khi cài psycopg2 trên Windows
Nếu gặp lỗi khi cài `psycopg2-binary`, thử:
```bash
pip install --upgrade pip
pip install psycopg2-binary
```

### Lỗi khi cài underthesea
Nếu gặp lỗi khi cài `underthesea`, thử:
```bash
pip install --upgrade pip setuptools wheel
pip install underthesea
```

## Kiểm tra các package đã cài
```bash
pip list
```

Bạn sẽ thấy:
- psycopg2-binary
- pandas
- numpy
- scikit-learn
- joblib
- underthesea
- python-dotenv

## Troubleshooting

### Lỗi: "pip is not recognized"
- Đảm bảo Python đã được cài đặt và thêm vào PATH
- Thử dùng `python -m pip` thay vì `pip`

### Lỗi: "Permission denied"
- Trên Linux/Mac: Thử dùng `sudo` hoặc tốt hơn là dùng virtual environment
- Trên Windows: Chạy terminal với quyền Administrator

### Lỗi: "Microsoft Visual C++ 14.0 is required"
- Cài đặt Microsoft Visual C++ Build Tools
- Hoặc dùng `psycopg2-binary` (đã có trong requirements.txt)


