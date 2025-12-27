"""
Main script to run sentiment analysis pipeline
Chạy phân tích cảm xúc cho các review chưa được phân tích
"""
import sys
import os
import argparse
import logging
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.database import init_connection_pool, test_connection, close_pool
from utils.db_fetcher import get_unanalyzed_reviews
from utils.db_saver import save_sentiment_result, save_batch_sentiment_results
from models.sentiment_analyzer import SentimentAnalyzer, map_sentiment_to_db_label

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def analyze_reviews(limit=None, batch_size=50):
    """
    Main function to analyze reviews
    
    Args:
        limit: Maximum number of reviews to process (None = all)
        batch_size: Number of reviews to process in each batch
    """
    logger.info("=" * 60)
    logger.info("Starting Sentiment Analysis Pipeline")
    logger.info("=" * 60)
    
    # Test database connection
    logger.info("Testing database connection...")
    if not test_connection():
        logger.error("Database connection failed. Exiting.")
        return
    
    logger.info("Database connection successful!")
    
    # Initialize connection pool
    logger.info("Initializing connection pool...")
    if not init_connection_pool():
        logger.error("Failed to initialize connection pool. Exiting.")
        return
    
    # Load sentiment analyzer
    logger.info("Loading sentiment analyzer model...")
    analyzer = SentimentAnalyzer()
    
    if not analyzer.model or not analyzer.vectorizer:
        logger.error("Failed to load sentiment analyzer model. Exiting.")
        close_pool()
        return
    
    logger.info("Model loaded successfully!")
    
    # Fetch unanalyzed reviews
    logger.info(f"Fetching unanalyzed reviews (limit={limit})...")
    reviews = get_unanalyzed_reviews(limit=limit)
    
    if not reviews:
        logger.info("No unanalyzed reviews found. Exiting.")
        close_pool()
        return
    
    logger.info(f"Found {len(reviews)} reviews to analyze")
    
    # Process reviews in batches
    total_processed = 0
    total_saved = 0
    batch_results = []
    
    try:
        for i, review in enumerate(reviews, 1):
            review_id = review['review_id']
            comment = review.get('comment', '')
            
            if not comment or not comment.strip():
                logger.warning(f"Review {review_id} has empty comment. Skipping.")
                continue
            
            logger.info(f"[{i}/{len(reviews)}] Processing review {review_id}...")
            logger.debug(f"Comment: {comment[:100]}...")
            
            # Predict sentiment
            sentiment_label, confidence, language = analyzer.predict(comment)
            
            # Map to database format
            db_label = map_sentiment_to_db_label(sentiment_label)
            
            logger.info(
                f"Review {review_id}: label={sentiment_label} -> db_label={db_label}, "
                f"confidence={confidence:.3f}, language={language}"
            )
            
            # Add to batch
            batch_results.append((review_id, db_label, confidence, None))
            
            # Save batch when it reaches batch_size
            if len(batch_results) >= batch_size:
                saved = save_batch_sentiment_results(batch_results)
                total_saved += saved
                total_processed += len(batch_results)
                batch_results = []
                logger.info(f"Saved batch. Total processed: {total_processed}, Total saved: {total_saved}")
        
        # Save remaining results
        if batch_results:
            saved = save_batch_sentiment_results(batch_results)
            total_saved += saved
            total_processed += len(batch_results)
            logger.info(f"Saved final batch. Total processed: {total_processed}, Total saved: {total_saved}")
        
        logger.info("=" * 60)
        logger.info("Sentiment Analysis Pipeline Completed!")
        logger.info(f"Total reviews processed: {total_processed}")
        logger.info(f"Total reviews saved: {total_saved}")
        logger.info("=" * 60)
        
    except KeyboardInterrupt:
        logger.warning("Process interrupted by user. Saving current batch...")
        if batch_results:
            saved = save_batch_sentiment_results(batch_results)
            total_saved += saved
            logger.info(f"Saved {saved} reviews before exit")
    except Exception as e:
        logger.error(f"Error during processing: {e}", exc_info=True)
    finally:
        close_pool()


def analyze_single_review(review_id):
    """
    Analyze a single review by ID
    
    Args:
        review_id: The review ID to analyze
    """
    logger.info(f"Analyzing single review: {review_id}")
    
    if not test_connection():
        logger.error("Database connection failed.")
        return
    
    init_connection_pool()
    
    from utils.db_fetcher import get_review_by_id
    
    review = get_review_by_id(review_id)
    
    if not review:
        logger.error(f"Review {review_id} not found.")
        close_pool()
        return
    
    analyzer = SentimentAnalyzer()
    
    if not analyzer.model:
        logger.error("Failed to load model.")
        close_pool()
        return
    
    comment = review.get('comment', '')
    if not comment:
        logger.error("Review has no comment.")
        close_pool()
        return
    
    sentiment_label, confidence, language = analyzer.predict(comment)
    db_label = map_sentiment_to_db_label(sentiment_label)
    
    logger.info(f"Sentiment: {sentiment_label} -> {db_label}, confidence: {confidence:.3f}, language: {language}")
    
    if save_sentiment_result(review_id, db_label, confidence):
        logger.info("Result saved successfully!")
    else:
        logger.error("Failed to save result.")
    
    close_pool()


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Sentiment Analysis for Book Reviews')
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Maximum number of reviews to process (default: all)'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=50,
        help='Batch size for processing (default: 50)'
    )
    parser.add_argument(
        '--review-id',
        type=int,
        default=None,
        help='Analyze a specific review by ID'
    )
    
    args = parser.parse_args()
    
    if args.review_id:
        analyze_single_review(args.review_id)
    else:
        analyze_reviews(limit=args.limit, batch_size=args.batch_size)


if __name__ == "__main__":
    main()

