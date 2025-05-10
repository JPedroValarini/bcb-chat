import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import { chatService } from '../services/chatService';

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
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  sentBy: {
    id: string;
    type: 'client' | 'user';
  };
  timestamp: string;
  priority: 'normal' | 'urgent';
  status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
}

export default function Conversations({ client }: { client: Client | null }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!client) return;

      try {
        const convData = await chatService.fetchConversations();

        const filteredConversations = convData.filter(
          (conv: Conversation) => conv.recipientId === client.id
        );
        setConversations(filteredConversations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client]);

  const filteredConversations = conversations.filter(conv =>
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
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-2xl text-gray-800">Minhas Conversas</h2>
        <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
          {getBalanceDisplay()}
        </span>
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
        {filteredConversations.map((conversation) => (
          <Link
            to={`/chat/${conversation.id}`}
            key={conversation.id}
            className="block p-6 hover:bg-gray-50 transition-colors duration-200"
            onClick={() => {
              if (conversation.unreadCount > 0) {
                setConversations(convs => convs.map(c =>
                  c.id === conversation.id ? { ...c, unreadCount: 0 } : c
                ));
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
                  minute: '2-digit'
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm">
          Nova Conversa
        </button>
      </div>
    </div>
  );
}