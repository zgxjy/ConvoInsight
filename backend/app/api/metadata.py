"""
元数据API模块
提供筛选选项和标签数据
"""
from flask import Blueprint, request, jsonify
from ..database import get_db
import logging
from .utils import make_response

# 设置日志
logger = logging.getLogger(__name__)

# 创建蓝图
metadata_bp = Blueprint('metadata', __name__)

@metadata_bp.route('/options', methods=['GET'])
def get_options():
    """获取筛选选项数据
    
    返回:
        JSON: {
            "success": bool,
            "data": {
                "agents": [str],
                "statuses": [str],
                "tags": [str]
            },
            "message": str (可选)
        }
    """
    try:
        # 获取数据库连接
        db = get_db()
        
        # 获取所有客服
        agents = db.conversations.distinct('agent')
        
        # 获取所有状态
        statuses = db.conversations.distinct('conversationSummary.resolutionStatus.status')
        
        # 获取所有标签
        tags = db.conversations.distinct('tags')
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data={
                'agents': agents,
                'statuses': statuses,
                'tags': tags
            }
        ))
    
    except Exception as e:
        logger.error(f"获取选项数据出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取选项数据出错: {str(e)}",
            data={
                'agents': [],
                'statuses': [],
                'tags': []
            }
        ))

@metadata_bp.route('/tags', methods=['GET'])
def get_tags():
    """获取所有标签及其使用频率
    
    返回:
        JSON: {
            "success": bool,
            "data": [
                {"tag": str, "count": int}
            ],
            "message": str (可选)
        }
    """
    try:
        # 获取数据库连接
        db = get_db()
        
        # 聚合查询，获取标签及其使用频率
        pipeline = [
            {'$unwind': '$tags'},
            {'$group': {'_id': '$tags', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]
        
        tag_stats = list(db.conversations.aggregate(pipeline))
        
        # 格式化结果
        formatted_tags = []
        for tag in tag_stats:
            formatted_tags.append({
                'tag': tag['_id'],
                'count': tag['count']
            })
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data=formatted_tags
        ))
    
    except Exception as e:
        logger.error(f"获取标签数据出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取标签数据出错: {str(e)}",
            data=[]
        ))
