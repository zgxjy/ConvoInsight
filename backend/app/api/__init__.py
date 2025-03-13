"""
API模块初始化文件
注册所有API蓝图
"""
from flask import Blueprint

# 创建主API蓝图
api_bp = Blueprint('api', __name__, url_prefix='/api')

# 导入各模块蓝图
from .conversation import conversation_bp
from .metadata import metadata_bp
from .analytics import analytics_bp
from .system import system_bp
from .tag_analytics import tag_analytics_bp

# 注册子蓝图
api_bp.register_blueprint(conversation_bp)
api_bp.register_blueprint(metadata_bp)
api_bp.register_blueprint(analytics_bp)
api_bp.register_blueprint(system_bp)
api_bp.register_blueprint(tag_analytics_bp)

# 导入工具函数，方便其他模块使用
from .utils import make_response, parse_json

# 定义初始化函数，用于在应用中注册API蓝图
def init_app(app):
    """在Flask应用中注册API蓝图
    
    Args:
        app: Flask应用实例
    """
    app.register_blueprint(api_bp)
    
    # 注册错误处理器
    register_error_handlers(app)
    
    return app

def register_error_handlers(app):
    """注册全局错误处理器
    
    Args:
        app: Flask应用实例
    """
    @app.errorhandler(404)
    def not_found(error):
        """处理404错误"""
        from flask import jsonify
        return jsonify(make_response(
            success=False,
            message="未找到请求的资源",
            data={}
        )), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """处理500错误"""
        from flask import jsonify
        return jsonify(make_response(
            success=False,
            message="服务器内部错误",
            data={}
        )), 500
