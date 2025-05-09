import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, DotsHorizontalIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import React from 'react';

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
  cost?: number;
}

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const clientResponse = await fetch('http://localhost:3001/clients/1');
        const clientData = await clientResponse.json();
        setClient(clientData);

        const convResponse = await fetch(`http://localhost:3001/conversations/${id}`);
        if (!convResponse.ok) throw new Error('Conversa não encontrada');
        const convData = await convResponse.json();
        setConversation(convData);

        const msgResponse = await fetch(`http://localhost:3001/messages?conversationId=${id}&_sort=timestamp&_order=asc`);
        if (!msgResponse.ok) throw new Error('Erro ao carregar mensagens');
        const msgData = await msgResponse.json();
        setMessages(msgData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !client || !id) return;

    const messageCost = 0.25;

    if (client.planType === 'prepaid' && (client.balance || 0) < messageCost) {
      setError('Saldo insuficiente para enviar mensagem');
      return;
    }

    const messageToSend: Omit<Message, 'id'> = {
      conversationId: id,
      content: newMessage,
      sentBy: {
        id: 'current-user-id',
        type: 'user',
      },
      timestamp: new Date().toISOString(),
      priority: 'normal',
      status: 'sent',
      cost: messageCost
    };

    try {
      const response = await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageToSend),
      });

      if (!response.ok) throw new Error('Erro ao enviar mensagem');
      const createdMessage = await response.json();

      if (client.planType === 'prepaid') {
        await fetch(`http://localhost:3001/clients/1`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance: (client.balance || 0) - messageCost }),
        });
      }

      setMessages([...messages, createdMessage]);
      setNewMessage('');
      setError(null);

      if (conversation) {
        setConversation({
          ...conversation,
          lastMessageContent: newMessage,
          lastMessageTime: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-3">
          <Link to="/conversations" className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <h2 className="font-semibold text-lg">
            {conversation?.recipientName || 'Conversa'}
          </h2>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <DotsHorizontalIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((message) => {
          const isUser = message.sentBy.type === 'user';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                    ? 'bg-yellow-400 text-gray-900 rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 flex ${isUser ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <span className="text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isUser && (
                    <span className="ml-1">
                      {message.status === 'read' ? '✓✓' : '✓'}
                    </span>
                  )}
                  {message.cost && (
                    <span className="ml-1 text-gray-600">
                      R$ {message.cost.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-3 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {client && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {client.planType === 'prepaid'
              ? `Saldo disponível: R$ ${client.balance?.toFixed(2)}`
              : `Limite disponível: R$ ${client.limit?.toFixed(2)}`}
          </p>
        )}
      </div>
    </div>
  );
}