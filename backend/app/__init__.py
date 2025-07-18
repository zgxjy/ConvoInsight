from flask import Flask, send_from_directory
from flask_cors import CORS
from .config import Config
from .database import init_db
import os

def create_app():
    # 将静态文件目录指向前端的build目录
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'build'))
    
    app = Flask(__name__, static_folder=static_folder, static_url_path='')
    app.config.from_object(Config)
    
    # 启用CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # 初始化数据库连接
    init_db(app)
    
    # 注册API蓝图
    from .api import init_app as init_api
    init_api(app)

    # 服务前端应用的路由
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    return app
