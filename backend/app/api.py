from flask import Blueprint, request, jsonify, current_app
from .database import get_db
from .models import (
    ConversationData, ConversationListItem, PaginationData, 
    ApiResponse, PaginatedResponse
)
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
import json
from bson import json_util

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建蓝图
api_bp = Blueprint('api', __name__)

# 辅助函数：将MongoDB对象转换为JSON
def parse_json(data):
    """将MongoDB对象转换为JSON字符串，然后再解析为Python对象"""
    return json.loads(json_util.dumps(data))

# 辅助函数：构建标准API响应
def make_response(success: bool, data: Any = None, message: str = None) -> Dict:
    """构建标准API响应格式"""
    response = {
        'success': success,
        'data': data or {}
    }
    if message:
        response['message'] = message
    return response

@api_bp.route('/conversations', methods=['GET'])
def get_conversations():
    """获取会话列表，支持分页和筛选"""
    try:
        # 获取查询参数
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 10))
        
        # 获取筛选参数
        filters = {}
        search_text = request.args.get('searchText')
        agent = request.args.get('agent')
        status = request.args.get('resolutionStatus')
        time_start = request.args.get('timeStart')
        time_end = request.args.get('timeEnd')
        tag = request.args.get('tag')
        
        # 构建查询条件
        query = {}
        
        # 文本搜索
        if search_text:
            # 创建文本搜索条件（ID、客户ID或主要问题）
            text_query = {
                '$or': [
                    {'id': {'$regex': search_text, '$options': 'i'}},
                    {'customerInfo.userId': {'$regex': search_text, '$options': 'i'}},
                    {'conversationSummary.mainIssue': {'$regex': search_text, '$options': 'i'}}
                ]
            }
            query.update(text_query)
        
        # 客服筛选
        if agent:
            query['agent'] = agent
        
        # 状态筛选
        if status:
            query['conversationSummary.resolutionStatus.status'] = status
        
        # 标签筛选
        if tag:
            query['tags'] = tag
        
        # 时间范围筛选
        if time_start or time_end:
            time_query = {}
            if time_start:
                time_query['$gte'] = time_start
            if time_end:
                time_query['$lte'] = time_end
            
            if time_query:
                query['time'] = time_query
        
        # 获取数据库连接
        db = get_db()
        
        # 计算总数
        total = db.conversations.count_documents(query)
        
        # 分页查询
        skip = (page - 1) * page_size
        cursor = db.conversations.find(query).sort('time', -1).skip(skip).limit(page_size)
        
        # 转换为列表项
        items = []
        for doc in cursor:
            # 确保所有必要字段都存在
            # 转换为列表项格式
            list_item = {
                'id': doc.get('id', ''),
                'time': doc.get('time', ''),
                'agent': doc.get('agent', ''),
                'customerId': doc.get('customerInfo', {}).get('userId', '未知用户'),
                'mainIssue': doc.get('conversationSummary', {}).get('mainIssue', '未分类问题'),
                'resolutionStatus': doc.get('conversationSummary', {}).get('resolutionStatus', {}).get('status', '未解决'),
                'tags': doc.get('tags', []),
                'satisfaction': doc.get('metrics', {}).get('satisfaction', {}).get('value', 0)
            }
            items.append(list_item)
        
        # 构建分页数据
        pagination = {
            'current': page,
            'pageSize': page_size,
            'total': total
        }
        
        # 构建响应
        response = make_response(
            success=True,
            data={
                'items': items,
                'pagination': pagination
            }
        )
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"获取会话列表出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取会话列表出错: {str(e)}",
            data={
                'items': [],
                'pagination': {
                    'current': 1,
                    'pageSize': 10,
                    'total': 0
                }
            }
        ))

@api_bp.route('/conversations/<conversation_id>', methods=['GET'])
def get_conversation_detail(conversation_id):
    """获取指定ID的会话详情"""
    try:
        # 获取数据库连接
        db = get_db()
        
        # 查询会话
        conversation = db.conversations.find_one({'id': conversation_id})
        
        if not conversation:
            return jsonify(make_response(
                success=False,
                message=f"未找到ID为 {conversation_id} 的会话",
                data={}
            ))
        
        # 移除MongoDB的_id字段
        conversation = parse_json(conversation)
        if '_id' in conversation:
            del conversation['_id']
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data=conversation
        ))
    
    except Exception as e:
        logger.error(f"获取会话详情出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取会话详情出错: {str(e)}",
            data={}
        ))

@api_bp.route('/conversations', methods=['POST'])
def create_conversation():
    """创建新的会话记录"""
    try:
        # 获取请求数据
        data = request.json
        if not data:
            return jsonify(make_response(
                success=False,
                message="请求数据为空",
                data={}
            ))
        
        # 验证必要字段
        required_fields = ['id', 'time', 'agent', 'customerInfo', 'conversationSummary']
        for field in required_fields:
            if field not in data:
                return jsonify(make_response(
                    success=False,
                    message=f"缺少必要字段: {field}",
                    data={}
                ))
        
        # 获取数据库连接
        db = get_db()
        
        # 检查ID是否已存在
        existing = db.conversations.find_one({'id': data['id']})
        if existing:
            return jsonify(make_response(
                success=False,
                message=f"ID为 {data['id']} 的会话已存在",
                data={}
            ))
        
        # 插入数据
        result = db.conversations.insert_one(data)
        
        if result.acknowledged:
            return jsonify(make_response(
                success=True,
                message="会话创建成功",
                data={'id': data['id']}
            ))
        else:
            return jsonify(make_response(
                success=False,
                message="会话创建失败",
                data={}
            ))
    
    except Exception as e:
        logger.error(f"创建会话出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"创建会话出错: {str(e)}",
            data={}
        ))

@api_bp.route('/conversations/<conversation_id>', methods=['PUT'])
def update_conversation(conversation_id):
    """更新指定ID的会话记录"""
    try:
        # 获取请求数据
        data = request.json
        if not data:
            return jsonify(make_response(
                success=False,
                message="请求数据为空",
                data={}
            ))
        
        # 获取数据库连接
        db = get_db()
        
        # 检查会话是否存在
        existing = db.conversations.find_one({'id': conversation_id})
        if not existing:
            return jsonify(make_response(
                success=False,
                message=f"未找到ID为 {conversation_id} 的会话",
                data={}
            ))
        
        # 防止修改ID
        if 'id' in data and data['id'] != conversation_id:
            return jsonify(make_response(
                success=False,
                message="不允许修改会话ID",
                data={}
            ))
        
        # 更新数据
        result = db.conversations.update_one(
            {'id': conversation_id},
            {'$set': data}
        )
        
        if result.modified_count > 0:
            return jsonify(make_response(
                success=True,
                message="会话更新成功",
                data={'id': conversation_id}
            ))
        else:
            return jsonify(make_response(
                success=True,
                message="会话未发生变化",
                data={'id': conversation_id}
            ))
    
    except Exception as e:
        logger.error(f"更新会话出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"更新会话出错: {str(e)}",
            data={}
        ))

@api_bp.route('/conversations/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    """删除指定ID的会话记录"""
    try:
        # 获取数据库连接
        db = get_db()
        
        # 检查会话是否存在
        existing = db.conversations.find_one({'id': conversation_id})
        if not existing:
            return jsonify(make_response(
                success=False,
                message=f"未找到ID为 {conversation_id} 的会话",
                data={}
            ))
        
        # 删除数据
        result = db.conversations.delete_one({'id': conversation_id})
        
        if result.deleted_count > 0:
            return jsonify(make_response(
                success=True,
                message="会话删除成功",
                data={'id': conversation_id}
            ))
        else:
            return jsonify(make_response(
                success=False,
                message="会话删除失败",
                data={}
            ))
    
    except Exception as e:
        logger.error(f"删除会话出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"删除会话出错: {str(e)}",
            data={}
        ))

# 辅助路由，用于获取所有客服和状态选项
@api_bp.route('/options', methods=['GET'])
def get_options():
    """获取筛选选项数据"""
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

@api_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """获取会话统计数据"""
    try:
        # 获取数据库连接
        db = get_db()
        
        # 获取总会话数
        total_conversations = db.conversations.count_documents({})
        
        # 按状态统计会话数
        status_stats = []
        statuses = db.conversations.distinct('conversationSummary.resolutionStatus.status')
        for status in statuses:
            count = db.conversations.count_documents({
                'conversationSummary.resolutionStatus.status': status
            })
            status_stats.append({
                'status': status,
                'count': count
            })
        
        # 按客服统计会话数
        agent_stats = []
        agents = db.conversations.distinct('agent')
        for agent in agents:
            count = db.conversations.count_documents({
                'agent': agent
            })
            agent_stats.append({
                'agent': agent,
                'count': count
            })
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data={
                'totalConversations': total_conversations,
                'statusStatistics': status_stats,
                'agentStatistics': agent_stats
            }
        ))
    
    except Exception as e:
        logger.error(f"获取统计数据出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取统计数据出错: {str(e)}",
            data={}
        ))

@api_bp.route('/tags', methods=['GET'])
def get_tags():
    """获取所有标签及其使用频率"""
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

@api_bp.route('/health', methods=['GET'])
def health_check():
    """API健康检查"""
    try:
        # 获取数据库连接
        db = get_db()
        
        # 尝试执行简单查询
        db.conversations.find_one({})
        
        return jsonify(make_response(
            success=True,
            data={
                'status': 'healthy',
                'timestamp': datetime.now().isoformat()
            }
        ))
    
    except Exception as e:
        logger.error(f"健康检查失败: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"健康检查失败: {str(e)}",
            data={
                'status': 'unhealthy',
                'timestamp': datetime.now().isoformat()
            }
        )), 500
