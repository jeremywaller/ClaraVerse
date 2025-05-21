import Keycloak from 'keycloak-js';
import { keycloakConfig, keycloakInitOptions } from './keycloakConfig';

/**
 * KeycloakService - A service for managing Keycloak authentication
 * 
 * This service provides:
 * - Initialization of Keycloak instance
 * - Login, logout methods
 * - Token refresh handling
 * - User information retrieval
 * - Role-based access control checks
 */
class KeycloakService {
  private keycloak: Keycloak | null = null;
  private initialized = false;
  private refreshTokenInterval: NodeJS.Timeout | null = null;
  
  /**
   * Initialize the Keycloak instance
   * 
   * @returns Promise resolving to authenticated status
   */
  async init(): Promise<boolean> {
    if (this.initialized) {
      return this.keycloak?.authenticated || false;
    }
    
    try {
      // Create Keycloak instance
      this.keycloak = new Keycloak(keycloakConfig);
      
      // Initialize Keycloak
      const authenticated = await this.keycloak.init(keycloakInitOptions);
      this.initialized = true;
      
      // Setup token refresh
      if (authenticated) {
        this.setupTokenRefresh();
      }
      
      // Add event listeners
      if (this.keycloak) {
        this.keycloak.onAuthSuccess = () => {
          console.log('Auth success');
          this.setupTokenRefresh();
        };
        
        this.keycloak.onAuthError = (error) => {
          console.error('Auth error:', error);
        };
        
        this.keycloak.onAuthRefreshSuccess = () => {
          console.log('Auth refresh success');
        };
        
        this.keycloak.onAuthRefreshError = () => {
          console.error('Auth refresh error');
          this.logout();
        };
        
        this.keycloak.onAuthLogout = () => {
          console.log('Auth logout');
        };
        
        this.keycloak.onTokenExpired = () => {
          console.log('Token expired, refreshing...');
          this.keycloak?.updateToken(30);
        };
      }
      
      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      return false;
    }
  }
  
  /**
   * Login the user
   * 
   * @param redirectUri Optional redirect URI after login
   */
  login(redirectUri?: string): void {
    if (!this.keycloak) return;
    
    const options: Keycloak.KeycloakLoginOptions = {};
    if (redirectUri) {
      options.redirectUri = redirectUri;
    }
    
    this.keycloak.login(options);
  }
  
  /**
   * Logout the user
   * 
   * @param redirectUri Optional redirect URI after logout
   */
  logout(redirectUri?: string): void {
    if (!this.keycloak) return;
    
    const options: Keycloak.KeycloakLogoutOptions = {};
    if (redirectUri) {
      options.redirectUri = redirectUri;
    }
    
    // Clear token refresh interval
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
      this.refreshTokenInterval = null;
    }
    
    this.keycloak.logout(options);
  }
  
  /**
   * Get the current authentication state
   * 
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false;
  }
  
  /**
   * Get the current access token
   * 
   * @returns Access token or null
   */
  getToken(): string | undefined {
    return this.keycloak?.token;
  }
  
  /**
   * Get the current refresh token
   * 
   * @returns Refresh token or null
   */
  getRefreshToken(): string | undefined {
    return this.keycloak?.refreshToken;
  }
  
  /**
   * Get information about the authenticated user
   * 
   * @returns User profile information
   */
  getUserProfile(): Promise<Keycloak.KeycloakProfile> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return Promise.reject('User not authenticated');
    }
    
    return this.keycloak.loadUserProfile();
  }
  
  /**
   * Check if user has a specific role
   * 
   * @param role Role to check for
   * @returns True if user has the role
   */
  hasRole(role: string): boolean {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return false;
    }
    
    return this.keycloak.hasRealmRole(role);
  }
  
  /**
   * Check if user has a specific role in the client
   * 
   * @param role Client role to check for
   * @returns True if user has the client role
   */
  hasClientRole(role: string): boolean {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return false;
    }
    
    return this.keycloak.hasResourceRole(role, keycloakConfig.clientId);
  }
  
  /**
   * Update the token if it's valid for less than minValidity seconds
   * 
   * @param minValidity Minimum validity time in seconds
   * @returns Promise resolving to a boolean (refreshed or not)
   */
  async updateToken(minValidity: number = 60): Promise<boolean> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return Promise.resolve(false);
    }
    
    try {
      return await this.keycloak.updateToken(minValidity);
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }
  
  /**
   * Set up a timer to refresh the token
   */
  private setupTokenRefresh(): void {
    // Clear any existing interval
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
    }
    
    // Check token validity every minute
    this.refreshTokenInterval = setInterval(() => {
      this.updateToken(70);
    }, 60000);
  }
  
  /**
   * Get user's username
   * @returns Username or empty string
   */
  getUsername(): string {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return '';
    }
    
    return this.keycloak.tokenParsed?.preferred_username || '';
  }
  
  /**
   * Get user's email
   * @returns Email or empty string
   */
  getEmail(): string {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return '';
    }
    
    return this.keycloak.tokenParsed?.email || '';
  }
  
  /**
   * Get user's full name
   * @returns Full name or empty string
   */
  getName(): string {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return '';
    }
    
    return this.keycloak.tokenParsed?.name || '';
  }
  
  /**
   * Get the underlying Keycloak instance
   * @returns Keycloak instance
   */
  getInstance(): Keycloak | null {
    return this.keycloak;
  }
}

// Export a singleton instance
export const keycloakService = new KeycloakService();
export default keycloakService;