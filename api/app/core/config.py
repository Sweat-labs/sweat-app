import os

from dotenv import load_dotenv

# Path to api/.env (from api/app/core/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

ENV_PATH = os.path.join(BASE_DIR, ".env")

# Load environment variables from api/.env
load_dotenv(ENV_PATH)

# Values we will use for auth
SECRET_KEY = os.getenv("SECRET_KEY", "dev_only_change_me")

ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
