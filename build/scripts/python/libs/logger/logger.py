import logging

_log_format = f"%(asctime)s - [%(levelname)s] - %(message)s"

def get_stream_handler(level):
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(level)
    stream_handler.setFormatter(logging.Formatter(_log_format))
    return stream_handler

def get_logger(name, level = logging.INFO):
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(get_stream_handler(level))
    return logger

logger = get_logger(__name__)