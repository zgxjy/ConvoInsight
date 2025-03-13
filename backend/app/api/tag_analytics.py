from flask import Blueprint, jsonify, request
from ..database import get_db
import logging
from .utils import make_response, parse_json
from datetime import datetime, timedelta

# 设置日志
logger = logging.getLogger(__name__)

# 创建蓝图，不指定URL前缀，让父蓝图处理
tag_analytics_bp = Blueprint('tag_analytics', __name__)

@tag_analytics_bp.route("/tag/<tag_name>", methods=['GET'])
def get_tag_analysis(tag_name):
    """
    获取特定标签的分析数据
    
    查询参数:
        page (int): 当前页码，默认为1
        pageSize (int): 每页记录数，默认为10
        searchText (str): 搜索文本，用于搜索会话ID、客户ID或主要问题
        agent (str): 客服名称
        resolutionStatus (str): 解决状态
        timeStart (str): 开始时间
        timeEnd (str): 结束时间
        
    返回:
        JSON: {
            "success": bool,
            "data": {
                "tag": str,
                "count": int,
                "resolved": float,
                "partially_resolved": float,
                "unresolved": float,
                "conversations": [
                    {
                        "id": str,
                        "title": str,
                        "time": str,
                        "agent": str,
                        "customerId": str,
                        "mainIssue": str,
                        "status": str,
                        "satisfaction": float
                    }
                ],
                "pagination": {
                    "current": int,
                    "pageSize": int,
                    "total": int
                }
            },
            "message": str
        }
    """
    try:
        # 记录请求日志
        logger.info(f"收到标签分析请求: {tag_name}")
        
        # 获取查询参数
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 10))
        
        # 获取筛选参数
        search_text = request.args.get('searchText')
        agent = request.args.get('agent')
        status = request.args.get('resolutionStatus')
        time_start = request.args.get('timeStart')
        time_end = request.args.get('timeEnd')
        
        # 构建查询条件
        query = {'tags': tag_name}
        
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
        
        if total == 0:
            logger.warning(f"未找到标签: {tag_name}")
            return jsonify(make_response(
                success=False,
                message=f"未找到标签: {tag_name}",
                data=None
            )), 404
        
        # 分页查询
        skip = (page - 1) * page_size
        cursor = db.conversations.find(query).sort('time', -1).skip(skip).limit(page_size)
        
        # 获取所有符合条件的会话（用于统计）
        all_tag_conversations = list(db.conversations.find({'tags': tag_name}))
        tag_count = len(all_tag_conversations)
        
        # 统计不同解决状态的数量
        resolved_count = 0
        partially_resolved_count = 0
        unresolved_count = 0
        
        for conv in all_tag_conversations:
            resolution_status = conv.get('conversationSummary', {}).get('resolutionStatus', {}).get('status', '')
            if resolution_status.lower() == '已解决':
                resolved_count += 1
            elif resolution_status.lower() == '部分解决':
                partially_resolved_count += 1
            else:
                unresolved_count += 1
        
        # 计算百分比
        resolved_percentage = (resolved_count / tag_count) * 100 if tag_count > 0 else 0
        partially_resolved_percentage = (partially_resolved_count / tag_count) * 100 if tag_count > 0 else 0
        unresolved_percentage = (unresolved_count / tag_count) * 100 if tag_count > 0 else 0
        
        # 格式化会话数据
        conversations = []
        for doc in cursor:
            # 确保所有必要字段都存在
            conversations.append({
                'id': doc.get('id', ''),
                'title': doc.get('title', '无标题会话'),
                'time': doc.get('time', ''),
                'agent': doc.get('agent', ''),
                'customerId': doc.get('customerInfo', {}).get('userId', '未知用户'),
                'mainIssue': doc.get('conversationSummary', {}).get('mainIssue', '未分类问题'),
                'status': doc.get('conversationSummary', {}).get('resolutionStatus', {}).get('status', '未解决'),
                'satisfaction': doc.get('metrics', {}).get('satisfaction', {}).get('value', 0),
                "resolution": doc.get('metrics', {}).get('resolution', {}).get('value', 0),
                "attitude": doc.get('metrics', {}).get('attitude', {}).get('value', 0),
                "risk": doc.get('metrics', {}).get('risk', {}).get('value', 0)
            })
        
        # 构建分页数据
        pagination = {
            'current': page,
            'pageSize': page_size,
            'total': total
        }
        
        return jsonify(make_response(
            success=True,
            message="获取标签分析数据成功",
            data={
                "tag": tag_name,
                "count": tag_count,
                "resolved": resolved_percentage,
                "partially_resolved": partially_resolved_percentage,
                "unresolved": unresolved_percentage,
                "conversations": conversations,
                "pagination": pagination
            }
        ))
    except Exception as e:
        logger.error(f"获取标签分析数据失败: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取标签分析数据失败: {str(e)}",
            data=None
        )), 500
