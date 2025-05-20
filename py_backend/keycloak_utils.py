import os
from fastapi import HTTPException
from keycloak import KeycloakOpenID, KeycloakAdmin

KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080/")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "clara")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "clara-backend")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "")

keycloak_openid = KeycloakOpenID(
    server_url=KEYCLOAK_URL,
    client_id=KEYCLOAK_CLIENT_ID,
    realm_name=KEYCLOAK_REALM,
    client_secret_key=KEYCLOAK_CLIENT_SECRET,
)

KEYCLOAK_ADMIN_USER = os.getenv("KEYCLOAK_ADMIN_USER", "")
KEYCLOAK_ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "")

keycloak_admin = None
if KEYCLOAK_ADMIN_USER and KEYCLOAK_ADMIN_PASSWORD:
    keycloak_admin = KeycloakAdmin(
        server_url=KEYCLOAK_URL,
        username=KEYCLOAK_ADMIN_USER,
        password=KEYCLOAK_ADMIN_PASSWORD,
        realm_name=KEYCLOAK_REALM,
        client_id="admin-cli",
        verify=True,
    )


def verify_token(token: str):
    """Verify a JWT token with Keycloak and return user info."""
    try:
        return keycloak_openid.userinfo(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")


def create_user(username: str, email: str, password: str):
    if keycloak_admin is None:
        raise HTTPException(status_code=500, detail="Keycloak admin not configured")
    user = {
        "username": username,
        "email": email,
        "enabled": True,
        "credentials": [{"value": password, "type": "password"}],
    }
    return keycloak_admin.create_user(user)


def get_users():
    if keycloak_admin is None:
        raise HTTPException(status_code=500, detail="Keycloak admin not configured")
    return keycloak_admin.get_users()


def assign_realm_role(user_id: str, role_name: str):
    if keycloak_admin is None:
        raise HTTPException(status_code=500, detail="Keycloak admin not configured")
    role = keycloak_admin.get_realm_role(role_name)
    keycloak_admin.assign_realm_roles(user_id, [role])
