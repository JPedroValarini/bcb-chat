import React, { useState } from 'react';
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

  const handleLogin = (loggedInClient: Client) => {
    setClient(loggedInClient);
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
            client ? (
              <Conversations client={client} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            client ? (
              <Chat />
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