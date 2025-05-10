import React from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  content: string;
  sentBy: { id: string; type: 'client' | 'user' };
  timestamp: string;
  priority: 'normal' | 'urgent';
  status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
}

interface ChatWindowProps {
  conversationId: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;