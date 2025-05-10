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
  const [doc, setDoc] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    documentId: '',
    documentType: 'CPF',
    planType: 'prepaid',
    balance: 0,
    active: true,
  });
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    const cleanedDoc = doc.replace(/\D/g, '');
    const isValid = documentType === 'CPF' ? cleanedDoc.length === 11 : cleanedDoc.length === 14;

    if (!isValid) {
      setError(`Digite um ${documentType} válido (${documentType === 'CPF' ? '11' : '14'} dígitos)`);
      return;
    }

    try {
      const client = await clientService.fetchClientByDocumentId(cleanedDoc);
      if (client) {
        onLogin(client);
        navigate('/conversations');
      } else {
        setError('Cliente não encontrado. Verifique o CPF ou CNPJ.');
      }
    } catch (err) {
      setError('Erro ao buscar cliente. Tente novamente mais tarde.');
    }
  };

  const handleCreateAccount = async () => {
    setError('');
    try {
      if (!newClient.name) {
        setError('Nome é obrigatório');
        return;
      }

      const cleanedDoc = newClient.documentId.replace(/\D/g, '');
      const isValidDoc = documentType === 'CPF' ? cleanedDoc.length === 11 : cleanedDoc.length === 14;

      if (!isValidDoc) {
        setError(`${documentType} inválido (${documentType === 'CPF' ? '11' : '14'} dígitos)`);
        return;
      }

      const clientData = {
        ...newClient,
        documentType,
        id: `client-${Date.now()}`,
        balance: newClient.planType === 'prepaid' ? newClient.balance || 0 : undefined,
        limit: newClient.planType === 'postpaid' ? 100 : undefined,
      };

      const response = await clientService.createClient(clientData);

      if (response.status !== 201) {
        throw new Error('Erro ao criar conta');
      }

      setShowModal(false);
      setNewClient({
        name: '',
        documentId: '',
        documentType: 'CPF',
        planType: 'prepaid',
        balance: 0,
        active: true,
      });
      setDocumentType('CPF');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Criar Nova Conta</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={documentType === 'CPF'}
                      onChange={() => {
                        setDocumentType('CPF');
                        setNewClient({ ...newClient, documentType: 'CPF' });
                      }}
                      className="mr-2"
                    />
                    CPF
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={documentType === 'CNPJ'}
                      onChange={() => {
                        setDocumentType('CNPJ');
                        setNewClient({ ...newClient, documentType: 'CNPJ' });
                      }}
                      className="mr-2"
                    />
                    CNPJ
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {documentType === 'CPF' ? 'Nome Completo' : 'Razão Social'}
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder={documentType === 'CPF' ? 'Seu nome completo' : 'Nome da empresa'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {documentType}
                </label>
                <input
                  type="text"
                  value={newClient.documentId}
                  onChange={(e) => setNewClient({ ...newClient, documentId: e.target.value.replace(/\D/g, '') })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder={`Somente números (${documentType === 'CPF' ? '11' : '14'} dígitos)`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Plano</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newClient.planType === 'prepaid'}
                      onChange={() => setNewClient({ ...newClient, planType: 'prepaid' })}
                      className="mr-2"
                    />
                    Pré-pago
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newClient.planType === 'postpaid'}
                      onChange={() => setNewClient({ ...newClient, planType: 'postpaid' })}
                      className="mr-2"
                    />
                    Pós-pago
                  </label>
                </div>
              </div>

              {newClient.planType === 'prepaid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Inicial (R$)</label>
                  <input
                    type="number"
                    value={newClient.balance || 0}
                    onChange={(e) => setNewClient({ ...newClient, balance: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateAccount}
                  className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-500"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border border-gray-100 transition-all hover:shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao BCB Chat</h1>
        <p className="text-gray-600 mb-6">Informe seu CPF ou CNPJ para começar</p>

        <input
          type="text"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder-gray-400"
          placeholder="Digite seu CPF ou CNPJ"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg w-full hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Entrar
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">ou</div>

        <button
          onClick={() => {
            setShowModal(true);
            setError('');
          }}
          className="border border-yellow-400 text-yellow-600 font-semibold py-3 px-6 rounded-lg w-full hover:bg-yellow-50 transition-colors"
        >
          Criar nova conta
        </button>
      </div>
    </div>
  );
}