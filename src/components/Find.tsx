import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // useSearchParams for query params
import axios from 'axios';
import { useMsal } from '@azure/msal-react';


const Find: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get query parameters (including containerId)
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate();

  const authProvider = {
    getToken: async (): Promise<string> => {
      try {
        const account = accounts[0];
        if (!account) {
          throw new Error('No account available for token acquisition');
        }

        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['https://graph.microsoft.com/.default'],
          account,
        });

        return tokenResponse.accessToken;
      } catch (error) {
        console.error('Error acquiring token:', error);
        throw new Error('Could not get token');
      }
    },
  };

  useEffect(() => {
    const fetchDriveProperties = async () => {
      // Get containerId from query parameters
      const containerId = searchParams.get('containerId');
      
      if (!containerId) {
        setErrorMessage('No containerId provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Query Parameter - containerId:', containerId);

        const token = await authProvider.getToken();
        
        // API call to retrieve drive properties
        const apiUrl = `https://graph.microsoft.com/v1.0/storage/fileStorage/containers/${containerId}/drive`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, webUrl } = response.data;
        console.log('Drive webUrl:', webUrl);

        // Redirect to the Chat component with the library URL
        navigate(`/chat?library=${encodeURIComponent(webUrl)}&name=${encodeURIComponent(name)}`);
      } catch (error) {
        setErrorMessage('Error fetching drive properties');
        console.error('Error fetching drive properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveProperties();
  }, [searchParams, authProvider, navigate]);  // Dependency array updated to include searchParams

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return null;  // The component does not render anything itself, it just redirects
};

export default Find;
