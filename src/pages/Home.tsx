import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/clientService';

interface Client {
  id: string;
  name: string;
  documentId: string;
  documentType: 'CPF' | 'CNPJ';
  planType: 'prepaid' | 'postpaid';
  balance?: number;
  limit?: number;
  active: boolean;
}

interface HomeProps {
  onLogin: (loggedInClient: Client) => void;
}

export default function Home({ onLogin }: HomeProps) {
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CNPJ');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    const cleanedDocumentId = documentId.replace(/\D/g, '');
    const isValid =
      (documentType === 'CPF' && cleanedDocumentId.length === 11) ||
      (documentType === 'CNPJ' && cleanedDocumentId.length === 14);

    if (!isValid) {
      setError(`Digite um ${documentType} válido (${documentType === 'CPF' ? '11' : '14'} dígitos).`);
      return;
    }

    try {
      const client = await clientService.fetchClientByDocumentId(cleanedDocumentId);
      if (client) {
        onLogin(client);
        navigate('/conversations');
      } else {
        setError('Cliente não encontrado.');
      }
    } catch (err) {
      setError('Erro ao buscar cliente. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border border-gray-100 transition-all hover:shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Big Chat Brasil</h1>

        <input
          type="text"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder-gray-400"
          placeholder="Digite seu CPF ou CNPJ"
        />

        <div className="flex justify-center items-center mb-6">
          <label className="flex items-center mr-4">
            <input
              type="radio"
              checked={documentType === 'CPF'}
              onChange={() => setDocumentType('CPF')}
              className="mr-2"
            />
            PF
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={documentType === 'CNPJ'}
              onChange={() => setDocumentType('CNPJ')}
              className="mr-2"
            />
            PJ
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg w-full hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}