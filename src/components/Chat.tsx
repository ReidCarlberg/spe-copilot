import React, { useEffect, useState } from 'react';
import Layout from './Layout';  // Import the Layout component
import { ChatEmbedded, ChatEmbeddedAPI, IChatEmbeddedApiAuthProvider } from '@microsoft/sharepointembedded-copilotchat-react';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useSearchParams } from 'react-router-dom';  // To handle query parameters

const Chat: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [chatApi, setChatApi] = useState<ChatEmbeddedAPI | null>(null);
  const [searchParams] = useSearchParams();

  // Retrieve the "containerId" parameter from the URL; default if not provided.
  const containerId = searchParams.get('containerId') || 'default-container';
  console.log('Container ID:', containerId);

  // Define the authProvider object using the interface and environment variable for hostname
  const authProvider: IChatEmbeddedApiAuthProvider = {
    hostname: process.env.REACT_APP_SHAREPOINT_HOSTNAME || '',
    getToken: requestSPOAccessToken,
  };

  async function requestSPOAccessToken(): Promise<string> {
    const containerScopes = {
      scopes: [`${process.env.REACT_APP_SHAREPOINT_HOSTNAME || ''}/Container.Selected`],
      redirectUri: '/'
    };

    let containerTokenResponse;
    try {
      containerTokenResponse = await instance.acquireTokenSilent({
        ...containerScopes,
        account: accounts[0],
      });
      return containerTokenResponse.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        containerTokenResponse = await instance.acquireTokenPopup({
          ...containerScopes,
          account: accounts[0],
        });
        return containerTokenResponse.accessToken;
      } else {
        console.error("Error acquiring token:", error);
        throw new Error("Could not acquire token");
      }
    }
  }

  // Open chat once chatApi is ready
  useEffect(() => {
    const initializeChat = async () => {
      if (chatApi) {
        try {
          console.log('Chat API is ready');
          await chatApi.openChat();
          console.log('Chat opened successfully');
        } catch (error) {
          console.error('Error opening chat:', error);
        }
      }
    };
    initializeChat();
  }, [chatApi]);

  return (
    <Layout title="Chat">
      <p className="h2">SharePoint Embedded copilot private preview</p>
    
      {/* ChatEmbedded component from the SDK */}
      <ChatEmbedded
        authProvider={authProvider}
        onApiReady={(api: ChatEmbeddedAPI) => {
          console.log('Chat API ready:', api);
          setChatApi(api);
        }}
        containerId={containerId}
        style={{ width: 'calc(100% - 4px)', height: 'calc(100vh - 20vh)' }}
      />
    </Layout>
  );
};

export default Chat;
