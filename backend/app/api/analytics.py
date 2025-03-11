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
            "message": str (optional)
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
                "overview":{
                    "totalConversations": int,
                    "avg_totalMessages": int,
                    "avg_agentMessages": int,
                    "avg_userMessages": int,
                },
                "conversationMetrics":{
                    "avg_satisfaction": float,
                    "avg_resolution": float,
                    "avg_attitude":float,
                    "avg_risk":float},
                "Top_tags": [
                    {"tag": str, "count": int,"percentage": float}
                ],
                "Top_hotwords": [
                    {"word": str, "count": int,"percentage": float}
                ]
            },
            "message": str (optional)
        }
    """
    try:
        # 获取数据库连接
        db = get_db()
        
        # 获取总体指标
        total_conversations = db.conversations.count_documents({})
        # 计算平均消息数
        avg_total_messages_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_total_messages': {'$avg': '$interactionAnalysis.totalMessages'}}}
        ])
        avg_total_messages_result = list(avg_total_messages_cursor)
        avg_total_messages = avg_total_messages_result[0]['avg_total_messages'] if avg_total_messages_result else 0

        # 计算平均客服消息数
        avg_agent_messages_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_agent_messages': {'$avg': '$interactionAnalysis.agentMessages'}}}
        ])
        avg_agent_messages_result = list(avg_agent_messages_cursor)
        avg_agent_messages = avg_agent_messages_result[0]['avg_agent_messages'] if avg_agent_messages_result else 0

        # 计算平均用户消息数
        avg_user_messages_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_user_messages': {'$avg': '$interactionAnalysis.userMessages'}}}
        ])
        avg_user_messages_result = list(avg_user_messages_cursor)
        avg_user_messages = avg_user_messages_result[0]['avg_user_messages'] if avg_user_messages_result else 0

        # 计算平均指标
        avg_satisfaction_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_satisfaction': {'$avg': '$metrics.satisfaction.value'}}}
        ])
        avg_satisfaction_result = list(avg_satisfaction_cursor)
        avg_satisfaction = avg_satisfaction_result[0]['avg_satisfaction'] if avg_satisfaction_result else 0
        
        avg_resolution_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_resolution': {'$avg': '$metrics.resolution.value'}}}
        ])
        avg_resolution_result = list(avg_resolution_cursor)
        avg_resolution = avg_resolution_result[0]['avg_resolution'] if avg_resolution_result else 0
        
        avg_attitude_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_attitude': {'$avg': '$metrics.attitude.value'}}}
        ])
        avg_attitude_result = list(avg_attitude_cursor)
        avg_attitude = avg_attitude_result[0]['avg_attitude'] if avg_attitude_result else 0
        
        avg_risk_cursor = db.conversations.aggregate([
            {'$group': {'_id': None, 'avg_risk': {'$avg': '$metrics.risk.value'}}}
        ])
        avg_risk_result = list(avg_risk_cursor)
        avg_risk = avg_risk_result[0]['avg_risk'] if avg_risk_result else 0

        # 获取Top标签
        top_tag_cursor = db.conversations.aggregate([
            {'$unwind': '$tags'},
            {'$group': {'_id': '$tags', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 20}
        ])
        top_tag_result = list(top_tag_cursor)
        top_tag = top_tag_result

        # 获取Top热词
        top_hotword_cursor = db.conversations.aggregate([
            {'$unwind': '$hotWords'},
            {'$group': {'_id': '$hotWords', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 20}
        ])
        top_hotword_result = list(top_hotword_cursor)
        top_hotword = top_hotword_result
        
        # 计算Top标签和热词的百分比
        for tag in top_tag:
            tag['percentage'] = (tag['count'] / total_conversations) * 100
        for hotword in top_hotword:
            hotword['percentage'] = (hotword['count'] / total_conversations) * 100
        
        # 构建响应
        return jsonify(make_response(
            success=True,
            data={
                "overview": {
                    "totalConversations": total_conversations,
                    "avg_totalMessages": avg_total_messages,
                    "avg_agentMessages": avg_agent_messages,
                    "avg_userMessages": avg_user_messages
                },
                "conversationMetrics": {
                    "avg_satisfaction": avg_satisfaction,
                    "avg_resolution": avg_resolution,
                    "avg_attitude": avg_attitude,
                    "avg_risk": avg_risk
                },
                "Top_tags": top_tag,
                "Top_hotwords": top_hotword
            }
        ))
    except Exception as e:
        logger.error(f"获取看板数据出错: {str(e)}")
        return jsonify(make_response(
            success=False,
            message=f"获取看板数据出错: {str(e)}",
            data={}
        ))
