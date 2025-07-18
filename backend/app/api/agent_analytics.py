from flask import Blueprint, jsonify, request
from ..database import get_db
import logging
from .utils import make_response, parse_json
from datetime import datetime, timedelta

# 设置日志
logger = logging.getLogger(__name__)

# 创建蓝图，不指定URL前缀，让父蓝图处理
agent_analytics_bp = Blueprint('agent_analytics', __name__)

@agent_analytics_bp.route("/agent/<agent_name>", methods=['GET'])
def get_agent_analysis(agent_name):
    """
    获取特定客服的分析数据
    
    查询参数:
        page (int): 当前页码，默认为1
        pageSize (int): 每页记录数，默认为10
        searchText (str): 搜索文本，用于搜索会话ID、客户ID或主要问题
        tag (str): 标签名称
        resolutionStatus (str): 解决状态
        timeStart (str): 开始时间
        timeEnd (str): 结束时间
        
    返回:
        JSON: {
            "success": bool,
            "data": {
                "agent": str,
                "count": int,
                "performance": {
                    "resolved": float,
                    "partially_resolved": float,
                    "unresolved": float,
                    "avg_satisfaction": float,
                    "avg_resolution": float,
                    "avg_attitude": float,
                    "avg_security": float,
                    "overall_performance": float,
                    "avg_response_time": float,
                    "avg_resolution_time": float
                },
                "conversations": [
                    {
                        "id": str,
                        "title": str,
                        "time": str,
                        "customerId": str,
                        "mainIssue": str,
                        "status": str,
                        "satisfaction": float,
                        "resolution": float,
                        "attitude": float,
                        "security": float,
                        "tags": [str]
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
        logger.info(f"收到客服分析请求: {agent_name}")
        
        # 获取查询参数
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 10))
        
        # 获取筛选参数
        search_text = request.args.get('searchText')
        tag = request.args.get('tag')
        status = request.args.get('resolutionStatus')
        time_start = request.args.get('timeStart')
        time_end = request.args.get('timeEnd')
        
        # 构建查询条件
        query = {'agent': agent_name}
        
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
        
        # 标签筛选
        if tag:
            query['tags'] = tag
        
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
            logger.warning(f"未找到客服: {agent_name}")
            return jsonify(make_response(
                success=False,
                message=f"未找到客服: {agent_name}",
                data=None
            )), 404
        
        # 分页查询
        skip = (page - 1) * page_size
        cursor = db.conversations.find(query).sort('time', -1).skip(skip).limit(page_size)
        
        # 获取所有符合条件的会话（用于统计）
        all_agent_conversations = list(db.conversations.find({'agent': agent_name}))
        agent_conv_count = len(all_agent_conversations)
        
        # 统计不同解决状态的数量
        resolved_count = 0
        partially_resolved_count = 0
        unresolved_count = 0
        
        # 计算平均指标
        agent_total_satisfaction = 0
        agent_total_resolution = 0
        agent_total_attitude = 0
        agent_total_security = 0
        
        # 计算响应时间和解决时间
        agent_total_response_time = 0
        agent_total_resolution_time = 0
        
        for conv in all_agent_conversations:
            # 统计解决状态
            resolution_status = conv.get('conversationSummary', {}).get('resolutionStatus', {}).get('status', '')
            if resolution_status.lower() == '已解决':
                resolved_count += 1
            elif resolution_status.lower() == '部分解决':
                partially_resolved_count += 1
            else:
                unresolved_count += 1
            
            # 累加各项指标
            metrics = conv.get('metrics', {})
            agent_total_satisfaction += metrics.get('satisfaction', {}).get('value', 0)
            agent_total_resolution += metrics.get('resolution', {}).get('value', 0)
            agent_total_attitude += metrics.get('attitude', {}).get('value', 0)
            agent_total_security += metrics.get('security', {}).get('value', 0)
            
            # 累加响应时间和解决时间
            interaction_analysis = conv.get('interactionAnalysis', {})
            agent_total_response_time += interaction_analysis.get('avgResponseTime', 0)
            agent_total_resolution_time += interaction_analysis.get('resolutionTime', 0)
        
        # 计算客服的各项平均指标
        agent_avg_satisfaction = agent_total_satisfaction / agent_conv_count if agent_conv_count > 0 else 0
        agent_avg_resolution = agent_total_resolution / agent_conv_count if agent_conv_count > 0 else 0
        agent_avg_attitude = agent_total_attitude / agent_conv_count if agent_conv_count > 0 else 0
        agent_avg_security = agent_total_security / agent_conv_count if agent_conv_count > 0 else 0
        
        # 计算平均响应时间和解决时间
        agent_avg_response_time = agent_total_response_time / agent_conv_count if agent_conv_count > 0 else 0
        agent_avg_resolution_time = agent_total_resolution_time / agent_conv_count if agent_conv_count > 0 else 0
        
        # 计算综合表现指标
        overall_performance = (
            agent_avg_satisfaction * 0.25 + 
            agent_avg_resolution * 0.25 + 
            agent_avg_security * 0.25 + 
            agent_avg_attitude * 0.25
        )
        
        # 计算百分比
        resolved_percentage = (resolved_count / agent_conv_count) * 100 if agent_conv_count > 0 else 0
        partially_resolved_percentage = (partially_resolved_count / agent_conv_count) * 100 if agent_conv_count > 0 else 0
        unresolved_percentage = (unresolved_count / agent_conv_count) * 100 if agent_conv_count > 0 else 0
        
        # 格式化会话数据
        conversations = []
        for doc in cursor:
            # 确保所有必要字段都存在
            conversations.append({
                'id': doc.get('id', ''),
                'title': doc.get('title', '无标题会话'),
                'time': doc.get('time', ''),
                'customerId': doc.get('customerInfo', {}).get('userId', '未知用户'),
                'mainIssue': doc.get('conversationSummary', {}).get('mainIssue', '未分类问题'),
                'status': doc.get('conversationSummary', {}).get('resolutionStatus', {}).get('status', '未解决'),
                'satisfaction': doc.get('metrics', {}).get('satisfaction', {}).get('value', 0),
                'resolution': doc.get('metrics', {}).get('resolution', {}).get('value', 0),
                'attitude': doc.get('metrics', {}).get('attitude', {}).get('value', 0),
                'security': doc.get('metrics', {}).get('security', {}).get('value', 0),
                'tags': doc.get('tags', [])
            })
        
        # 构建分页数据
        pagination = {
            'current': page,
            'pageSize': page_size,
            'total': total
        }
        
        # 构建客服表现数据
        performance = {
            'resolved': resolved_percentage,
            'partially_resolved': partially_resolved_percentage,
            'unresolved': unresolved_percentage,
            'avg_satisfaction': agent_avg_satisfaction,
            'avg_resolution': agent_avg_resolution,
            'avg_attitude': agent_avg_attitude,
            'avg_security': agent_avg_security,
            'overall_performance': overall_performance,
            'avg_response_time': agent_avg_response_time,
            'avg_resolution_time': agent_avg_resolution_time
        }
        
        return jsonify(make_response(
            success=True,
            message="获取客服分析数据成功",
            data={
                "agent": agent_name,
                "count": agent_conv_count,
                "performance": performance,
                "conversations": conversations,
                "pagination": pagination
            }
        ))
    except Exception as e:
        logger.error(f"获取客服分析数据失败: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取客服分析数据失败: {str(e)}",
            data=None
        )), 500

@agent_analytics_bp.route("/agents", methods=['GET'])
def get_all_agents():
    """
    获取所有客服列表及其基本表现数据
    
    返回:
        JSON: {
            "success": bool,
            "data": [
                {
                    "agent": str,
                    "count": int,
                    "resolved": float,
                    "partially_resolved": float,
                    "unresolved": float,
                    "avg_satisfaction": float,
                    "avg_resolution": float,
                    "avg_attitude": float,
                    "avg_security": float,
                    "overall_performance": float
                }
            ],
            "message": str
        }
    """
    try:
        # 记录请求日志
        logger.info("收到所有客服列表请求")
        
        # 获取数据库连接
        db = get_db()
        
        # 获取所有客服
        agents = db.conversations.distinct('agent')
        
        # 客服表现数据列表
        agent_performance_list = []
        
        for agent_name in agents:
            # 查询该客服处理的所有会话
            agent_conversations = list(db.conversations.find({'agent': agent_name}))
            agent_conv_count = len(agent_conversations)
            
            if agent_conv_count == 0:
                continue
                
            # 统计不同解决状态的数量
            resolved_count = 0
            partially_resolved_count = 0
            unresolved_count = 0
            
            # 计算平均指标
            agent_total_satisfaction = 0
            agent_total_resolution = 0
            agent_total_attitude = 0
            agent_total_security = 0
            
            for conv in agent_conversations:
                # 统计解决状态
                resolution_status = conv.get('conversationSummary', {}).get('resolutionStatus', {}).get('status', '')
                if resolution_status.lower() == '已解决':
                    resolved_count += 1
                elif resolution_status.lower() == '部分解决':
                    partially_resolved_count += 1
                else:
                    unresolved_count += 1
                
                # 累加各项指标
                metrics = conv.get('metrics', {})
                agent_total_satisfaction += metrics.get('satisfaction', {}).get('value', 0)
                agent_total_resolution += metrics.get('resolution', {}).get('value', 0)
                agent_total_attitude += metrics.get('attitude', {}).get('value', 0)
                agent_total_security += metrics.get('security', {}).get('value', 0)
            
            # 计算客服的各项平均指标
            agent_avg_satisfaction = agent_total_satisfaction / agent_conv_count if agent_conv_count > 0 else 0
            agent_avg_resolution = agent_total_resolution / agent_conv_count if agent_conv_count > 0 else 0
            agent_avg_attitude = agent_total_attitude / agent_conv_count if agent_conv_count > 0 else 0
            agent_avg_security = agent_total_security / agent_conv_count if agent_conv_count > 0 else 0
            
            # 计算综合表现指标
            overall_performance = (
                agent_avg_satisfaction * 0.25 + 
                agent_avg_resolution * 0.25 + 
                agent_avg_security * 0.25 + 
                agent_avg_attitude * 0.25
            )
            
            # 计算百分比
            resolved_percentage = (resolved_count / agent_conv_count) * 100 if agent_conv_count > 0 else 0
            partially_resolved_percentage = (partially_resolved_count / agent_conv_count) * 100 if agent_conv_count > 0 else 0
            unresolved_percentage = (unresolved_count / agent_conv_count) * 100 if agent_conv_count > 0 else 0
            
            # 添加客服表现数据
            agent_performance_list.append({
                'agent': agent_name,
                'count': agent_conv_count,
                'resolved': resolved_percentage,
                'partially_resolved': partially_resolved_percentage,
                'unresolved': unresolved_percentage,
                'avg_satisfaction': agent_avg_satisfaction,
                'avg_resolution': agent_avg_resolution,
                'avg_attitude': agent_avg_attitude,
                'avg_security': agent_avg_security,
                'overall_performance': overall_performance
            })
        
        # 按综合表现排序
        agent_performance_list.sort(key=lambda x: x['overall_performance'], reverse=True)
        
        return jsonify(make_response(
            success=True,
            message="获取所有客服列表成功",
            data=agent_performance_list
        ))
    except Exception as e:
        logger.error(f"获取所有客服列表失败: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取所有客服列表失败: {str(e)}",
            data=None
        )), 500
