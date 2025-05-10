import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleSend}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-3 rounded-full transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default MessageInput;