import React from 'react';

interface Message {
  id: string;
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

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sentBy.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
          ? 'bg-yellow-400 text-gray-900 rounded-br-none'
          : 'bg-white border border-gray-200 rounded-bl-none'
          }`}
      >
        <p>{message.content}</p>
        <div className="text-xs mt-1 text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;