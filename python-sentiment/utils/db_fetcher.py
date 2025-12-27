"""
Fetch reviews from database that haven't been analyzed yet
(psycopg3 version)
"""
import logging
from psycopg.rows import dict_row
from config.database import connection_pool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_unanalyzed_reviews(limit=None):
    """
    Get reviews that don't have sentiment analysis yet
    """
    sql = """
        SELECT 
            r.review_id,
            r.return_id,
            r.reader_id,
            r.book_id,
            r.rating,
            r.comment,
            r.review_date,
            b.title AS book_title
        FROM reviews r
        LEFT JOIN books b ON r.book_id = b.book_id
        LEFT JOIN review_sentiments rs ON r.review_id = rs.review_id
        WHERE rs.sentiment_id IS NULL
          AND r.comment IS NOT NULL
          AND TRIM(r.comment) <> ''
        ORDER BY r.review_date DESC
    """

    if limit:
        sql += " LIMIT %s"

    try:
        with connection_pool.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                if limit:
                    cur.execute(sql, (limit,))
                else:
                    cur.execute(sql)
                reviews = cur.fetchall()

        logger.info(f"Fetched {len(reviews)} unanalyzed reviews")
        return reviews

    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        return []


def get_review_by_id(review_id):
    """
    Get a specific review by ID
    """
    sql = """
        SELECT 
            r.review_id,
            r.return_id,
            r.reader_id,
            r.book_id,
            r.rating,
            r.comment,
            r.review_date,
            b.title AS book_title
        FROM reviews r
        LEFT JOIN books b ON r.book_id = b.book_id
        WHERE r.review_id = %s
    """

    try:
        with connection_pool.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(sql, (review_id,))
                return cur.fetchone()

    except Exception as e:
        logger.error(f"Error fetching review {review_id}: {e}")
        return None
