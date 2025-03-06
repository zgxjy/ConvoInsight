from app import create_app
from app.db_config import select_mongodb_connection, save_config_to_env
import os

def setup_database_config():
    """设置数据库配置"""
    # 检查是否已有.env文件
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        use_existing = input("检测到已有配置，是否使用现有数据库配置? (y/n): ").lower()
        if use_existing == 'y':
            print("✅ 将使用现有数据库配置")
            return
    
    # 选择MongoDB连接方式
    mongodb_uri, db_name = select_mongodb_connection()
    
    # 保存配置到.env文件
    save_config_to_env(mongodb_uri, db_name)

if __name__ == '__main__':
    # 设置数据库配置
    setup_database_config()
    
    # 创建并运行应用
    app = create_app()
    print(f"\n✅ 后端服务已启动: http://localhost:{app.config['PORT']}")
    app.run(
        host='0.0.0.0',
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )
