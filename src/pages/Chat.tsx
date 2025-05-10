import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, DotsHorizontalIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import React from 'react';
import { chatService } from '../services/chatService';
import ChatWindow from '../components/ChatWindow';

interface Message {
  id: string;
  content: string;
  sentBy: { id: string; type: 'client' | 'user' };
  timestamp: string;
  priority: 'normal' | 'urgent';
  status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface Conversation {
  id: string;
  recipientName: string;
}

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const convData = await chatService.fetchConversationById(id!);
        setConversation(convData);

        const msgData = await chatService.fetchMessagesByConversationId(id!);
        setMessages(msgData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      content,
      sentBy: { id: 'user-id', type: 'user' },
      timestamp: new Date().toISOString(),
      priority: 'normal',
      status: 'sent',
    };

    try {
      const createdMessage = await chatService.sendMessage({
        ...newMessage,
        conversationId: id,
      });

      setMessages((prevMessages) => [...prevMessages, createdMessage]);
    } catch (err: any) {
      setError('Erro ao enviar mensagem. Tente novamente.');
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

      <ChatWindow
        conversationId={id!}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}