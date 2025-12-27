import os
import sys
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import psycopg2
from psycopg2 import Error, pool
from psycopg2.extras import RealDictCursor

# Import scikit-learn models để pickle có thể load
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

# Thêm thư mục gốc vào sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import database utilities nếu có
try:
    from config.database import init_connection_pool, get_connection
    USE_DB_UTILS = True
except:
    USE_DB_UTILS = False

class SentimentAnalyzer:
    def __init__(self):
        """Khởi tạo Sentiment Analyzer"""
        self.model = None
        self.vectorizer = None
        self.db_connection = None
        
    def load_model(self, model_path='models/sentiment_model_bilingual.pkl'):
        """Load model đã train (pickle file)"""
        try:
            print(f"📦 Đang load model từ {model_path}...")
            
            if not os.path.exists(model_path):
                print(f"✗ Không tìm thấy file: {model_path}")
                return False
            
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            # Kiểm tra xem model_data có chứa gì
            if isinstance(model_data, dict):
                # Nếu là dict, có thể chứa cả model và vectorizer
                self.model = model_data.get('model')
                self.vectorizer = model_data.get('vectorizer') or model_data.get('tfidf')
                print("✓ Load model và vectorizer từ dict thành công!")
            else:
                # Nếu chỉ là model
                self.model = model_data
                print("✓ Load model thành công!")
                print("⚠ Cần load vectorizer riêng...")
            
            return True
        except Exception as e:
            print(f"✗ Lỗi khi load model: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    def load_vectorizer(self, vectorizer_path='models/tfidf_vectorizer.pkl'):
        """Load vectorizer/tokenizer riêng nếu cần"""
        try:
            if self.vectorizer is not None:
                print("✓ Vectorizer đã được load cùng model")
                return True
                
            print(f"📦 Đang load vectorizer từ {vectorizer_path}...")
            
            if not os.path.exists(vectorizer_path):
                print(f"⚠ Không tìm thấy file: {vectorizer_path}")
                # Thử tìm file vectorizer khác
                alt_paths = [
                    'models/vectorizer.pkl',
                    'models/tokenizer.pkl',
                    'tfidf_vectorizer.pkl',
                    'vectorizer.pkl'
                ]
                for alt_path in alt_paths:
                    if os.path.exists(alt_path):
                        vectorizer_path = alt_path
                        print(f"  ✓ Tìm thấy: {alt_path}")
                        break
                else:
                    print("⚠ Không tìm thấy vectorizer riêng!")
                    print("💡 Model có thể không cần vectorizer hoặc đã tích hợp sẵn")
                    print("   Sẽ thử chạy trực tiếp với model...")
                    return True  # Cho phép tiếp tục
            else:
                with open(vectorizer_path, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                print("✓ Load vectorizer thành công!")
            
            return True
        except Exception as e:
            print(f"⚠ Lỗi khi load vectorizer: {str(e)}")
            print("   Sẽ thử chạy trực tiếp với model...")
            return True  # Cho phép tiếp tục
    
    def connect_database(self, host='localhost', database='LibManage', 
                        user='postgres', password='', port=5432):
        """Kết nối đến PostgreSQL database"""
        try:
            print(f"🔌 Đang kết nối đến PostgreSQL database {database}...")
            
            if USE_DB_UTILS:
                # Sử dụng utility có sẵn
                self.db_connection = get_connection()
                print("✓ Sử dụng connection pool từ config")
            else:
                # Kết nối trực tiếp
                self.db_connection = psycopg2.connect(
                    host=host,
                    database=database,
                    user=user,
                    password=password,
                    port=port
                )
            
            if self.db_connection:
                # Test connection
                cursor = self.db_connection.cursor()
                cursor.execute('SELECT version();')
                db_version = cursor.fetchone()
                cursor.close()
                print(f"✓ Kết nối PostgreSQL thành công!")
                print(f"  Database version: {db_version[0][:50]}...")
                return True
                
        except Error as e:
            print(f"✗ Lỗi kết nối PostgreSQL: {str(e)}")
            print(f"\n💡 Hướng dẫn khắc phục:")
            print(f"   1. Kiểm tra PostgreSQL đã chạy chưa")
            print(f"   2. Kiểm tra username/password")
            print(f"   3. Kiểm tra tên database: {database}")
            print(f"   4. Kiểm tra port: {port} (mặc định là 5432)")
            return False
    
    def preprocess_text(self, text):
        """Tiền xử lý text trước khi phân tích"""
        if not text or text.strip() == '':
            return ''
        
        # Chuyển về lowercase
        text = text.lower().strip()
        return text
    
    def predict_sentiment(self, text):
        """Dự đoán sentiment cho một đoạn text"""
        try:
            # Tiền xử lý
            processed_text = self.preprocess_text(text)
            
            if not processed_text:
                return None
            
            # Vector hóa text
            if self.vectorizer:
                text_vector = self.vectorizer.transform([processed_text])
            else:
                # Nếu không có vectorizer, dùng trực tiếp text
                text_vector = [processed_text]
            
            # Dự đoán
            prediction = self.model.predict(text_vector)[0]
            
            # Lấy probability nếu có
            try:
                proba = self.model.predict_proba(text_vector)[0]
                confidence = float(max(proba))
                
                # Nếu là binary classification
                if len(proba) == 2:
                    sentiment_score = float(proba[1])  # Probability của class positive
                else:
                    sentiment_score = confidence
            except:
                confidence = 0.5
                sentiment_score = 0.5 if prediction == 1 else 0.5
            
            # Map prediction sang label
            # Giả sử: 0 = Negative, 1 = Positive, 2 = Neutral (nếu có)
            label_map = {
                0: 'Negative',
                1: 'Positive',
                2: 'Neutral'
            }
            sentiment_label = label_map.get(prediction, 'Unknown')
            
            return {
                'text': text,
                'sentiment': sentiment_label,
                'score': sentiment_score,
                'confidence': confidence
            }
            
        except Exception as e:
            print(f"✗ Lỗi khi dự đoán: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def get_reviews_from_db(self, table_name='reviews', limit=None):
        """Lấy các review chưa phân tích từ PostgreSQL database"""
        try:
            cursor = self.db_connection.cursor(cursor_factory=RealDictCursor)
            
            # Query lấy reviews chưa được phân tích
            # PostgreSQL sử dụng %s thay vì ? cho placeholders
            query = f"""
                SELECT id, review_text, user_id, book_id, created_at 
                FROM {table_name} 
                WHERE sentiment IS NULL OR sentiment = ''
            """
            
            if limit:
                query += f" LIMIT {limit}"
            
            cursor.execute(query)
            reviews = cursor.fetchall()
            cursor.close()
            
            print(f"✓ Đã lấy {len(reviews)} reviews cần phân tích")
            return reviews
            
        except Error as e:
            print(f"✗ Lỗi khi lấy reviews: {str(e)}")
            return []
    
    def save_sentiment_to_db(self, review_id, sentiment_result, table_name='reviews'):
        """Lưu kết quả phân tích sentiment vào PostgreSQL database"""
        try:
            cursor = self.db_connection.cursor()
            
            # PostgreSQL sử dụng %s cho tất cả placeholders
            update_query = f"""
                UPDATE {table_name} 
                SET sentiment = %s, 
                    sentiment_score = %s, 
                    sentiment_confidence = %s,
                    analyzed_at = %s
                WHERE id = %s
            """
            
            values = (
                sentiment_result['sentiment'],
                sentiment_result['score'],
                sentiment_result['confidence'],
                datetime.now(),
                review_id
            )
            
            cursor.execute(update_query, values)
            self.db_connection.commit()
            cursor.close()
            
            return True
            
        except Error as e:
            print(f"✗ Lỗi khi lưu sentiment (review_id={review_id}): {str(e)}")
            # Rollback nếu có lỗi
            self.db_connection.rollback()
            import traceback
            traceback.print_exc()
            return False
    
    def analyze_and_save_batch(self, reviews, table_name='reviews'):
        """Phân tích và lưu một batch reviews"""
        success_count = 0
        fail_count = 0
        
        print(f"\n🔄 Bắt đầu phân tích {len(reviews)} reviews...")
        print("-" * 80)
        
        for i, review in enumerate(reviews, 1):
            try:
                review_text = review.get('review_text', '') or review.get('content', '')
                
                if not review_text or review_text.strip() == '':
                    print(f"  [{i}/{len(reviews)}] ⚠ Review ID {review['id']}: Nội dung trống")
                    fail_count += 1
                    continue
                
                # Dự đoán sentiment
                sentiment_result = self.predict_sentiment(review_text)
                
                if sentiment_result:
                    # Lưu vào database
                    if self.save_sentiment_to_db(review['id'], sentiment_result, table_name):
                        success_count += 1
                        # Hiển thị preview text
                        preview = review_text[:50] + "..." if len(review_text) > 50 else review_text
                        print(f"  [{i}/{len(reviews)}] ✓ ID {review['id']}: {sentiment_result['sentiment']} "
                              f"(score: {sentiment_result['score']:.3f}, conf: {sentiment_result['confidence']:.3f})")
                        print(f"      Text: {preview}")
                    else:
                        fail_count += 1
                else:
                    fail_count += 1
                    print(f"  [{i}/{len(reviews)}] ✗ Review ID {review['id']}: Lỗi dự đoán")
                    
            except Exception as e:
                fail_count += 1
                print(f"  [{i}/{len(reviews)}] ✗ Review ID {review['id']}: {str(e)}")
        
        print("-" * 80)
        print(f"\n📊 Kết quả:")
        print(f"  ✓ Thành công: {success_count}/{len(reviews)}")
        print(f"  ✗ Thất bại: {fail_count}/{len(reviews)}")
        if len(reviews) > 0:
            print(f"  📈 Tỷ lệ thành công: {success_count/len(reviews)*100:.1f}%")
        
        return success_count, fail_count
    
    def run_analysis(self, batch_size=100, table_name='reviews'):
        """Chạy toàn bộ quy trình phân tích sentiment"""
        print("=" * 80)
        print("  SENTIMENT ANALYSIS - LibManage System (PostgreSQL)")
        print("=" * 80)
        
        # Load model
        if not self.load_model():
            return False
        
        # Load vectorizer nếu cần
        if not self.vectorizer:
            self.load_vectorizer()
        
        # Kết nối database
        if not self.connect_database():
            return False
        
        # Lấy reviews cần phân tích
        reviews = self.get_reviews_from_db(table_name, limit=batch_size)
        
        if not reviews:
            print("\n⚠ Không có review nào cần phân tích!")
            print("💡 Hãy kiểm tra:")
            print("   - Bảng 'reviews' có tồn tại không?")
            print("   - Có reviews nào với sentiment = NULL không?")
            return True
        
        # Phân tích và lưu
        success, fail = self.analyze_and_save_batch(reviews, table_name)
        
        # Đóng kết nối
        if self.db_connection:
            self.db_connection.close()
            print("\n✓ Đã đóng kết nối database")
        
        print("\n" + "=" * 80)
        print("  HOÀN THÀNH!")
        print("=" * 80)
        
        return True
    
    def close(self):
        """Đóng tất cả kết nối"""
        if self.db_connection:
            self.db_connection.close()


def main():
    """Main function"""
    print("\n🚀 Khởi động Sentiment Analysis System (PostgreSQL)...\n")
    
    # Cấu hình PostgreSQL - ĐIỀU CHỈNH THEO HỆ THỐNG CỦA BẠN
    CONFIG = {
        'model_path': 'models/sentiment_model_bilingual.pkl',
        'vectorizer_path': 'models/tfidf_vectorizer.pkl',
        'db_host': 'localhost',
        'db_name': 'LibManage',  # Tên database PostgreSQL
        'db_user': 'postgres',   # User PostgreSQL (mặc định là postgres)
        'db_password': '',       # ⚠️ THÊM PASSWORD POSTGRESQL CỦA BẠN
        'db_port': 5432,         # Port PostgreSQL (mặc định là 5432)
        'table_name': 'reviews', # Bảng chứa reviews
        'batch_size': 100        # Số lượng reviews phân tích mỗi lần
    }
    
    print("⚙️  Cấu hình hiện tại:")
    print(f"   🐘 Database: PostgreSQL - {CONFIG['db_name']}")
    print(f"   🔌 Host: {CONFIG['db_host']}:{CONFIG['db_port']}")
    print(f"   👤 User: {CONFIG['db_user']}")
    print(f"   📋 Table: {CONFIG['table_name']}")
    print(f"   📦 Model: {CONFIG['model_path']}")
    print(f"   🔢 Batch size: {CONFIG['batch_size']}")
    print()
    
    # Khởi tạo analyzer
    analyzer = SentimentAnalyzer()
    
    # Chạy phân tích
    try:
        success = analyzer.run_analysis(
            batch_size=CONFIG['batch_size'],
            table_name=CONFIG['table_name']
        )
        
        if success:
            print("\n✅ Chương trình chạy thành công!")
        else:
            print("\n❌ Có lỗi xảy ra trong quá trình chạy!")
            print("\n💡 Hãy kiểm tra:")
            print("   1. PostgreSQL đã chạy chưa?")
            print("   2. Database 'LibManage' có tồn tại không?")
            print("   3. Bảng 'reviews' có tồn tại không?")
            print("   4. User có quyền truy cập không?")
            print("   5. Password có đúng không?")
            
    except KeyboardInterrupt:
        print("\n\n⚠ Người dùng dừng chương trình!")
    except Exception as e:
        print(f"\n❌ Lỗi không mong muốn: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        analyzer.close()


if __name__ == "__main__":
    main()
