import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat';

type Client = {
  id: string;
  name: string;
  documentId: string;
  documentType: "CPF" | "CNPJ";
  planType: "prepaid" | "postpaid";
  active: boolean;
};

const App: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const storedClient = localStorage.getItem('loggedClient');
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    }
  }, []);

  const handleLogin = (loggedInClient: Client) => {
    if (loggedInClient.active) {
      localStorage.setItem('loggedClient', JSON.stringify(loggedInClient));
      setClient(loggedInClient);
    } else {
      alert('Cliente inativo. Entre em contato com o suporte.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedClient');
    setClient(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            client ? (
              <Navigate to="/conversations" replace />
            ) : (
              <Home onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/conversations"
          element={
            client && client.active ? (
              <Conversations client={client} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            client && client.active ? (
              <Chat clientId={client.id} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;