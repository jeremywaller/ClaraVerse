import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080/',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'clara',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'clara-frontend',
});

export default keycloak;
