/**
 * Keycloak configuration settings
 */

export const keycloakConfig = {
  // Use environment variables if available, fallback to default values for development
  url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'clara',
  clientId: process.env.KEYCLOAK_CLIENT_ID || 'clara-app',
  
  // Additional optional configuration
  onLoad: 'check-sso' as const, // Valid values: 'login-required', 'check-sso'
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  
  // Responses can be in various formats
  responseMode: 'fragment' as const,
  responseType: 'code',
  
  // Enable pkce for public clients
  pkceMethod: 'S256' as const,
  
  // Timeouts
  checkLoginIframe: false,
  checkLoginIframeInterval: 30,
};

/**
 * Default initialization options
 */
export const keycloakInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoFallback: true,
  checkLoginIframe: false,
  pkceMethod: 'S256',
};