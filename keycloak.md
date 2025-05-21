# Keycloak Integration Guide for ClaraVerse

This document provides information about the Keycloak integration in ClaraVerse application.

## Initial Setup

1. Start the Clara application with Docker Compose:
   ```
   docker-compose up -d
   ```

2. Access the Keycloak admin console at:
   ```
   http://localhost:8080/admin
   ```
   
   Default credentials:
   - Username: admin
   - Password: admin

## Realm Configuration

1. Create a new realm named `clara`
2. Configure realm settings:
   - Enable User Registration
   - Enable Email as Username
   - Configure email settings for account verification

## Client Configuration

1. Create a new client:
   - Client ID: `clara-app`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: 
     - `http://localhost:8069/*` (development)
     - `http://clara-app:8069/*` (docker)
   - Web Origins: `+` (allow all origins from Valid Redirect URIs)

2. Roles:
   - Create realm roles: `user`, `admin`
   - Create client roles for specific app features

## User Management

Users can be:
- Created through user registration
- Pre-configured by administrators
- Imported from external identity providers

## Integration Points

The Clara application integrates with Keycloak using:
- Frontend: `keycloak-js` library for authentication flows
- Backend: Token validation via Keycloak Admin REST API

## Environment Variables

The following environment variables configure the Keycloak connection:
```
KEYCLOAK_URL=http://clara-keycloak:8080
KEYCLOAK_REALM=clara
KEYCLOAK_CLIENT_ID=clara-app
```

## Troubleshooting

If you encounter authentication issues:
1. Check Keycloak server logs
2. Verify client configuration
3. Check network connectivity between containers
4. Validate token validation settings