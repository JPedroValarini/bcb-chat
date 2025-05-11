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

  const formatDocument = (value: string, type: 'CPF' | 'CNPJ') => {
    const digits = value.replace(/\D/g, '');

    if (type === 'CPF') {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\/\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center mb-4 border-2 border-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-black">Big Chat Brasil</h1>
          <p className="text-gray-600 mt-2">Acesso ao painel</p>
        </div>

        <div className="mb-6">
          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
            Documento ({documentType === 'CPF' ? 'CPF' : 'CNPJ'})
          </label>
          <div className="relative">
            <input
              id="document"
              type="text"
              value={formatDocument(documentId, documentType)}
              onChange={(e) => {

                const newValue = e.target.value.replace(/\D/g, '');
                setDocumentId(newValue);
              }}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-200 transition-all placeholder-gray-400"
              placeholder={documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
              maxLength={documentType === 'CPF' ? 14 : 18}
            />
            <div className="absolute right-3 top-3 text-gray-400">
              {documentType === 'CPF' ? 'PF' : 'PJ'}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-6 mb-8">
          <button
            onClick={() => setDocumentType('CPF')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${documentType === 'CPF' ? 'bg-amber-300 text-black shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pessoa Física
          </button>
          <button
            onClick={() => setDocumentType('CNPJ')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${documentType === 'CNPJ' ? 'bg-amber-300 text-black shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pessoa Jurídica
          </button>
        </div>
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Entrar
        </button>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Problemas para acessar? Contate nosso suporte</p>
        </div>
      </div>
    </div>
  );
}