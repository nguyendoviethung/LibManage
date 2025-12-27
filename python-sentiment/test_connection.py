"""
Test script to verify database connection and basic functionality
"""
import sys
import os

# Add project root to PYTHONPATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from config.database import test_connection, close_pool
from utils.db_fetcher import get_unanalyzed_reviews, get_review_by_id


def main():
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)

    # 1. Test DB connection
    if not test_connection():
        print("✗ Database connection failed!")
        return
    print("✓ Database connection successful!")

    # 2. Test fetching unanalyzed reviews
    print("\nTesting fetch unanalyzed reviews...")
    reviews = get_unanalyzed_reviews(limit=5)
    print(f"✓ Found {len(reviews)} unanalyzed reviews")

    if reviews:
        sample = reviews[0]
        print("\nSample review:")
        print(f"  Review ID : {sample.get('review_id')}")
        print(f"  Book ID   : {sample.get('book_id')}")
        print(f"  Rating   : {sample.get('rating')}")
        print(f"  Comment  : {sample.get('comment', '')[:100]}")

        # 3. Test get review by ID
        print("\nTesting fetch review by ID...")
        review = get_review_by_id(sample["review_id"])
        if review:
            print("✓ Fetch review by ID successful!")
        else:
            print("✗ Failed to fetch review by ID")

    # 4. Close pool
    close_pool()

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":
    main()
