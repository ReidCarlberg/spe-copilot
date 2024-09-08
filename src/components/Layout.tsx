import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import '../styles/styles.css'; // Import the custom styles

const Layout: React.FC<{
  title: string;
  username?: string;
  message?: string;
  children: React.ReactNode;
}> = ({ title, username, message, children }) => {

  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;
  const navigate = useNavigate();

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
    // Set the document title dynamically
    document.title = title;
  }, [title]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-custom"> {/* Apply navbar-custom class */}
        <a className="navbar-brand" href="/">SPE Copilot Sample (for private preview)</a>
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/containers">Containers</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/files">Files</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">Chat</Link>
                </li>
              </>
            )}
            {!isAuthenticated ? (
              <button onClick={handleLogin} className="btn btn-primary ml-auto">Login</button>
            ) : (
              <button onClick={handleLogout} className="btn btn-danger ml-auto">Sign Out ({username || 'User'})</button>
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
