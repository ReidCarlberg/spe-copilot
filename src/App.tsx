import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import Containers from './components/Containers';
import Files from './components/Files';
import Chat from './components/Chat'; // Import the Chat component
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute

const App: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance.loginPopup().catch((e) => {
      console.error(e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error(e);
    });
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Page One</Link>
          </li>
          <li>
            <Link to="/page-two">Page Two</Link>
          </li>
          <li>
            <Link to="/containers">Containers</Link>
          </li>
          <li>
            <Link to="/files">Files</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link> {/* Add the Chat link */}
          </li>
          {!isAuthenticated ? (
            <button onClick={handleLogin}>Login</button>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<PageOne />} />
        <Route
          path="/page-two"
          element={
            <ProtectedRoute>
              <PageTwo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/containers"
          element={
            <ProtectedRoute>
              <Containers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat" // Add the Chat route
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
