import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import { chatService } from '../services/chatService';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

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

interface Conversation {
  id: string;
  clientId: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

type ConversationsProps = {
  client: Client | null;
  conversations: Conversation[];
  onLogout: () => void;
};

export default function Conversations({ client, onLogout }: ConversationsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!client) return;

      try {
        const convData = await chatService.fetchConversationsByClientId(client.id);
        setConversations(convData);
      } catch (err: any) {
        setError('Erro ao carregar conversas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [client]);

  const clientConversations = conversations.filter((conv) => conv.clientId === client?.id);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectConversation = (conversationId: string) => {
    setIsModalOpen(false);
    navigate(`/chat/${conversationId}`);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceDisplay = () => {
    if (!client) return 'R$ 0,00';
    return client.planType === 'prepaid'
      ? `Saldo: R$ ${client.balance?.toFixed(2)}`
      : `Limite: R$ ${client.limit?.toFixed(2)}`;
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white">
        <h2 className="font-bold text-xl sm:text-2xl text-gray-900 truncate">
          {client?.name}
        </h2>

        <div className="flex justify-between items-center gap-4 w-full sm:w-auto">
          <span className="text-sm text-gray-600 bg-amber-50 px-3 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0">
            {getBalanceDisplay()}
          </span>

          <button
            onClick={onLogout}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Buscar conversas..."
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
        />
      </div>

      <div className="divide-y divide-gray-100">
        {filteredConversations
          .filter(
            (conversation) =>
              conversation.lastMessageContent.trim() !== '' &&
              conversation.lastMessageTime.trim() !== ''
          )
          .map((conversation) => (
            <Link
              to={`/chat/${conversation.id}`}
              key={conversation.id}
              className="block p-6 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => {
                if (conversation.unreadCount > 0) {
                  setConversations((prevConvs) =>
                    prevConvs.map((c) =>
                      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
                    )
                  );
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {conversation.recipientName}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-600 truncate">
                    {conversation.lastMessageContent}
                  </p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </Link>
          ))}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <button onClick={handleOpenModal} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm">
          Nova Conversa
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="relative">
            <button
              onClick={handleCloseModal}
              className="absolute -top-3 -right-3 bg-amber-300 rounded-full p-1 shadow-md hover:bg-amber-400 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-6 text-center text-black">Selecione uma Conversa</h2>
            <ul className="max-h-96 overflow-y-auto">
              {clientConversations.map((conv) => (
                <li
                  key={conv.id}
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-amber-50 transition-colors duration-200 group"
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-black group-hover:text-amber-600">{conv.recipientName}</p>
                    <span className="text-xs text-gray-500">12:30 PM</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    {conv.lastMessageContent || 'Sem mensagens'}
                  </p>
                </li>
              ))}
            </ul>
            {clientConversations.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Nenhuma conversa disponível
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}