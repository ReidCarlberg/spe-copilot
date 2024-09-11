import React, { useEffect, useState } from 'react';
import Layout from './Layout';  // Import the Layout component
import ChatEmbedded, { ChatEmbeddedAPI, IChatEmbeddedApiAuthProvider } from '../sdk/ChatEmbedded'; // Import the necessary SDK components
import { useMsal } from '@azure/msal-react';

const Chat: React.FC = () => {
  const { instance, accounts } = useMsal();
  
  // Store the ChatEmbeddedAPI instance
  const [chatApi, setChatApi] = useState<ChatEmbeddedAPI | null>(null);

  // Define the authProvider object using the interface
  const authProvider: IChatEmbeddedApiAuthProvider = {
    hostname: process.env.REACT_APP_SHAREPOINT_HOSTNAME || '',
    getToken: async (): Promise<string> => {
      try {
        const account = accounts[0];
        if (!account) {
          throw new Error('No account available for token acquisition');
        }

        const tokenResponse = await instance.acquireTokenSilent({
          scopes: [`${authProvider.hostname}/.default`],
          account,
        });

        const accessToken = tokenResponse.accessToken;
        console.log('Token received:', accessToken);
        return accessToken;
      } catch (error) {
        console.error('Error acquiring token:', error);
        throw new Error('Could not get token');
      }
    },
  };

  useEffect(() => {
    // If chatApi is ready, open the chat
    const initializeChat = async () => {
      if (chatApi) {
        try {
          await chatApi.openChat();
        } catch (error) {
          console.error('Error opening chat:', error);
        }
      }
    };

    initializeChat();
  }, [chatApi]);

  return (
    <Layout title="Chat" >
      <h1>SharePoint Embedded copilot private preview</h1>
    
      {/* ChatEmbedded component from SDK */}
      <ChatEmbedded
        authProvider={authProvider}
        onApiReady={(api: ChatEmbeddedAPI) => setChatApi(api)}  // Set chatApi when API is ready
      />
    </Layout>
  );
};

export default Chat;