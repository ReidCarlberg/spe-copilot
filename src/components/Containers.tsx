import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import Layout from './Layout'; // Import Layout component
import { Link } from 'react-router-dom'; // Import Link from react-router-dom to handle navigation

interface Container {
  id: string;
  displayName: string;
  createdDateTime: string;
}

const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const account = accounts[0];
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['https://graph.microsoft.com/.default'],
          account,
        });

        const accessToken = tokenResponse.accessToken;

        const apiUrl = `https://graph.microsoft.com/v1.0/storage/fileStorage/containers?$filter=containerTypeId eq ${process.env.REACT_APP_CONTAINER_TYPE_ID}`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setContainers(response.data.value);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching containers:', error);
        setLoading(false);
      }
    };

    fetchContainers();
  }, [instance, accounts]);

  return (
    <Layout title="Containers">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Containers</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created Date</th>
                <th>Custom copilot</th> {/* New column for chat link */}
              </tr>
            </thead>
            <tbody>
              {containers.map((container) => (
                <tr key={container.id}>
                  <td>{container.displayName}</td>
                  <td>{new Date(container.createdDateTime).toLocaleDateString()}</td>
                  <td>
                    {/* Link to Chat with the containerId */}
                    <Link to={`/Find?containerId=${container.id}`}>Open copilot</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Containers;
