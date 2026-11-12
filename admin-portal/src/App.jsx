import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import WebApp from '../../src/App.jsx';
import { AuthProvider, useAuth } from '../../src/context/AuthContext.jsx';
import '../../src/index.css';
const AdminGate = () => {
  const { authUser, authLoading, isAdmin, authError, signOut } = useAuth();
  const [error, setError] = useState('');
  if (!authLoading && authUser && !authError && !isAdmin) return <div className="auth-loading"><section>
    <h1>Store admin access required</h1><p>This desktop app is for the store owner.</p>
    {error && <p role="alert">{error}</p>}
    <button onClick={() => signOut().catch(err => setError(err.message))}>Sign out and switch account</button>
  </section></div>;
  return <WebApp />;
};
export default function App() {
  return <HashRouter><AuthProvider><AdminGate /></AuthProvider></HashRouter>;
}
