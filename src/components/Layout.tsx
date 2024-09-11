import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import '../styles/styles.css'; // Import the custom styles

const Layout: React.FC<{
  title: string;
  message?: string;
  children: React.ReactNode;
}> = ({ title, message, children }) => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;
  const navigate = useNavigate();

  // Get the username (e.g., email) from the first account if authenticated
  const username = isAuthenticated ? accounts[0]?.username : null;

  const handleLogin = () => {
    instance.loginPopup()
      .then(() => {
        navigate('/chat');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error(e);
    });
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-custom"> {/* Apply navbar-custom class */}
        <a className="navbar-brand" href="/">SPE Copilot Sample (for private preview)</a>
        
        {/* Hamburger toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Collapsible navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/containers">Containers</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">Chat</Link>
                </li>
              </>
            )}
          </ul>

          {/* Login/Logout section */}
          <ul className="navbar-nav ml-auto">
            {!isAuthenticated ? (
              <button onClick={handleLogin} className="btn btn-primary">Login</button>
            ) : (
              <>
                <span className="navbar-text mr-3">{username}</span> {/* Show the username */}
                <button onClick={handleLogout} className="btn btn-danger">Sign Out</button>
              </>
            )}
          </ul>
        </div>
      </nav>

      {message && <div className="alert alert-info"><p>{message}</p></div>}

      <div className="container mt-4">{children}</div>
    </div>
  );
};

export default Layout;
