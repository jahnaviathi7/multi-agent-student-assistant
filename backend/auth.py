import sqlite3
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash


# ==========================================
# CONFIGURATION
# ==========================================

SECRET_KEY = "change-this-secret-key-in-production"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DATABASE = "student_assistant.db"


password_hash = PasswordHash.recommended()


# ==========================================
# DATABASE
# ==========================================

def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_auth_database():
    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


# ==========================================
# PASSWORD FUNCTIONS
# ==========================================

def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(
        password,
        hashed_password
    )


# ==========================================
# USER FUNCTIONS
# ==========================================

def create_user(
    name: str,
    email: str,
    password: str
):
    connection = get_connection()

    try:
        hashed_password = hash_password(password)

        created_at = datetime.now(
            timezone.utc
        ).isoformat()

        cursor = connection.execute(
            """
            INSERT INTO users
            (name, email, password_hash, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                name,
                email.lower(),
                hashed_password,
                created_at,
            ),
        )

        connection.commit()

        user_id = cursor.lastrowid

        return {
            "id": user_id,
            "name": name,
            "email": email.lower(),
        }

    except sqlite3.IntegrityError:
        return None

    finally:
        connection.close()


def get_user_by_email(email: str):
    connection = get_connection()

    user = connection.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?
        """,
        (email.lower(),),
    ).fetchone()

    connection.close()

    return user


# ==========================================
# AUTHENTICATION
# ==========================================

def authenticate_user(
    email: str,
    password: str
):
    user = get_user_by_email(email)

    if not user:
        return None

    if not verify_password(
        password,
        user["password_hash"]
    ):
        return None

    return user


# ==========================================
# JWT TOKEN
# ==========================================

def create_access_token(
    user_id: int,
    email: str
):
    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return token


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        return payload

    except jwt.PyJWTError:
        return None