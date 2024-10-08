import React from 'react';
import ReactDOM from 'react-dom/client'; // Change from 'react-dom'
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { BrowserRouter } from 'react-router-dom';

const msalInstance = new PublicClientApplication(msalConfig);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!); // Use createRoot instead of ReactDOM.render

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>
);
