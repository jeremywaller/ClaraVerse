# ClaraVerse Keycloak Integration

This document provides detailed instructions for setting up and configuring Keycloak with ClaraVerse for user management and authentication.

## Overview

Keycloak is an open-source Identity and Access Management solution that provides features like:

- User registration and authentication
- Single sign-on (SSO)
- Identity brokering
- Social login
- Role-based access control
- Two-factor authentication

ClaraVerse uses Keycloak to provide secure, centralized user management capabilities.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js (v16+) and npm/bun for local development

### Quick Start

1. Start the Keycloak and Postgres services:

```bash
docker-compose up -d clara-postgres clara-keycloak
```

2. Access the Keycloak admin console:
   - URL: http://localhost:8080/admin
   - Default credentials:
     - Username: admin
     - Password: admin

### Initial Configuration

Follow these steps to set up Keycloak for ClaraVerse:

#### 1. Create a New Realm

1. Log in to the Keycloak admin console
2. Hover over the realm dropdown in the top-left corner (default is "master")
3. Click "Create Realm"
4. Enter "clara" as the realm name
5. Click "Create"

#### 2. Create Client

1. Go to "Clients" in the left sidebar
2. Click "Create client"
3. Fill in the form:
   - Client ID: `clara-app`
   - Client type: `OpenID Connect`
   - Click "Next"
4. Configure client settings:
   - Client authentication: Off (public client)
   - Authentication flow:
     - Standard flow: Enabled
     - Direct access grants: Enabled
     - Implicit flow: Disabled
     - Service accounts: Disabled
   - Click "Next"
5. Configure login settings:
   - Valid redirect URIs:
     - `http://localhost:8069/*` (for development)
     - `http://clara-app:8069/*` (for Docker)
   - Web origins: `+` (to copy from redirect URIs)
   - Click "Save"

#### 3. Create Roles

1. Go to "Realm roles" in the left sidebar
2. Click "Create role"
3. Create the following roles:
   - `user` (basic authenticated user)
   - `admin` (administrative privileges)

#### 4. Create Initial User

1. Go to "Users" in the left sidebar
2. Click "Add user"
3. Fill in the form:
   - Username: `admin`
   - Email: `admin@example.com`
   - First name: `Admin`
   - Last name: `User`
   - Email Verified: ON
   - Click "Create"
4. Set a password:
   - Go to the "Credentials" tab
   - Click "Set password"
   - Enter a password and turn off "Temporary" 
   - Click "Save"
   - Confirm by clicking "Set password"
5. Assign roles:
   - Go to the "Role mapping" tab
   - Click "Assign role"
   - Select "admin" and "user" roles
   - Click "Assign"

## Integration with ClaraVerse

### Environment Variables

ClaraVerse connects to Keycloak using the following environment variables:

- `KEYCLOAK_URL`: URL of the Keycloak server (default: http://localhost:8080 or http://clara-keycloak:8080 in Docker)
- `KEYCLOAK_REALM`: Realm name (default: clara)
- `KEYCLOAK_CLIENT_ID`: Client ID (default: clara-app)

These variables are automatically set in the Docker Compose configuration.

### Authentication Flow

1. User accesses Clara application
2. If not authenticated and accessing a protected page, they're redirected to Keycloak login
3. After successful authentication, Keycloak redirects back to Clara
4. Clara verifies the authentication and grants access to protected resources
5. Token refresh happens automatically in the background

### Protected Resources

The following resources are protected by authentication:

- App Creator tools
- Assistant features
- Image generation tools
- Admin-only features (requires admin role)

### Role-Based Access

- `user`: Basic authenticated access
- `admin`: Administrative access to server configuration, debug tools, etc.

## Customization Options

### Theme Customization

1. Create a custom theme in Keycloak:
   - Create a directory in the themes folder
   - Customize login pages, emails, and account management

2. Apply your theme:
   - Realm Settings > Themes
   - Choose your theme for Login, Account, etc.

### Email Configuration

1. Configure email settings for account verification:
   - Realm Settings > Email
   - Configure SMTP server settings

## Troubleshooting

### Common Issues

1. **Cannot access Keycloak admin console**
   - Check if Docker containers are running
   - Verify ports are not in use by other services

2. **Authentication fails**
   - Check client settings in Keycloak
   - Verify redirect URIs are correctly set
   - Check browser console for errors

3. **Token refresh issues**
   - Check browser console for errors
   - Verify clock synchronization between services

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter)
- [OpenID Connect](https://openid.net/connect/)