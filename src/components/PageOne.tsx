import React from 'react';
import Layout from './Layout'; // Import the Layout component

const PageOne: React.FC = () => {
  return (
    <Layout title="Home" >
      <h1>SPE Copilot Demo</h1>
      <p>This page is publicly available.</p>
      <p>Signin to continue.</p>
    </Layout>
  );
};

export default PageOne;
