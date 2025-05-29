import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>🚫 Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
