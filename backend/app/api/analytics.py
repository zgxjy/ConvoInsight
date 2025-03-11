"""
分析看板API模块
提供会话统计和分析数据
"""
from flask import Blueprint, request, jsonify
from ..database import get_db
import logging
from .utils import make_response
from datetime import datetime, timedelta

# 设置日志
logger = logging.getLogger(__name__)

# 创建蓝图
analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """获取会话统计数据
    
    返回:
        JSON: {
            "success": bool,
            "data": {
                "totalConversations": int,
                "statusStatistics": [
                    {"status": str, "count": int}
                ],
                "agentStatistics": [
                    {"agent": str, "count": int}
                ]
            },
            "message": str (可选)
        }
    """
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

@analytics_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    """获取会话分析看板数据
    
    返回:
        JSON: {
            "success": bool,
            "data": {
                "overview": {
                    "totalConversations": int,
                    "avgSatisfaction": float,
                    "avgResolutionTime": float
                },
                "agentPerformance": {
                    "avgResponseTime": float,
                    "resolutionRate": float,
                    "customerSatisfaction": float
                },
                "topIssues": [
                    {"issue": str, "count": int}
                ],
                "trend": [
                    {"date": str, "count": int}
                ],
                "emotionDistribution": [
                    {"emotion": str, "count": int}
                ],
                "issueTypeDistribution": [
                    {"type": str, "count": int}
                ]
            },
            "message": str (可选)
        }
    """
    try:
        # 获取数据库连接
        db = get_db()
        
        # 获取总体指标
        total_conversations = db.conversations.count_documents({})
        
        # 计算平均满意度
        satisfaction_pipeline = [
            {'$match': {'metrics.satisfaction.value': {'$exists': True}}},
            {'$group': {'_id': None, 'avg': {'$avg': '$metrics.satisfaction.value'}}}
        ]
        satisfaction_result = list(db.conversations.aggregate(satisfaction_pipeline))
        avg_satisfaction = round(satisfaction_result[0]['avg'], 2) if satisfaction_result else 0
        
        # 计算平均解决时间（假设有开始和结束时间字段）
        # 这里使用模拟数据，实际应根据数据结构调整
        avg_resolution_time = 15.5  # 分钟
        
        # 客服表现指标
        avg_response_time = 2.3  # 分钟
        resolution_rate = 0.85  # 85%
        customer_satisfaction = avg_satisfaction
        
        # 获取热门问题（基于标签）
        top_issues_pipeline = [
            {'$unwind': '$tags'},
            {'$group': {'_id': '$tags', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 5}
        ]
        top_issues_result = list(db.conversations.aggregate(top_issues_pipeline))
        top_issues = [{'issue': item['_id'], 'count': item['count']} for item in top_issues_result]
        
        # 获取最近7天的会话数量趋势
        today = datetime.now()
        trend_data = []
        
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            # 这里假设time字段是ISO格式的日期字符串
            # 实际查询应根据数据库中的日期格式调整
            count = db.conversations.count_documents({
                'time': {'$regex': f'^{date_str}'}
            })
            trend_data.append({
                'date': date_str,
                'count': count
            })
        
        # 情绪分布（模拟数据）
        emotion_distribution = [
            {'emotion': '正向', 'count': int(total_conversations * 0.45)},
            {'emotion': '中立', 'count': int(total_conversations * 0.35)},
            {'emotion': '负向', 'count': int(total_conversations * 0.20)}
        ]
        
        # 问题类型分布（基于主要问题字段）
        issue_type_pipeline = [
            {'$group': {'_id': '$conversationSummary.mainIssue', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 5}
        ]
        issue_type_result = list(db.conversations.aggregate(issue_type_pipeline))
        issue_type_distribution = [
            {'type': item['_id'] or '未分类', 'count': item['count']} 
            for item in issue_type_result
        ]
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data={
                'overview': {
                    'totalConversations': total_conversations,
                    'avgSatisfaction': avg_satisfaction,
                    'avgResolutionTime': avg_resolution_time
                },
                'agentPerformance': {
                    'avgResponseTime': avg_response_time,
                    'resolutionRate': resolution_rate,
                    'customerSatisfaction': customer_satisfaction
                },
                'topIssues': top_issues,
                'trend': trend_data,
                'emotionDistribution': emotion_distribution,
                'issueTypeDistribution': issue_type_distribution
            }
        ))
    
    except Exception as e:
        logger.error(f"获取看板数据出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取看板数据出错: {str(e)}",
            data={}
        ))
