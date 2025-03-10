import json
import os
import sys
from pymongo import MongoClient
import urllib.parse
import time

def import_data_to_mongodb(connection_string=None, db_name=None):
    """
    将JSON数据导入MongoDB数据库
    """
    try:
        # 连接到MongoDB
        if connection_string:
            # 解析连接字符串中的数据库名称
            if '/' in connection_string and '?' in connection_string:
                db_name_in_url = connection_string.split('/')[3].split('?')[0]
                if not db_name:
                    db_name = db_name_in_url
            
            client = MongoClient(connection_string)
        else:
            # 默认使用MongoDB Atlas免费集群
            # 注意：这是一个示例连接字符串，用户需要替换为自己的
            username = urllib.parse.quote_plus("convoinsight")
            password = urllib.parse.quote_plus("convoinsight123")
            cluster = "cluster0.mongodb.net"
            connection_string = f"mongodb+srv://{username}:{password}@{cluster}/convoinsight?retryWrites=true&w=majority"
            client = MongoClient(connection_string)
        
        # 选择数据库
        if not db_name:
            db_name = 'convoinsight'
            
        print(f"使用数据库: {db_name}")
        db = client[db_name]
        
        # 读取会话详情数据
        with open('conversation_detail.json', 'r', encoding='utf-8') as f:
            conversation_detail = json.load(f)
        
        # 创建集合
        conversations_collection = db['conversations']  # 会话详情集合
        
        # 清空现有数据（可选，取消注释以启用）
        # conversations_collection.delete_many({})

        
        # 导入会话详情数据
        print("\n导入会话详情数据...")
        try:
            # 将单个会话详情作为独立文档插入
            conversations_collection.update_one(
                {'id': conversation_detail['id']},
                {'$set': conversation_detail},
                upsert=True
            )
            print(f"成功导入会话详情数据 (ID: {conversation_detail['id']})")
        except Exception as e:
            print(f"导入会话详情数据出错: {str(e)}")
            # 尝试使用insert_one
            try:
                conversations_collection.delete_one({'id': conversation_detail['id']})
                conversations_collection.insert_one(conversation_detail)
                print(f"使用insert_one成功导入会话详情数据 (ID: {conversation_detail['id']})")
            except Exception as insert_error:
                print(f"插入会话详情数据失败: {str(insert_error)}")
                return False
        
        # 打印导入的数据摘要
        print("\n导入数据摘要:")
        print(f"- 会话详情: ID={conversation_detail['id']}")
        
        return True
        
    except Exception as e:
        print(f"导入数据时出错: {str(e)}")
        return False

def setup_mongodb_atlas():
    """
    设置MongoDB Atlas连接
    """
    print("MongoDB Atlas设置向导")
    print("===================\n")
    print("您需要创建一个免费的MongoDB Atlas账户来存储数据")
    print("1. 访问 https://www.mongodb.com/cloud/atlas/register")
    print("2. 注册并创建一个免费集群")
    print("3. 在'Database Access'中创建一个用户")
    print("4. 在'Network Access'中添加您的IP地址")
    print("5. 获取连接字符串\n")
    
    use_atlas = input("您是否已有MongoDB Atlas账户? (y/n): ").lower().strip() == 'y'
    
    if use_atlas:
        connection_string = input("请输入MongoDB Atlas连接字符串: ").strip()
        db_name = input("请输入数据库名称 (默认为convoinsight): ").strip() or "convoinsight"
        return connection_string, db_name
    else:
        print("\n您可以使用本地MongoDB服务器")
        use_local = input("尝试连接本地MongoDB服务器? (y/n): ").lower().strip() == 'y'
        
        if use_local:
            return "mongodb://localhost:27017/", "convoinsight"
        else:
            print("\n请先设置MongoDB服务，然后再运行此脚本")
            sys.exit(1)

def check_mongodb_connection(connection_string):
    """
    检查MongoDB连接状态
    """
    try:
        client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        client.server_info()  # 将触发异常如果无法连接
        
        # 检查是否可以列出数据库
        dbs = client.list_database_names()
        print(f"可用数据库: {', '.join(dbs)}")
        
        return True
    except Exception as e:
        print(f"无法连接到MongoDB: {str(e)}")
        
        if "localhost" in connection_string:
            print("\n请确保本地MongoDB服务已启动。您可以:")
            print("1. 安装MongoDB (https://www.mongodb.com/try/download/community)")
            print("2. 启动MongoDB服务")
        else:
            print("\n请检查您的MongoDB Atlas连接字符串是否正确")
            print("确保您已添加当前IP地址到MongoDB Atlas的Network Access列表中")
        
        return False

def create_mongodb_docker():
    """
    使用Docker创建MongoDB容器
    """
    try:
        print("尝试使用Docker创建MongoDB容器...")
        os.system("docker pull mongo:latest")
        os.system("docker run -d -p 27017:27017 --name mongodb mongo:latest")
        print("MongoDB容器已启动，等待服务就绪...")
        time.sleep(5)  # 等待MongoDB启动
        return True
    except Exception as e:
        print(f"创建Docker容器失败: {str(e)}")
        return False

if __name__ == '__main__':
    print("ConvoInsight数据导入工具")
    print("========================\n")
    
    # 检查当前目录
    current_dir = os.getcwd()
    print(f"当前工作目录: {current_dir}")
    
    # 检查文件是否存在
    detail_file = os.path.join(current_dir, 'conversation_detail.json')
    if not os.path.exists(detail_file):
        print(f"错误: 找不到会话详情文件 {detail_file}")
        sys.exit(1)
    
    print("找到所需的JSON文件:")
    print(f"- {detail_file}")
    
    # 设置连接选项
    print("\n选择MongoDB连接方式:")
    print("1. 本地MongoDB (需要已安装MongoDB)")
    print("2. MongoDB Atlas (云服务，需要注册)")
    print("3. 使用Docker创建临时MongoDB (需要已安装Docker)")
    
    choice = input("\n请选择 (1/2/3): ").strip()
    
    connection_string = None
    db_name = None
    
    if choice == "1":
        connection_string = "mongodb://localhost:27017/"
        db_name = "convoinsight"
    elif choice == "2":
        connection_string, db_name = setup_mongodb_atlas()
    elif choice == "3":
        if create_mongodb_docker():
            connection_string = "mongodb://localhost:27017/"
            db_name = "convoinsight"
        else:
            print("无法创建Docker容器，请选择其他连接方式")
            sys.exit(1)
    else:
        print("无效的选择")
        sys.exit(1)
    
    # 检查MongoDB连接
    print(f"\n检查MongoDB连接 ({connection_string})...")
    if not check_mongodb_connection(connection_string):
        sys.exit(1)
    
    # 导入数据
    print("\n开始导入数据...")
    if import_data_to_mongodb(connection_string, db_name):
        print("\n数据导入完成!")
        print("\n您现在可以启动ConvoInsight应用程序并访问导入的数据")
