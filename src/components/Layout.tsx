import React, { useEffect } from 'react';

const Layout: React.FC<{
  title: string;
  username?: string;
  message?: string;
  orig_url?: string;
  orig_body?: any;
  orig_results?: any;
  orig_req_id?: string;
  children: React.ReactNode;
}> = ({ title, username, message, orig_url, orig_body, orig_results, orig_req_id, children }) => {
  
  useEffect(() => {
    // Set the document title dynamically
    document.title = title;
  }, [title]);

  return (
    <div>
      {username ? (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">SPE Playground</a>
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
                <a className="nav-link" href="/containers/">Containers</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/search/">Search</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/test-sample">Test An API Call</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signout/">Sign Out ({username})</a>
              </li>
            </ul>
          </div>
        </nav>
      ) : (
        <p>Visit <a href="https://aka.ms/start-spe">aka.ms/start-spe</a> to learn more about SharePoint Embedded.</p>
      )}

      {message && <div className="alert alert-info"><p>{message}</p></div>}

      <div className="container mt-4">{children}</div>

      {orig_url || orig_body || orig_results ? (
        <>
          <button
            id="toggleButton"
            className="btn btn-success fixed-bottom"
            type="button"
            data-toggle="collapse"
            data-target="#detailsSection"
            aria-expanded="false"
            aria-controls="detailsSection"
          >
            Show API Details
          </button>
          <div className="collapse" id="detailsSection">
            <p className="mt-4 mb-3 font-weight-bold">API Details</p>
            {orig_url && <><p className="mb-2 font-weight-bold">URL</p><pre>{orig_url}</pre></>}
            {orig_body && <><p className="mb-2 font-weight-bold">Body</p><pre>{JSON.stringify(orig_body, null, 2)}</pre></>}
            {orig_results && <><p className="mb-2 font-weight-bold">Results</p><pre>{JSON.stringify(orig_results, null, 2)}</pre></>}
            {orig_req_id && <><p className="mb-2 font-weight-bold">Request ID</p><pre>{orig_req_id}</pre></>}
          </div>
        </>
      ) : (
        <button className="btn btn-secondary disabled fixed-bottom" type="button">No Details Available</button>
      )}
    </div>
  );
};

export default Layout;
