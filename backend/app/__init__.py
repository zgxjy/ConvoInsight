from flask import Flask
from flask_cors import CORS
from .config import Config
from .database import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 启用CORS
    CORS(app)
    
    # 初始化数据库连接
    init_db(app)
    
    # 注册API蓝图
    from .api import init_app as init_api
    init_api(app)
    
    return app
