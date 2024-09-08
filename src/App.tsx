import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import Containers from './components/Containers';
import Files from './components/Files';
import Chat from './components/Chat'; // Import the Chat component
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PageOne />} /> {/* Home route for PageOne */}
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
          path="/chat"
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
