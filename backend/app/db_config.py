import os
import re
import getpass
from pymongo import MongoClient

def setup_mongodb_local():
    """设置本地MongoDB连接"""
    print("\n=== 本地MongoDB配置 ===")
    
    # 默认本地连接字符串
    default_uri = "mongodb://localhost:27017/"
    uri = input(f"请输入MongoDB连接字符串 (默认: {default_uri}): ") or default_uri
    
    # 默认数据库名
    default_db_name = "convoinsight"
    db_name = input(f"请输入数据库名称 (默认: {default_db_name}): ") or default_db_name
    
    # 测试连接
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.server_info()  # 将触发连接检查
        print(f"✅ 成功连接到本地MongoDB: {uri}")
        client.close()
        return uri, db_name
    except Exception as e:
        print(f"❌ 连接本地MongoDB失败: {str(e)}")
        retry = input("是否重试? (y/n): ").lower()
        if retry == 'y':
            return setup_mongodb_local()
        else:
            print("将使用默认配置，但可能无法正常连接数据库。")
            return default_uri, default_db_name

def setup_mongodb_atlas():
    """设置MongoDB Atlas连接"""
    print("\n=== MongoDB Atlas配置 ===")
    
    # 检查用户是否已有Atlas账户
    has_account = input("您是否已有MongoDB Atlas账户? (y/n): ").lower()
    
    if has_account != 'y':
        print("\n请先创建MongoDB Atlas账户:")
        print("1. 访问 https://www.mongodb.com/cloud/atlas/register")
        print("2. 注册并创建一个免费集群")
        print("3. 在'Network Access'中添加您的IP地址")
        print("4. 在'Database Access'中创建一个数据库用户")
        print("5. 点击'Connect'获取连接字符串")
        input("\n完成上述步骤后，按Enter继续...")
    
    # 获取连接字符串
    print("\n请提供MongoDB Atlas连接信息:")
    connection_string = input("请输入MongoDB Atlas连接字符串 (例如: mongodb+srv://username:password@cluster.mongodb.net/): ")
    
    # 如果连接字符串中没有包含密码，则单独询问
    if ":<password>@" in connection_string or ":@" in connection_string:
        password = getpass.getpass("请输入MongoDB Atlas密码: ")
        connection_string = re.sub(r"(:)(<password>|)(@)", f":{password}@", connection_string)
    
    # 获取数据库名称
    default_db_name = "convoinsight"
    db_name = input(f"请输入数据库名称 (默认: {default_db_name}): ") or default_db_name
    
    # 测试连接
    try:
        client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        client.server_info()  # 将触发连接检查
        print(f"✅ 成功连接到MongoDB Atlas")
        client.close()
        return connection_string, db_name
    except Exception as e:
        print(f"❌ 连接MongoDB Atlas失败: {str(e)}")
        retry = input("是否重试? (y/n): ").lower()
        if retry == 'y':
            return setup_mongodb_atlas()
        else:
            print("将使用默认本地配置。")
            return setup_mongodb_local()

def setup_mongodb_docker():
    """设置Docker中的MongoDB连接"""
    print("\n=== Docker MongoDB配置 ===")
    
    # 默认Docker连接字符串
    default_uri = "mongodb://mongo:27017/"
    uri = input(f"请输入Docker MongoDB连接字符串 (默认: {default_uri}): ") or default_uri
    
    # 默认数据库名
    default_db_name = "convoinsight"
    db_name = input(f"请输入数据库名称 (默认: {default_db_name}): ") or default_db_name
    
    print(f"✅ 已配置Docker MongoDB连接: {uri}")
    return uri, db_name

def select_mongodb_connection():
    """选择MongoDB连接方式"""
    print("\n=== MongoDB连接配置 ===")
    print("请选择MongoDB连接方式:")
    print("1. 本地MongoDB")
    print("2. MongoDB Atlas (云服务)")
    print("3. Docker中的MongoDB")
    
    choice = input("请输入选项 (1-3): ")
    
    if choice == '1':
        return setup_mongodb_local()
    elif choice == '2':
        return setup_mongodb_atlas()
    elif choice == '3':
        return setup_mongodb_docker()
    else:
        print("无效选项，将使用本地MongoDB。")
        return setup_mongodb_local()

def save_config_to_env(mongodb_uri, db_name):
    """将配置保存到.env文件"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    
    # 读取现有.env文件内容
    env_content = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    env_content[key] = value
    
    # 更新MongoDB配置
    env_content['MONGODB_URI'] = f'"{mongodb_uri}"'
    env_content['DB_NAME'] = f'"{db_name}"'
    
    # 写入.env文件
    with open(env_path, 'w') as f:
        for key, value in env_content.items():
            f.write(f"{key}={value}\n")
    
    print(f"✅ 配置已保存到 {env_path}")
