from flask import Flask, current_app, g
from pymongo import MongoClient
import logging

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db():
    """获取数据库连接"""
    if 'db' not in g:
        try:
            # 创建MongoDB客户端连接
            client = MongoClient(current_app.config['MONGODB_URI'])
            # 获取数据库
            db = client[current_app.config['DB_NAME']]
            g.client = client
            g.db = db
            logger.info(f"已连接到MongoDB: {current_app.config['DB_NAME']}")
        except Exception as e:
            logger.error(f"MongoDB连接失败: {str(e)}")
            raise e
    
    return g.db

def close_db(e=None):
    """关闭数据库连接"""
    client = g.pop('client', None)
    
    if client is not None:
        client.close()
        logger.info("MongoDB连接已关闭")

def init_db(app: Flask):
    """初始化数据库"""
    # 注册关闭连接的回调
    app.teardown_appcontext(close_db)
    
    # 创建索引等初始化操作
    with app.app_context():
        db = get_db()
        # 确保conversations集合上有索引
        db.conversations.create_index("id", unique=True)
        logger.info("MongoDB索引已创建")
