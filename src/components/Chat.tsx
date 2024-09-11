import React, { useEffect, useState } from 'react';
import Layout from './Layout';  // Import the Layout component
import ChatEmbedded, { ChatEmbeddedAPI, IChatEmbeddedApiAuthProvider } from '../sdk/ChatEmbedded'; // Import the necessary SDK components
import { useMsal } from '@azure/msal-react';
import { DataSourceType, IDataSourcesProps } from '../sdk/types'; // Import the necessary types for data sources

const Chat: React.FC = () => {
  const { instance, accounts } = useMsal();
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
          scopes: ["user.read", "FileStorageContainer.selected", "Files.Read.All"], // Ensure proper scopes
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
    const initializeChat = async () => {
      if (chatApi) {
        try {
          console.log('Chat API is ready'); 

          // Hardcoded document library data source
          const documentLibraryDataSource: IDataSourcesProps = {
            type: DataSourceType.DocumentLibrary,
            value: {
              name: 'Document Library',  // Use a descriptive name here
              url: 'https://greenwoodeccentrics.sharepoint.com/contentstorage/CSP_65ec6cad-c575-4358-9e78-fdf56d213905/Document%20Library',  // Hardcoded URL
            },
          };

          // Set the data sources before opening the chat
          chatApi.setDataSources([documentLibraryDataSource]);
          console.log('Document Library data source set:', documentLibraryDataSource);

          // Open the chat after setting data sources
          await chatApi.openChat();
          console.log('Chat opened successfully');
        } catch (error) {
          console.error('Error initializing chat or setting data source:', error);
        }
      } else {
        console.log('chatApi is not initialized yet');
      }
    };

    initializeChat();
  }, [chatApi]);

  return (
    <Layout title="Chat">
      <h1>SharePoint Embedded copilot private preview</h1>
    
      {/* ChatEmbedded component from SDK */}
      <ChatEmbedded
        authProvider={authProvider}
        onApiReady={(api: ChatEmbeddedAPI) => {
          console.log('Chat API ready:', api);  // Log when onApiReady is triggered
          setChatApi(api);  // Set chatApi when API is ready
        }}
      />
    </Layout>
  );
};

export default Chat;
