"""
会话管理API模块
提供会话的增删改查功能
"""
from flask import Blueprint, request, jsonify
from ..database import get_db
import logging
from .utils import make_response, parse_json

# 设置日志
logger = logging.getLogger(__name__)

# 创建蓝图
conversation_bp = Blueprint('conversation', __name__, url_prefix='/conversations')

@conversation_bp.route('', methods=['GET'])
def get_conversations():
    """获取会话列表，支持分页和筛选
    
    查询参数:
        page (int): 当前页码，默认为1
        pageSize (int): 每页记录数，默认为10
        searchText (str): 搜索文本，用于搜索会话ID、客户ID或主要问题
        agent (str): 客服名称
        resolutionStatus (str): 解决状态
        tag (str): 标签
        timeStart (str): 开始时间
        timeEnd (str): 结束时间
        
    返回:
        JSON: {
            "success": bool,
            "data": {
                "items": [ConversationListItem],
                "pagination": {
                    "current": int,
                    "pageSize": int,
                    "total": int
                }
            },
            "message": str (可选)
        }
    """
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

@conversation_bp.route('/<conversation_id>', methods=['GET'])
def get_conversation_detail(conversation_id):
    """获取指定ID的会话详情
    
    路径参数:
        conversation_id (str): 会话ID
        
    返回:
        JSON: {
            "success": bool,
            "data": ConversationData,
            "message": str (可选)
        }
    """
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

@conversation_bp.route('', methods=['POST'])
def create_conversation():
    """创建新的会话记录
    
    请求体:
        JSON: ConversationData
        
    必需字段:
        id (str): 会话ID
        time (str): 会话时间
        agent (str): 客服名称
        customerInfo (obj): 客户信息
        conversationSummary (obj): 会话摘要
        
    返回:
        JSON: {
            "success": bool,
            "data": {"id": str},
            "message": str (可选)
        }
    """
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

@conversation_bp.route('/<conversation_id>', methods=['PUT'])
def update_conversation(conversation_id):
    """更新指定ID的会话记录
    
    路径参数:
        conversation_id (str): 会话ID
        
    请求体:
        JSON: 部分或完整的ConversationData
        
    返回:
        JSON: {
            "success": bool,
            "data": {"id": str},
            "message": str (可选)
        }
    """
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

@conversation_bp.route('/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    """删除指定ID的会话记录
    
    路径参数:
        conversation_id (str): 会话ID
        
    返回:
        JSON: {
            "success": bool,
            "data": {"id": str},
            "message": str (可选)
        }
    """
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
