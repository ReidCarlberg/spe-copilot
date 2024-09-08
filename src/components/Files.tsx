import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import Layout from './Layout';  // Import the Layout component

interface FileItem {
  name: string;
}

const Files: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { instance, accounts } = useMsal();

  const containerId = "b!rWzsZXXFWEOeeP31bSE5BTjn_6qC3dFNloUBMv62EMilewHuRwQrQau-zcJu2BT0";
  const folderId = "root";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Get the token for the API call
        const account = accounts[0];
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['https://graph.microsoft.com/.default'],
          account,
        });

        const accessToken = tokenResponse.accessToken;

        // Construct the full API URL
        const apiUrl = `https://graph.microsoft.com/v1.0/drives/${containerId}/items/${folderId}/children?$expand=listItem($expand=fields)`;

        console.log('Full API URL:', apiUrl);

        // Fetch data from the API
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Extract the relevant data from the response
        setFiles(response.data.value.map((item: any) => ({
          name: item.name,
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [instance, accounts]);

  return (
    <Layout title="Files" >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Files</h1>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default Files;
