from sqlalchemy import text
from app.db_pg import engine

def test_conn():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Conexión a PostgreSQL funcionando")
    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    test_conn()