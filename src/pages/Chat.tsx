import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, DotsHorizontalIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import React from 'react';
import { chatService } from '../services/chatService';
import ChatWindow from '../components/ChatWindow';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  priority: 'normal' | 'urgent';
  status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface Conversation {
  id: string;
  recipientName: string;
  recipientId: string;
}

interface ChatProps {
  clientId: string;
}

export default function Chat({ clientId }: ChatProps) {
  const { id: conversationId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const convData = await chatService.fetchConversationById(conversationId!);
        setConversation(convData);

        if (convData.unreadCount > 0) {
          await chatService.updateUnreadCount(conversationId!, 0);
        }

        const msgData = await chatService.fetchMessagesByConversationId(conversationId!);
        setMessages(msgData);
      } catch (err: any) {
        setError('Erro ao carregar dados da conversa. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

  const calculateMessageCost = (content: string): number => {
    const costPerCharacter = 0.01;
    return parseFloat((content.length * costPerCharacter).toFixed(2));
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: {
      conversationId: string;
      senderId: string;
      recipientId: string;
      content: string;
      timestamp: string;
      priority: 'normal' | 'urgent';
      status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
      cost: number;
    } = {
      conversationId: conversationId!,
      senderId: clientId,
      recipientId: conversation?.recipientId || '',
      content,
      timestamp: new Date().toISOString(),
      priority: 'normal',
      status: 'queued',
      cost: calculateMessageCost(content),
    };

    try {
      const createdMessage = await chatService.sendMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, createdMessage]);

      await chatService.updateLastMessage(
        conversationId!,
        content,
        newMessage.timestamp
      );

      setConversation((prevConversation) => ({
        ...prevConversation!,
        lastMessageContent: content,
        lastMessageTime: newMessage.timestamp,
      }));
    } catch (err: any) {
      console.error('Erro ao enviar mensagem ou atualizar conversa:', err);
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
        clientId={clientId}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}