import os
import joblib

import psycopg2
from psycopg2.extras import RealDictCursor

# =====================================================
# CONFIG
# =====================================================
MODEL_PATH = "models/sentiment_model_bilingual.pkl"

DB_CONFIG = {
    "host": "localhost",
    "database": "LibManage",
    "user": "postgres",
    "password": "2107",
    "port": 5432
}

BATCH_SIZE = 100
MODEL_VERSION = "logreg_bilingual_v1"


# =====================================================
# SENTIMENT ANALYZER
# =====================================================
class SentimentAnalyzer:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.conn = None

    # -------------------------------------------------
    # LOAD MODEL
    # -------------------------------------------------
    def load_model(self):
        print(f"📦 Loading model from {MODEL_PATH} ...")

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

        data = joblib.load(MODEL_PATH)
        self.model = data["model"]
        self.vectorizer = data["vectorizer"]

        print("✓ Model & vectorizer loaded")

    # -------------------------------------------------
    # CONNECT DATABASE
    # -------------------------------------------------
    def connect_db(self):
        print("🔌 Connecting to PostgreSQL...")
        self.conn = psycopg2.connect(**DB_CONFIG)
        print("✓ Database connected")

    # -------------------------------------------------
    # FETCH REVIEWS (CHƯA PHÂN TÍCH)
    # -------------------------------------------------
    def fetch_reviews(self, limit=BATCH_SIZE):
        query = """
            SELECT
                r.review_id,
                r.comment
            FROM reviews r
            LEFT JOIN review_sentiments rs
                ON r.review_id = rs.review_id
            WHERE
                rs.review_id IS NULL
                AND r.comment IS NOT NULL
                AND TRIM(r.comment) <> ''
            LIMIT %s
        """
        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, (limit,))
            rows = cur.fetchall()

        print(f"✓ Fetched {len(rows)} reviews")
        return rows

    # -------------------------------------------------
    # PREDICT SENTIMENT
    # -------------------------------------------------
    def predict(self, text: str):
        vec = self.vectorizer.transform([text])
        label = self.model.predict(vec)[0]
        proba = self.model.predict_proba(vec)[0]

        label_map = {
            "neg": -1,
            "neu": 0,
            "pos": 1
        }

        return {
            "label": label_map.get(label, 0),
            "confidence": float(max(proba))
        }

    # -------------------------------------------------
    # SAVE RESULT INTO review_sentiments
    # -------------------------------------------------
    def save_result(self, review_id: int, result: dict):
        query = """
            INSERT INTO review_sentiments (
                review_id,
                sentiment_label,
                confidence,
                model_version
            )
            VALUES (%s, %s, %s, %s)
        """
        with self.conn.cursor() as cur:
            cur.execute(
                query,
                (
                    review_id,
                    result["label"],
                    result["confidence"],
                    MODEL_VERSION
                )
            )
            self.conn.commit()

    # -------------------------------------------------
    # MAIN PIPELINE
    # -------------------------------------------------
    def run(self):
        self.load_model()
        self.connect_db()

        reviews = self.fetch_reviews()

        if not reviews:
            print("⚠ No reviews to analyze")
            return

        print("\n🔄 Analyzing reviews...\n")

        for idx, r in enumerate(reviews, 1):
            review_id = r["review_id"]
            text = r["comment"]

            result = self.predict(text)
            self.save_result(review_id, result)

            preview = text[:60] + "..." if len(text) > 60 else text
            print(
                f"[{idx}] ✓ Review {review_id} "
                f"| label={result['label']} "
                f"| conf={result['confidence']:.2f}"
            )
            print(f"     {preview}")

        print("\n🎉 Sentiment analysis completed")

    # -------------------------------------------------
    # CLOSE CONNECTION
    # -------------------------------------------------
    def close(self):
        if self.conn:
            self.conn.close()
            print("✓ Database connection closed")


# =====================================================
# MAIN
# =====================================================
def main():
    print("\n🚀 START SENTIMENT ANALYSIS SYSTEM\n")

    analyzer = SentimentAnalyzer()

    try:
        analyzer.run()
    except Exception as e:
        print("❌ ERROR:", e)
        import traceback
        traceback.print_exc()
    finally:
        analyzer.close()


if __name__ == "__main__":
    main()
