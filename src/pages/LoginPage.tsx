import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (clientId: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [documentId, setDocumentId] = useState('');

  const handleLogin = () => {
    if (documentId.trim()) {
      onLogin(documentId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Digite seu CPF ou CNPJ"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
      />
      <button onClick={handleLogin} style={{ padding: '10px', width: '100px' }}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;