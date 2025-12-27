"""
Script to train sentiment analysis model
Cần có file dataset.csv với format: text, label
Triển khai đúng như code gốc
"""
import re
import sys
import os
import pandas as pd
import numpy as np
import joblib
from underthesea import word_tokenize
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.sentiment_analyzer import (
    preprocess_text_advanced,
    detect_language,
    is_gibberish_review,
    SLANG_DICT_VI,
    SLANG_DICT_EN,
    STOPWORDS_VI,
    STOPWORDS_EN
)

def train_model(dataset_path="dataset.csv", model_output_path=None):
    """
    Train sentiment analysis model
    
    Args:
        dataset_path: Path to CSV file with columns 'text' and 'label'
        model_output_path: Path to save trained model
    """
    if model_output_path is None:
        model_output_path = os.path.join(
            os.path.dirname(__file__),
            'models',
            'sentiment_model_bilingual.pkl'
        )
    
    # Create models directory if not exists
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    
    print("=" * 60)
    print("Training Sentiment Analysis Model")
    print("=" * 60)
    
    # ===== 13. ĐỌC VÀ XỬ LÝ DỮ LIỆU =====
    print(f"\nĐang đọc dataset từ {dataset_path}...")
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file {dataset_path}!")
        return False
    
    # Xử lý cơ bản
    df = df.dropna(subset=["text", "label"])
    df = df.drop_duplicates(subset=["text"])
    
    # Tiền xử lý
    print("Đang tiền xử lý dữ liệu...")
    df["text"] = df["text"].astype(str).apply(
        lambda x: preprocess_text_advanced(x, remove_accents=False, keep_stopwords=False)
    )
    
    # Loại text rỗng sau xử lý
    df = df[df["text"].str.strip() != ""]
    
    print(f" Số dòng hợp lệ: {len(df)}")
    print(f" Phân bố nhãn:\n{df['label'].value_counts()}\n")
    
    # Chia dữ liệu
    X_train, X_test, y_train, y_test = train_test_split(
        df["text"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )
    
    # ===== 14. VECTOR HÓA =====
    print("Đang vector hóa text...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        min_df=3,
        max_df=0.85
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # ===== 15. HUẤN LUYỆN =====
    print("Đang huấn luyện model...")
    classes = np.unique(y_train)
    class_weights = compute_class_weight('balanced', classes=classes, y=y_train)
    class_weight_dict = dict(zip(classes, class_weights))
    
    print(f" Class weights: {class_weight_dict}\n")
    
    model = LogisticRegression(
        max_iter=1000,
        class_weight=class_weight_dict,
        C=1.0,
        random_state=42
    )
    
    model.fit(X_train_vec, y_train)
    
    # ===== 16. ĐÁNH GIÁ =====
    print("Đang đánh giá model...")
    y_pred = model.predict(X_test_vec)
    
    print("\n CLASSIFICATION REPORT:")
    print(classification_report(y_test, y_pred))
    
    print("\n CONFUSION MATRIX:")
    print(confusion_matrix(y_test, y_pred))
    
    # ===== 17. LƯU MÔ HÌNH =====
    print(f"\nĐang lưu model...")
    joblib.dump({
        "model": model,
        "vectorizer": vectorizer,
        "slang_dict_vi": SLANG_DICT_VI,
        "slang_dict_en": SLANG_DICT_EN,
        "stopwords_vi": STOPWORDS_VI,
        "stopwords_en": STOPWORDS_EN
    }, model_output_path)
    
    print(f"\n Mô hình đã lưu tại {model_output_path}")
    print("=" * 60)
    
    return True


# ===== 18. HÀM DỰ ĐOÁN =====
def predict_sentiment(text, model_path=None):
    """
    Dự đoán cảm xúc cho văn bản mới (tiếng Việt hoặc tiếng Anh)
    Giống như code gốc
    """
    if model_path is None:
        model_path = os.path.join(
            os.path.dirname(__file__),
            'models',
            'sentiment_model_bilingual.pkl'
        )
    
    # Load model
    data = joblib.load(model_path)
    model = data["model"]
    vectorizer = data["vectorizer"]
    
    # Phát hiện ngôn ngữ
    lang = detect_language(text)
    
    # === LAYER 1: Kiểm tra rác bằng rules ===
    if is_gibberish_review(text):
        return "SPAM", 0.0, lang
    
    # === LAYER 2: Tiền xử lý ===
    processed = preprocess_text_advanced(text, remove_accents=False, keep_stopwords=False)
    
    if not processed.strip():
        return "SPAM", 0.0, lang
    
    # === LAYER 3: Dự đoán bằng ML ===
    vec = vectorizer.transform([processed])
    pred = model.predict(vec)[0]
    proba_array = model.predict_proba(vec)[0]
    max_proba = proba_array.max()
    
    # === LAYER 4: Kiểm tra độ tin cậy thấp ===
    # Giảm độ khắt khe
    if max_proba < 0.25:  # trước là 0.40
        return "neu", max_proba, lang   # gán về trung lập thay vì SPAM
    
    # === LAYER 5: Kiểm tra phân bố xác suất đồng đều ===
    sorted_proba = sorted(proba_array, reverse=True)
    if len(sorted_proba) > 1:
        diff = sorted_proba[0] - sorted_proba[1]
        if diff < 0.10:  # trước là 0.15
            return "neu", max_proba, lang   # trung lập chứ không coi là spam
    
    return pred, max_proba, lang


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train Sentiment Analysis Model')
    parser.add_argument(
        '--dataset',
        type=str,
        default='dataset.csv',
        help='Path to dataset CSV file (default: dataset.csv)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default=None,
        help='Path to save trained model (default: models/sentiment_model_bilingual.pkl)'
    )
    parser.add_argument(
        '--test',
        action='store_true',
        help='Test prediction after training'
    )
    
    args = parser.parse_args()
    
    # Train model
    success = train_model(args.dataset, args.output)
    
    # ===== 19. TEST =====
    if success and args.test:
        print("\n" + "=" * 60)
        print("Testing Prediction")
        print("=" * 60)
        
        model_path = args.output or os.path.join(
            os.path.dirname(__file__),
            'models',
            'sentiment_model_bilingual.pkl'
        )
        
        # Interactive test - giống code gốc
        while True:
            text = input("\nNhập comment (hoặc 'exit' để thoát): ")
            if text.lower() == "exit":
                break
            
            try:
                label, proba, lang = predict_sentiment(text, model_path)
                print(f"→ {label}")
            except Exception as e:
                print(f"Lỗi: {e}")

