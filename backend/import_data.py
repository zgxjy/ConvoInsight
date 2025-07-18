import json
import os
import re
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# ANSI颜色代码
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(message):
    print(f"{Colors.HEADER}{Colors.BOLD}{message}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.OKGREEN}✅ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.OKCYAN}ℹ️ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.WARNING}⚠️ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.FAIL}❌ {message}{Colors.ENDC}")

def get_db_connection():
    """从.env文件加载配置并连接到MongoDB"""
    load_dotenv()
    
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")

    if not uri or not db_name:
        print_error("无法从.env文件加载数据库配置。请先运行 `python run.py` 来生成配置。")
        return None, None

    print_info(f"从.env文件加载配置: DB_NAME={db_name}")

    try:
        client = MongoClient(uri)
        client.admin.command('ping')
        print_success(f"成功连接到MongoDB: {uri}")
        return client, db_name
    except ConnectionFailure as e:
        print_error(f"无法连接到MongoDB: {e}")
        return None, None

def import_conversation_details(db, file_path):
    """导入会话详情数据"""
    print_info("正在导入会话详情数据...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        collection = db['conversation_details']
        # 确保每次导入前清空旧数据，避免重复
        collection.delete_many({})
        result = collection.insert_one(data)
        print_success(f"成功导入会话详情 (文档ID: {result.inserted_id})")
        return True
    except FileNotFoundError:
        print_error(f"文件未找到: {file_path}")
        return False
    except Exception as e:
        print_error(f"导入会话详情时发生错误: {e}")
        return False

def main():
    print_header("========================")
    print_header("  ConvoInsight数据导入工具  ")
    print_header("========================\n")

    client, db_name = get_db_connection()
    if not client or not db_name:
        return

    db = client[db_name]
    
    # 定义数据文件路径
    base_dir = os.path.dirname(os.path.abspath(__file__))
    conversation_detail_file = os.path.join(base_dir, 'conversation_detail.json')

    # 检查文件是否存在
    if not os.path.exists(conversation_detail_file):
        print_error(f"数据文件 'conversation_detail.json' 未在目录下找到: {base_dir}")
        client.close()
        return

    print_info(f"使用数据库: {Colors.BOLD}{db_name}{Colors.ENDC}")

    # 导入数据
    success = import_conversation_details(db, conversation_detail_file)

    if success:
        print_header("\n数据导入摘要:")
        print_success("所有数据已成功导入!")
    else:
        print_header("\n数据导入摘要:")
        print_error("数据导入过程中发生错误，请检查以上日志。")

    # 关闭连接
    client.close()
    print_info("MongoDB连接已关闭。")

if __name__ == "__main__":
    main()
