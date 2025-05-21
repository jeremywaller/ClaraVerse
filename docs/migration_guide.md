# Migration Guide: Local User Data to Keycloak

This guide describes how to migrate from ClaraVerse's local user data storage to the new Keycloak-based authentication system.

## Overview

ClaraVerse has integrated Keycloak for user management and authentication. This transition moves from:
- Local browser storage for user data
- No formal authentication
- Limited user management capabilities

To:
- Centralized user management with Keycloak
- Proper authentication and authorization
- Role-based access control
- Support for multiple authentication methods

## For Users

### Before Migration

Your personal information (name, email, settings) is currently stored in your browser's local storage (IndexedDB). This data is private to your device and browser profile.

### Migration Process

1. When you log in to ClaraVerse with Keycloak for the first time:
   - You'll be prompted to create a Keycloak account or sign in
   - After authentication, your local data will be associated with your Keycloak account
   - Your name, email, and preferences will be preserved

2. Your locally stored data will be kept as a fallback, but active data will sync with your authenticated account.

3. No data will be lost during this transition.

### Benefits After Migration

- Access your ClaraVerse account from multiple devices with the same settings
- Better security for your data with proper authentication
- Role-based access to features
- Potential for single sign-on with other systems in the future

## For Administrators

### Setting Up User Migration

1. **Create Keycloak Accounts**:
   - Create accounts in Keycloak for all your users
   - Assign appropriate roles (user, admin, etc.)
   - Optionally, configure email verification

2. **Provide Login Information**:
   - Share the new login process with your users
   - Explain that their data will be preserved
   - Provide your Keycloak URL and realm information

3. **Monitor Migration**:
   - Monitor Keycloak logs for any issues
   - Be prepared to assist users who have trouble logging in

## Data Handling

### What Data Gets Migrated

The following data will be associated with Keycloak accounts:
- User profile information (name, email)
- User preferences and settings
- Theme preferences

### What Stays Local

Some data will remain in local storage even after migration:
- Chat history and messages
- Generated images and other content
- Other app-specific data not directly tied to user identity

## Potential Issues

### Common Migration Issues

1. **User Data Mismatch**:
   - If a user's Keycloak name/email differs from local data
   - Resolution: Local data is preserved; the system uses authenticated data when available

2. **Multiple Devices**:
   - User has different data across multiple devices
   - Resolution: Data from the device where they first authenticate will be preserved

3. **Offline Access**:
   - Users need to access the system without internet connection
   - Resolution: Local data fallback allows basic functionality when offline

## Managing Permissions

After migrating to Keycloak, you can manage permissions using roles:

1. **Basic User Role**:
   - Access to core features
   - Personal workspace
   - Content creation tools

2. **Admin Role**:
   - Server management
   - User administration
   - System configuration

Roles are defined in Keycloak and enforced by ClaraVerse's authentication system.

## Rollback Procedure

If necessary, you can temporarily disable Keycloak authentication:

1. Edit the `.env` file or environment variables
2. Set `KEYCLOAK_ENABLED=false`
3. Restart the application

This will revert to using local storage only, though we recommend addressing any issues with Keycloak instead of disabling it long-term.

## Support

If you encounter issues during migration:
1. Check the [Keycloak documentation](https://www.keycloak.org/documentation)
2. Review ClaraVerse logs for specific errors
3. Contact the ClaraVerse support team for assistance