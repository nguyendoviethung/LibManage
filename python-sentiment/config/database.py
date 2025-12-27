"""
Database configuration and connection for sentiment analysis service
"""
import os
import logging
from psycopg_pool import ConnectionPool
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "dbname": os.getenv("DB_NAME", "LibManage"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "2107"),
}

connection_pool = ConnectionPool(
    conninfo=(
        f"host={DB_CONFIG['host']} "
        f"port={DB_CONFIG['port']} "
        f"dbname={DB_CONFIG['dbname']} "
        f"user={DB_CONFIG['user']} "
        f"password={DB_CONFIG['password']}"
    ),
    min_size=1,
    max_size=10,
)

def get_connection():
    return connection_pool.getconn()

def return_connection(conn):
    connection_pool.putconn(conn)

def close_pool():
    connection_pool.close()

def test_connection():
    try:
        with connection_pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                version = cur.fetchone()
                logger.info(f"Connected to PostgreSQL: {version[0]}")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
