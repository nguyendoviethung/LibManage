"""
Sentiment Analysis Model - Bilingual (Vietnamese & English)
Tích hợp và cải tiến từ code gốc
"""
import re
import os
import joblib
import numpy as np
import pandas as pd
from underthesea import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.utils.class_weight import compute_class_weight
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===== 1. TỪ ĐIỂN CHUẨN HÓA TIẾNG VIỆT =====

SLANG_DICT_VI = {
    # ===== TÍCH CỰC =====
    "oke": "rất hay", "okie": "rất hay", "okela": "rất hay", "ok": "hay",
    "tks": "cảm ơn", "thank": "cảm ơn", "thanks": "cảm ơn", "thx": "cảm ơn",
    "đỉnh": "xuất sắc", "ngon": "hay", "bá đạo": "rất hay",
    "xịn": "chất lượng", "xịn xò": "chất lượng", "đáng tiền": "rất đáng đọc",
    "cute": "dễ thương", "kool": "hay", "hay vl": "rất hay", "hay vãi": "rất hay",
    "quá hay": "rất hay", "đọc cuốn": "rất cuốn hút", "cuốn": "cuốn hút",
    "đỉnh cao": "xuất sắc", "best": "tốt nhất", "tuyệt": "tuyệt vời",
    "10 điểm": "rất hay", "siêu phẩm": "rất hay",

    # ===== TIÊU CỰC =====
    "vkl": "rất tệ", "vcl": "rất tệ", "vl": "rất", 
    "đm": "tệ", "vãi": "", "ngu": "không hay", 
    "tệ vl": "rất tệ", "trash": "rác", "chán vl": "rất chán",
    "fake": "giả mạo", "scam": "lừa đảo", "ảo": "không thực tế",
    "phèn": "thiếu chuyên nghiệp", "tởm": "kinh khủng", 
    "dở": "không hay", "nhạt": "thiếu hấp dẫn",
    "chán": "không thú vị", "nhảm": "thiếu nội dung",
    "ko hay": "không hay", "ko ra gì": "không hay", "tệ quá": "rất tệ",

    # ===== TRUNG TÍNH / VIẾT TẮT =====
    "vs": "với", "dc": "được", "đc": "được", 
    "k": "không", "ko": "không", "kh": "không",
    "hok": "không", "khum": "không", "hum": "hôm",
    "r": "rồi", "j": "gì", "cg": "cũng", "thik": "thích",
    "thjk": "thích", "tl": "trả lời", "nt": "nhắn tin", 
    "ad": "quản trị viên", "rep": "trả lời", "cmt": "bình luận",
    "ms": "mới", "mik": "mình", "mk": "mình", "mjh": "mình",
    "e": "em", "a": "anh", "c": "chị", "bn": "bạn", "bạn ơi": "bạn",
    "đag": "đang", "đag đọc": "đang đọc", "đọc xog": "đọc xong",
    "rất ổn": "tốt", "tạm": "bình thường",

    # ===== BIỂU CẢM =====
    "wow": "thật tuyệt", "huhu": "buồn", "haha": "", "kkk": "",
    "lol": "", "lmao": "", "omg": "trời ơi", "wtf": "thật bất ngờ",
}


# ===== 2. TỪ ĐIỂN CHUẨN HÓA TIẾNG ANH =====

SLANG_DICT_EN = {
    # ===== POSITIVE =====
    "gr8": "great", "gud": "good", "gd": "good", "gud1": "good one",
    "awesome": "excellent", "awsome": "awesome", "amazin": "amazing",
    "luv": "love", "loved": "loved", "lovin": "loving", "lovd": "loved",
    "thnx": "thanks", "thx": "thanks", "ty": "thank you", "thks": "thanks",
    "plz": "please", "pls": "please", "tysm": "thank you so much",
    "lol": "", "omg": "oh my god", "rofl": "", "lmao": "", "lmfao": "",
    "imo": "in my opinion", "imho": "in my humble opinion",
    "tbh": "to be honest", "ngl": "not gonna lie",
    "af": "very", "asf": "very", "af": "as hell",
    "dope": "great", "sick": "great", "lit": "great", "fire": "excellent",
    "goat": "greatest of all time", "perf": "perfect", "perfecto": "perfect",
    "brill": "brilliant", "fab": "fabulous", "stellar": "excellent",
    "10/10": "excellent", "5/5": "excellent", "A+": "excellent",
    
    # ===== NEGATIVE =====
    "sux": "sucks", "sucks": "terrible", "sucked": "terrible",
    "terrible": "very bad", "awful": "very bad", "horrible": "very bad",
    "wtf": "what the hell", "bs": "nonsense", "crap": "bad",
    "trash": "garbage", "garbage": "terrible", "worst": "very bad",
    "sht": "bad", "shitty": "bad", "crappy": "bad",
    "meh": "mediocre", "bleh": "boring", "ugh": "disappointing",
    "disappointing": "very disappointing", "dissapointing": "disappointing",
    "waste": "waste of time", "boring": "very boring", "bored": "boring",
    "lame": "bad", "weak": "poor", "pathetic": "terrible",
    "overrated": "not as good", "overhyped": "disappointing",
    
    # ===== NEUTRAL / CONTRACTIONS =====
    "gonna": "going to", "wanna": "want to", "gotta": "got to",
    "lemme": "let me", "gimme": "give me", "dunno": "do not know",
    "kinda": "kind of", "sorta": "sort of", "lotta": "lot of",
    "ain't": "is not", "wasn't": "was not", "weren't": "were not",
    "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
    "won't": "will not", "wouldn't": "would not", "shouldn't": "should not",
    "can't": "cannot", "couldn't": "could not", "mustn't": "must not",
    "don't": "do not", "doesn't": "does not", "didn't": "did not",
    "isn't": "is not", "aren't": "are not",
    "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is",
    "it's": "it is", "we're": "we are", "they're": "they are",
    "i've": "i have", "you've": "you have", "we've": "we have",
    "i'll": "i will", "you'll": "you will", "he'll": "he will",
    "i'd": "i would", "you'd": "you would", "he'd": "he would",
    
    # ===== INTERNET SLANG =====
    "u": "you", "ur": "your", "ure": "you are", "urself": "yourself",
    "r": "are", "b": "be", "c": "see", "y": "why", "n": "and",
    "2": "to", "4": "for", "b4": "before", "cuz": "because",
    "bcuz": "because", "bcz": "because", "coz": "because",
    "tho": "though", "thru": "through", "w/": "with", "w/o": "without",
    "bout": "about", "abt": "about", "smth": "something", "sth": "something",
    "ppl": "people", "peeps": "people", "bro": "brother", "sis": "sister",
    "fam": "family", "bruh": "", "yall": "you all", "yup": "yes",
    "nope": "no", "nah": "no", "yeah": "yes", "yep": "yes",
    "gotcha": "got it", "dunno": "do not know", "idk": "i do not know",
    "ikr": "i know right", "irl": "in real life", "rn": "right now",
    "asap": "as soon as possible", "fyi": "for your information",
    "btw": "by the way", "aka": "also known as", "etc": "et cetera",
}


# ===== 3. STOPWORDS TIẾNG VIỆT =====

STOPWORDS_VI = {
   "tôi", "ta", "mình", "bạn", "cậu", "họ", "nó", "anh", "chị", "em",
    "người", "ai", "gì", "này", "kia", "ấy", "đó", "đấy", "vậy", "thế",
    "thì", "là", "mà", "và", "với", "cho", "từ", "đến", "tại", "ở",
    "qua", "ra", "vào", "bằng", "về", "do", "của", "cùng", "theo", "bởi",
    "cũng", "đều", "đang", "đã", "sẽ", "vừa", "mới", "còn", "nữa", "luôn",
    "suốt", "lại", "chưa", "từng", "hay", "thường",
    "vì", "nên", "nếu", "khi", "như", "dù", "mặc", "thế", "bởi",
    "tuy", "nhưng", "để",
    "một", "hai", "ba", "nhiều", "ít", "hơn", "các", "những", "mọi", "tất", "cả",
    "à", "ừ", "ờ", "ơ", "hả", "hở", "ha", "há", "nhé", "nhỉ", "thôi",
    "chứ", "đi", "nha", "nhe", "với", "đấy", "rồi",
}


# ===== 4. STOPWORDS TIẾNG ANH =====

STOPWORDS_EN = {
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves",
    "you", "your", "yours", "yourself", "yourselves",
    "he", "him", "his", "himself", "she", "her", "hers", "herself",
    "it", "its", "itself", "they", "them", "their", "theirs", "themselves",
    "what", "which", "who", "whom", "this", "that", "these", "those",
    "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "having", "do", "does", "did", "doing",
    "will", "would", "should", "could", "can", "may", "might", "must",
    "a", "an", "the", "and", "but", "if", "or", "because", "as",
    "until", "while", "of", "at", "by", "for", "with", "about",
    "against", "between", "into", "through", "during", "before", "after",
    "above", "below", "to", "from", "up", "down", "in", "out", "on", "off",
    "over", "under", "again", "further", "then", "once",
    "here", "there", "when", "where", "why", "how", "all", "both", "each",
    "few", "more", "most", "other", "some", "such", "no", "nor", "not",
    "only", "own", "same", "so", "than", "too", "very", "just",
    "um", "uh", "hmm", "oh", "ah", "well", "like", "you know", "i mean",
}


# ===== 5. PHÁT HIỆN NGÔN NGỮ =====

def detect_language(text):
    """Phát hiện ngôn ngữ của text (Vietnamese hoặc English)"""
    if not isinstance(text, str):
        return 'unknown'
    
    vietnamese_chars = len(re.findall(r'[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]', text.lower()))
    english_chars = len(re.findall(r'[a-z]', text.lower()))
    
    if vietnamese_chars == 0 and english_chars == 0:
        return 'unknown'
    
    total_chars = vietnamese_chars + english_chars
    vietnamese_ratio = vietnamese_chars / total_chars if total_chars > 0 else 0
    
    if vietnamese_ratio > 0.3:
        return 'vi'
    elif vietnamese_ratio > 0.05:
        return 'mixed'
    else:
        return 'en'


# ===== 6. HÀM CHUẨN HÓA SLANG =====

def normalize_slang(text, lang='vi'):
    """Chuẩn hóa từ lóng dựa theo ngôn ngữ"""
    slang_dict = SLANG_DICT_VI if lang == 'vi' else SLANG_DICT_EN
    
    words = text.split()
    normalized = [slang_dict.get(w, w) for w in words]
    return " ".join(normalized)


def handle_negation(text):
    """Xử lý phủ định bằng cách gắn prefix NOT_ vào từ sau"""
    negation_words = {
        "không", "chẳng", "chưa", "chả", "không_thể",
        "dở", "tệ", "kém", "nhạt", "chán", "tồi"
    }
    
    words = text.split()
    result = []
    negate = False
    
    for word in words:
        if word in negation_words:
            result.append(word)
            negate = True
        elif negate:
            result.append(f"NOT_{word}")
            negate = False
        else:
            result.append(word)
    
    return " ".join(result)


# ===== 7. CHUẨN HÓA KÝ TỰ LẶP =====

def normalize_repeated_chars(text):
    """Chuẩn hóa ký tự lặp (vd: greaaaaat -> great)"""
    return re.sub(r"(.)\1{2,}", r"\1\1", text)


def normalize_ratings(text):
    """Chuẩn hóa các cụm từ rating số thành token dễ học"""
    rating_pattern_slash = r'(\d+)\s*/\s*(\d+)'
    text = re.sub(rating_pattern_slash, r' RATING_\1DIV\2 ', text)
    
    rating_pattern_word = r'(\d+)\s*(điểm|sao|star|stars)'
    text = re.sub(rating_pattern_word, r' RATING_\1 ', text)
    
    text = re.sub(r'đánh\s*giá', 'REVIEW_RATING', text)
    
    return text


# ===== 8. PIPELINE TIỀN XỬ LÝ =====

def preprocess_text_advanced(text, remove_accents=False, keep_stopwords=False):
    """Tiền xử lý văn bản nâng cao cho cả tiếng Việt và tiếng Anh"""
    if not isinstance(text, str):
        return ""
    
    lang = detect_language(text)
    text = text.lower()
    text = normalize_ratings(text)
    
    text = re.sub(r"!+", " TOKEN_EXCLAIM ", text)
    text = re.sub(r"\?+", " TOKEN_QUESTION ", text)
    
    if lang in ['vi', 'mixed']:
        try:
            text = word_tokenize(text, format="text")
        except:
            pass
    
    text = re.sub(r"(.)\1{2,}", r"\1\1", text)
    text = handle_negation(text)
    
    if lang == 'vi':
        text = normalize_slang(text, lang='vi')
    elif lang == 'en':
        text = normalize_slang(text, lang='en')
    
    text = re.sub(r"[^a-zA-ZÀ-ỹ0-9\s_]", " ", text)
    
    if not keep_stopwords:
        words = text.split()
        special_tokens = {"review_rating"}
        filtered = [w for w in words if (w not in STOPWORDS_VI and len(w) > 1) or w in special_tokens]
        text = " ".join(filtered)
    
    text = re.sub(r"\s+", " ", text).strip()
    
    return text


# ===== 9. PHÁT HIỆN RÁC =====

def is_gibberish_review(text):
    """Phát hiện comment rác cho cả tiếng Việt và tiếng Anh"""
    if not isinstance(text, str):
        return True

    original_text = text.strip()
    text = original_text.lower()

    if len(text) < 2:
        return True

    if re.search(r"[!?\u263a-\U0001f645]", text):
        return False

    if re.fullmatch(r"\d+[/\s]?\d*\s?(stars?|điểm)?", text):
        return False

    unique_chars = len(set(text.replace(" ", "")))
    if unique_chars < 3:
        return True

    if re.search(r"(.)\1{3,}", text):
        return True

    if not re.search(r'[a-zA-ZÀ-ỹ]', text):
        return True

    MEANINGFUL_KEYWORDS = {
        "hay", "tốt", "dở", "tuyệt", "chán", "đáng", "thích", "vui", "buồn",
        "xuất sắc", "kinh khủng", "ổn", "tạm", "được", "cuốn", "nhàm",
        "tệ", "kém", "ghê", "đỉnh", "ngon", "dễ", "khó",
        "sách", "truyện", "nội dung", "tác giả", "câu chuyện",
        "good", "bad", "great", "awesome", "terrible", "love", "hate", "like",
        "amazing", "excellent", "poor", "worst", "best", "boring", "interesting",
        "wonderful", "fantastic", "horrible", "awful", "nice", "beautiful",
        "disappointing", "happy", "sad", "enjoy", "loved", "worth", "quality",
        "book", "read", "story", "author", "content", "novel", "writing",
        "recommend", "reading", "finished"
    }
    
    if any(keyword in text for keyword in MEANINGFUL_KEYWORDS):
        return False

    words = text.split()
    if len(words) == 0:
        return True
    
    valid_words = sum(1 for w in words if len(w) > 1 and re.search(r"[a-zA-ZÀ-ỹ]", w))
    
    if valid_words / len(words) < 0.5:
        return True

    letters = [c for c in text if c.isalpha()]
    if len(letters) > 0:
        vowels = sum(1 for c in letters if c in "aáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵeiou")
        vowel_ratio = vowels / len(letters)
        
        if vowel_ratio < 0.15 or vowel_ratio > 0.85:
            return True

    nonsense_count = 0
    for word in words:
        if len(word) > 3:
            char_variety = len(set(word)) / len(word)
            if char_variety < 0.4:
                nonsense_count += 1
    
    if len(words) > 2 and nonsense_count >= len(words) * 0.7:
        return True

    if len(original_text) < 4:
        return True

    return False


# ===== 10. CLASS SENTIMENT ANALYZER =====

class SentimentAnalyzer:
    """Sentiment Analyzer class với khả năng load model và predict"""
    
    def __init__(self, model_path=None):
        """
        Initialize sentiment analyzer
        
        Args:
            model_path: Path to saved model file (.pkl)
        """
        self.model = None
        self.vectorizer = None
        self.model_path = model_path or os.path.join(
            os.path.dirname(__file__), 
            '..', 
            'models', 
            'sentiment_model_bilingual.pkl'
        )
        self.load_model()
    
    def load_model(self):
        """Load model from file"""
        try:
            if os.path.exists(self.model_path):
                data = joblib.load(self.model_path)
                self.model = data.get("model")
                self.vectorizer = data.get("vectorizer")
                logger.info(f"Model loaded successfully from {self.model_path}")
                return True
            else:
                logger.warning(f"Model file not found at {self.model_path}")
                return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def predict(self, text):
        """
        Predict sentiment for a text
        
        Args:
            text: Input text to analyze
        
        Returns:
            Tuple of (sentiment_label, confidence, language)
            sentiment_label: -1 (negative), 0 (neutral), 1 (positive), or "SPAM"
        """
        if not self.model or not self.vectorizer:
            logger.error("Model not loaded. Cannot predict.")
            return None, 0.0, 'unknown'
        
        lang = detect_language(text)
        
        # Layer 1: Check gibberish
        if is_gibberish_review(text):
            return "SPAM", 0.0, lang
        
        # Layer 2: Preprocess
        processed = preprocess_text_advanced(text, remove_accents=False, keep_stopwords=False)
        
        if not processed.strip():
            return "SPAM", 0.0, lang
        
        # Layer 3: Predict
        try:
            vec = self.vectorizer.transform([processed])
            pred = self.model.predict(vec)[0]
            proba_array = self.model.predict_proba(vec)[0]
            max_proba = proba_array.max()
            
            # Layer 4: Check low confidence
            if max_proba < 0.25:
                return 0, max_proba, lang  # neutral
            
            # Layer 5: Check probability distribution
            sorted_proba = sorted(proba_array, reverse=True)
            if len(sorted_proba) > 1:
                diff = sorted_proba[0] - sorted_proba[1]
                if diff < 0.10:
                    return 0, max_proba, lang  # neutral
            
            return pred, max_proba, lang
            
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return 0, 0.0, lang
    
    def predict_batch(self, texts):
        """
        Predict sentiment for multiple texts
        
        Args:
            texts: List of texts to analyze
        
        Returns:
            List of tuples (sentiment_label, confidence, language)
        """
        results = []
        for text in texts:
            result = self.predict(text)
            results.append(result)
        return results


# ===== 11. MAP LABEL TO DATABASE FORMAT =====

def map_sentiment_to_db_label(sentiment_label):
    """
    Map sentiment label to database format
    
    Args:
        sentiment_label: Model prediction (could be -1, 0, 1, "SPAM", "neu", "pos", "neg")
    
    Returns:
        Integer: -1 (negative), 0 (neutral), 1 (positive)
    """
    if isinstance(sentiment_label, str):
        label_lower = sentiment_label.lower()
        if label_lower in ['spam', 'neu', 'neutral']:
            return 0
        elif label_lower in ['pos', 'positive', '1']:
            return 1
        elif label_lower in ['neg', 'negative', '-1']:
            return -1
        else:
            return 0  # Default to neutral
    else:
        # Already numeric
        if sentiment_label == "SPAM":
            return 0
        return int(sentiment_label) if sentiment_label in [-1, 0, 1] else 0

