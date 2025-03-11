"""
系统API模块
提供系统健康检查和状态信息
"""
from flask import Blueprint, jsonify
import logging
from .utils import make_response
import platform
import sys
from datetime import datetime

# 设置日志
logger = logging.getLogger(__name__)

# 创建蓝图
system_bp = Blueprint('system', __name__)

@system_bp.route('/health', methods=['GET'])
def health_check():
    """系统健康检查
    
    返回:
        JSON: {
            "success": bool,
            "data": {
                "status": str,
                "version": str,
                "timestamp": str,
                "environment": {
                    "python": str,
                    "platform": str
                }
            },
            "message": str (可选)
        }
    """
    try:
        # 获取系统信息
        python_version = sys.version
        platform_info = platform.platform()
        current_time = datetime.now().isoformat()
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data={
                'status': 'ok',
                'version': '1.0.0',
                'timestamp': current_time,
                'environment': {
                    'python': python_version,
                    'platform': platform_info
                }
            }
        ))
    
    except Exception as e:
        logger.error(f"健康检查出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"健康检查出错: {str(e)}",
            data={
                'status': 'error'
            }
        ))
