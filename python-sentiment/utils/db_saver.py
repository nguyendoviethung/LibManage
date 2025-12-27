"""
Save sentiment analysis results to database
"""
import logging
from datetime import datetime
from config.database import get_connection, return_connection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model version
MODEL_VERSION = "bilingual_v1.0"


def save_sentiment_result(review_id, sentiment_label, confidence, model_version=None):
    """
    Save sentiment analysis result to database
    
    Args:
        review_id: The review ID
        sentiment_label: Sentiment label (-1: negative, 0: neutral, 1: positive)
        confidence: Confidence score (0.0 to 1.0)
        model_version: Model version string (default: MODEL_VERSION)
    
    Returns:
        True if successful, False otherwise
    """
    conn = None
    try:
        conn = get_connection()
        if not conn:
            logger.error("Failed to get database connection")
            return False
        
        cursor = conn.cursor()
        
        # Check if sentiment already exists for this review
        check_query = "SELECT sentiment_id FROM review_sentiments WHERE review_id = %s"
        cursor.execute(check_query, (review_id,))
        existing = cursor.fetchone()
        
        if existing:
            # Update existing record
            update_query = """
                UPDATE review_sentiments
                SET sentiment_label = %s,
                    confidence = %s,
                    model_version = %s,
                    predicted_at = %s
                WHERE review_id = %s
            """
            cursor.execute(
                update_query,
                (sentiment_label, confidence, model_version or MODEL_VERSION, datetime.now(), review_id)
            )
            logger.info(f"Updated sentiment for review {review_id}")
        else:
            # Insert new record
            insert_query = """
                INSERT INTO review_sentiments 
                (review_id, sentiment_label, confidence, model_version, predicted_at)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(
                insert_query,
                (review_id, sentiment_label, confidence, model_version or MODEL_VERSION, datetime.now())
            )
            logger.info(f"Saved sentiment for review {review_id}: label={sentiment_label}, confidence={confidence:.3f}")
        
        conn.commit()
        cursor.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error saving sentiment result for review {review_id}: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            return_connection(conn)


def save_batch_sentiment_results(results):
    """
    Save multiple sentiment results in batch
    
    Args:
        results: List of tuples (review_id, sentiment_label, confidence, model_version)
    
    Returns:
        Number of successfully saved results
    """
    if not results:
        return 0
    
    conn = None
    success_count = 0
    
    try:
        conn = get_connection()
        if not conn:
            logger.error("Failed to get database connection")
            return 0
        
        cursor = conn.cursor()
        
        for review_id, sentiment_label, confidence, model_version in results:
            try:
                # Check if exists
                check_query = "SELECT sentiment_id FROM review_sentiments WHERE review_id = %s"
                cursor.execute(check_query, (review_id,))
                existing = cursor.fetchone()
                
                if existing:
                    update_query = """
                        UPDATE review_sentiments
                        SET sentiment_label = %s,
                            confidence = %s,
                            model_version = %s,
                            predicted_at = %s
                        WHERE review_id = %s
                    """
                    cursor.execute(
                        update_query,
                        (sentiment_label, confidence, model_version or MODEL_VERSION, datetime.now(), review_id)
                    )
                else:
                    insert_query = """
                        INSERT INTO review_sentiments 
                        (review_id, sentiment_label, confidence, model_version, predicted_at)
                        VALUES (%s, %s, %s, %s, %s)
                    """
                    cursor.execute(
                        insert_query,
                        (review_id, sentiment_label, confidence, model_version or MODEL_VERSION, datetime.now())
                    )
                
                success_count += 1
                
            except Exception as e:
                logger.error(f"Error saving sentiment for review {review_id}: {e}")
                continue
        
        conn.commit()
        cursor.close()
        
        logger.info(f"Successfully saved {success_count}/{len(results)} sentiment results")
        return success_count
        
    except Exception as e:
        logger.error(f"Error in batch save: {e}")
        if conn:
            conn.rollback()
        return success_count
    finally:
        if conn:
            return_connection(conn)

