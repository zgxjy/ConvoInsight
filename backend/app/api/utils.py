"""
辅助工具函数模块
提供API共用的工具函数
"""
import json
from typing import Dict, Any
from bson import json_util
import logging

# 设置日志
logger = logging.getLogger(__name__)

def parse_json(data):
    """将MongoDB对象转换为JSON字符串，然后再解析为Python对象"""
    return json.loads(json_util.dumps(data))

def make_response(success: bool, data: Any = None, message: str = None) -> Dict:
    """构建标准API响应格式
    
    Args:
        success: 操作是否成功
        data: 响应数据
        message: 响应消息
        
    Returns:
        标准格式的API响应
    """
    response = {
        'success': success,
        'data': data or {}
    }
    if message:
        response['message'] = message
    return response
