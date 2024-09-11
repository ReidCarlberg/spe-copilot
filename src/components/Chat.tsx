import React, { useEffect, useState } from 'react';
import Layout from './Layout';  // Import the Layout component
import ChatEmbedded, { ChatEmbeddedAPI, IChatEmbeddedApiAuthProvider } from '../sdk/ChatEmbedded'; // Import the necessary SDK components
import { useMsal } from '@azure/msal-react';
import { DataSourceType, IDataSourcesProps } from '../sdk/types'; // Import the necessary types for data sources
import { useSearchParams } from 'react-router-dom';  // To handle query parameters

const Chat: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [chatApi, setChatApi] = useState<ChatEmbeddedAPI | null>(null);
  const [searchParams] = useSearchParams();  // Use to get URL parameters

  // Get the "library" and "name" parameters from the URL
  const libraryUrl = searchParams.get('library');
  const libraryName = searchParams.get('name');
  console.log('Library URL:', libraryUrl); // Log the URL parameter for debugging
  console.log('Library Name:', libraryName); // Log the library name for debugging

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

          // Only set the data source if libraryUrl is available
          if (libraryUrl) {
            const documentLibraryDataSource: IDataSourcesProps = {
              type: DataSourceType.DocumentLibrary,
              value: {
                name: libraryName || 'Document Library',  // Use the libraryName or a default name
                url: libraryUrl,  // Use the libraryUrl from the query parameter
              },
            };

            // Set the data sources before opening the chat
            chatApi.setDataSources([documentLibraryDataSource]);
            console.log('Document Library data source set:', documentLibraryDataSource);
          } else {
            console.log('No library URL provided, opening chat without a specific data source.');
          }

          // Open the chat after setting data sources (if available)
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
  }, [chatApi, libraryUrl, libraryName]);  // Run the effect when the chatApi, libraryUrl, or libraryName changes

  return (
    <Layout title="Chat">
      <p className="h2">
        SharePoint Embedded copilot private preview
        {libraryName && ` - ${libraryName}`} {/* Conditionally render library name */}
      </p>
    
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
