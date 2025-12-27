# Flow Hoạt Động: Từ Đánh Giá Sách Đến Phân Tích Cảm Xúc

## 📋 Tổng Quan

Hệ thống hoạt động theo 2 giai đoạn:
1. **Giai đoạn 1**: Người dùng đánh giá sách → Lưu vào database (PHP)
2. **Giai đoạn 2**: Python service phân tích cảm xúc → Lưu kết quả vào database (Python)

---

## 🔄 FLOW CHI TIẾT

### **GIAI ĐOẠN 1: Người Dùng Đánh Giá Sách (Frontend → Backend PHP)**

#### Bước 1: Người dùng nhập đánh giá
**File**: `frontend/src/components/review_modal/ReviewModal.jsx`

```javascript
// Người dùng nhập comment vào textarea
const [comment, setComment] = useState("");

// Khi click nút "Gửi"
const handleSubmit = async () => {
  // Gửi POST request đến API
  const res = await axios.post(
    "http://localhost/LibManage/backend/api/notifications/submit-review.php",
    {
      return_id: book.return_id,
      reader_id: book.reader_id,
      book_id: book.book_id,
      comment: comment
    }
  );
}
```

**Hàm được gọi**: `handleSubmit()` trong `ReviewModal.jsx`

---

#### Bước 2: Backend PHP nhận và xử lý
**File**: `backend/api/notifications/submit-review.php`

```php
// 1. Nhận dữ liệu từ request
$returnId = $data['return_id'] ?? null;
$bookId   = $data['book_id'] ?? null;
$comment  = trim($data['comment']) ?? null;

// 2. Lấy reader_id từ token
$studentID = $decode->data->id;
// Map student_id → reader_id

// 3. INSERT vào bảng reviews
INSERT INTO reviews (return_id, reader_id, book_id, rating, comment)
VALUES (:return_id, :reader_id, :book_id, :rating, :comment)
```

**Hàm được gọi**: 
- `checkReaderRole($decode)` - middleware auth
- SQL INSERT vào bảng `reviews`

**Kết quả**: Review được lưu vào database, nhưng **CHƯA có sentiment analysis**

---

### **GIAI ĐOẠN 2: Phân Tích Cảm Xúc (Python Service)**

⚠️ **Lưu ý quan trọng**: Python service **KHÔNG tự động chạy** khi có review mới. Bạn cần:
- Chạy thủ công: `python main.py`
- Hoặc setup cron job để chạy định kỳ (ví dụ: mỗi giờ)

---

#### Bước 3: Khởi động Python Service
**File**: `python-sentiment/main.py`

```bash
# Chạy script
python main.py
```

**Hàm được gọi**: `main()` → `analyze_reviews()`

---

#### Bước 4: Kết nối Database
**File**: `python-sentiment/config/database.py`

```python
# Test connection
test_connection()  # Kiểm tra kết nối PostgreSQL

# Initialize connection pool
init_connection_pool()  # Tạo pool kết nối (1-10 connections)
```

**Hàm được gọi**:
- `test_connection()` - Test kết nối
- `init_connection_pool()` - Khởi tạo connection pool

---

#### Bước 5: Load Model Phân Tích
**File**: `python-sentiment/models/sentiment_analyzer.py`

```python
# Load model từ file .pkl
analyzer = SentimentAnalyzer()
# → Gọi load_model()
# → Load: model, vectorizer, slang_dict, stopwords
```

**Hàm được gọi**:
- `SentimentAnalyzer.__init__()`
- `SentimentAnalyzer.load_model()`

**File model**: `models/sentiment_model_bilingual.pkl`

---

#### Bước 6: Lấy Reviews Chưa Phân Tích
**File**: `python-sentiment/utils/db_fetcher.py`

```python
# Query database
reviews = get_unanalyzed_reviews(limit=None)

# SQL Query:
SELECT r.review_id, r.comment, ...
FROM reviews r
LEFT JOIN review_sentiments rs ON r.review_id = rs.review_id
WHERE rs.sentiment_id IS NULL  -- Chưa có sentiment
  AND r.comment IS NOT NULL
  AND TRIM(r.comment) != ''
```

**Hàm được gọi**: `get_unanalyzed_reviews(limit=None)`

**Kết quả**: Danh sách các reviews chưa được phân tích cảm xúc

---

#### Bước 7: Phân Tích Từng Review
**File**: `python-sentiment/main.py` và `python-sentiment/models/sentiment_analyzer.py`

```python
for review in reviews:
    comment = review['comment']
    
    # Gọi hàm predict
    sentiment_label, confidence, language = analyzer.predict(comment)
```

**Hàm được gọi**: `analyzer.predict(comment)`

**Chi tiết bên trong `predict()`**:

1. **Layer 1: Phát hiện ngôn ngữ**
   ```python
   lang = detect_language(text)  # 'vi', 'en', 'mixed'
   ```

2. **Layer 2: Kiểm tra spam/gibberish**
   ```python
   if is_gibberish_review(text):
       return "SPAM", 0.0, lang
   ```

3. **Layer 3: Tiền xử lý text**
   ```python
   processed = preprocess_text_advanced(text)
   # - Chuẩn hóa slang (oke → rất hay)
   # - Xử lý phủ định (không hay → không NOT_hay)
   # - Loại bỏ stopwords
   # - Tách từ tiếng Việt (word_tokenize)
   ```

4. **Layer 4: Vector hóa**
   ```python
   vec = vectorizer.transform([processed])  # TF-IDF vectorization
   ```

5. **Layer 5: Dự đoán bằng ML**
   ```python
   pred = model.predict(vec)[0]  # -1, 0, hoặc 1
   proba_array = model.predict_proba(vec)[0]  # Xác suất
   max_proba = proba_array.max()  # Độ tin cậy
   ```

6. **Layer 6: Kiểm tra độ tin cậy**
   ```python
   if max_proba < 0.25:
       return 0, max_proba, lang  # Gán về neutral
   ```

**Hàm được gọi trong quá trình predict**:
- `detect_language()` - Phát hiện ngôn ngữ
- `is_gibberish_review()` - Kiểm tra spam
- `preprocess_text_advanced()` - Tiền xử lý
- `normalize_slang()` - Chuẩn hóa từ lóng
- `handle_negation()` - Xử lý phủ định
- `word_tokenize()` - Tách từ (tiếng Việt)
- `vectorizer.transform()` - Vector hóa
- `model.predict()` - Dự đoán
- `model.predict_proba()` - Xác suất

---

#### Bước 8: Map Label Về Database Format
**File**: `python-sentiment/models/sentiment_analyzer.py`

```python
# Map sentiment label
db_label = map_sentiment_to_db_label(sentiment_label)
# -1 (negative) → -1
# 0 (neutral) → 0
# 1 (positive) → 1
# "SPAM" → 0 (neutral)
```

**Hàm được gọi**: `map_sentiment_to_db_label(sentiment_label)`

---

#### Bước 9: Lưu Kết Quả Vào Database
**File**: `python-sentiment/utils/db_saver.py`

```python
# Lưu từng batch (50 reviews/lần)
save_batch_sentiment_results(batch_results)

# SQL Query:
INSERT INTO review_sentiments 
(review_id, sentiment_label, confidence, model_version, predicted_at)
VALUES (%s, %s, %s, %s, %s)
```

**Hàm được gọi**: `save_batch_sentiment_results(batch_results)`

**Chi tiết**:
- Kiểm tra xem đã có sentiment chưa (UPDATE nếu có, INSERT nếu chưa)
- Lưu: `sentiment_label` (-1, 0, 1), `confidence` (0.0-1.0), `model_version`, `predicted_at`

---

## 📊 Sơ Đồ Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: ReviewModal.jsx                                │
│    - Người dùng nhập comment                                 │
│    - Click "Gửi"                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │ POST request
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. BACKEND PHP: submit-review.php                           │
│    - Nhận dữ liệu (return_id, book_id, comment)            │
│    - Lấy reader_id từ token                                 │
│    - INSERT INTO reviews (...)                               │
│    ✅ Review được lưu vào database                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ (Review chưa có sentiment)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DATABASE: reviews table                                  │
│    - review_id, return_id, reader_id, book_id              │
│    - comment: "Sách rất hay!"                               │
│    - review_date: 2024-01-15                                │
│    ⚠️ Chưa có record trong review_sentiments                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ (Chạy Python service thủ công hoặc cron)
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. PYTHON: main.py                                          │
│    - python main.py                                          │
│    - analyze_reviews()                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. PYTHON: config/database.py                              │
│    - test_connection()                                      │
│    - init_connection_pool()                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PYTHON: models/sentiment_analyzer.py                     │
│    - SentimentAnalyzer()                                     │
│    - load_model() → Load .pkl file                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. PYTHON: utils/db_fetcher.py                              │
│    - get_unanalyzed_reviews()                                │
│    - Query: WHERE rs.sentiment_id IS NULL                   │
│    ✅ Lấy danh sách reviews chưa phân tích                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. PYTHON: models/sentiment_analyzer.py                     │
│    - analyzer.predict(comment)                              │
│      ├─ detect_language()                                   │
│      ├─ is_gibberish_review()                               │
│      ├─ preprocess_text_advanced()                          │
│      ├─ vectorizer.transform()                              │
│      ├─ model.predict()                                     │
│      └─ model.predict_proba()                               │
│    ✅ Kết quả: (sentiment_label, confidence, language)     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. PYTHON: models/sentiment_analyzer.py                     │
│    - map_sentiment_to_db_label()                            │
│    ✅ Map: "SPAM" → 0, -1 → -1, 1 → 1                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. PYTHON: utils/db_saver.py                                │
│     - save_batch_sentiment_results()                         │
│     - INSERT INTO review_sentiments (...)                    │
│     ✅ Kết quả được lưu vào database                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. DATABASE: review_sentiments table                       │
│     - sentiment_id                                          │
│     - review_id (FK → reviews)                               │
│     - sentiment_label: -1 (negative)                        │
│     - confidence: 0.95                                       │
│     - model_version: "bilingual_v1.0"                       │
│     - predicted_at: 2024-01-15 10:30:00                     │
│     ✅ Hoàn tất!                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Danh Sách File Được Gọi

### **Frontend**
1. `frontend/src/components/review_modal/ReviewModal.jsx`
   - `handleSubmit()` - Gửi review

### **Backend PHP**
2. `backend/middleware/auth-middleware.php`
   - `checkReaderRole()` - Xác thực
3. `backend/api/notifications/submit-review.php`
   - SQL INSERT vào `reviews`

### **Python Service**
4. `python-sentiment/main.py`
   - `main()` - Entry point
   - `analyze_reviews()` - Hàm chính
5. `python-sentiment/config/database.py`
   - `test_connection()` - Test DB
   - `init_connection_pool()` - Khởi tạo pool
   - `get_connection()` - Lấy connection
6. `python-sentiment/models/sentiment_analyzer.py`
   - `SentimentAnalyzer.__init__()` - Khởi tạo
   - `SentimentAnalyzer.load_model()` - Load model
   - `SentimentAnalyzer.predict()` - Phân tích
   - `detect_language()` - Phát hiện ngôn ngữ
   - `is_gibberish_review()` - Kiểm tra spam
   - `preprocess_text_advanced()` - Tiền xử lý
   - `map_sentiment_to_db_label()` - Map label
7. `python-sentiment/utils/db_fetcher.py`
   - `get_unanalyzed_reviews()` - Lấy reviews chưa phân tích
8. `python-sentiment/utils/db_saver.py`
   - `save_batch_sentiment_results()` - Lưu kết quả

---

## ⚙️ Cách Chạy Python Service

### **Cách 1: Chạy thủ công**
```bash
cd python-sentiment
python main.py
```

### **Cách 2: Chạy định kỳ (Cron Job)**
```bash
# Chạy mỗi giờ
0 * * * * cd /path/to/LibManage/python-sentiment && python main.py >> logs/sentiment.log 2>&1

# Chạy mỗi ngày lúc 2h sáng
0 2 * * * cd /path/to/LibManage/python-sentiment && python main.py >> logs/sentiment.log 2>&1
```

### **Cách 3: Phân tích một review cụ thể**
```bash
python main.py --review-id 123
```

---

## 🔍 Kiểm Tra Kết Quả

### **Xem reviews chưa phân tích**
```sql
SELECT r.review_id, r.comment
FROM reviews r
LEFT JOIN review_sentiments rs ON r.review_id = rs.review_id
WHERE rs.sentiment_id IS NULL
  AND r.comment IS NOT NULL;
```

### **Xem kết quả phân tích**
```sql
SELECT 
    r.review_id,
    r.comment,
    rs.sentiment_label,
    rs.confidence,
    rs.model_version,
    rs.predicted_at
FROM reviews r
JOIN review_sentiments rs ON r.review_id = rs.review_id
ORDER BY rs.predicted_at DESC;
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Python service KHÔNG tự động chạy**: Cần chạy thủ công hoặc setup cron job
2. **Model file cần thiết**: Phải có `models/sentiment_model_bilingual.pkl`
3. **Database connection**: Đảm bảo PostgreSQL đang chạy và thông tin kết nối đúng
4. **Batch processing**: Xử lý theo batch (50 reviews/lần) để tối ưu hiệu suất

