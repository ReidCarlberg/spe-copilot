export const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID || '',
      authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
      redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000',
    },
  };
  
  export const loginRequest = {
    scopes: ["user.read", "FileStorageContainer.Selected", "User.RevokeSessions.All", "Files.Read.All"], // Modify according to your needs
  };
  