import React from 'react';

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  lastMessageContent: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, onSelectConversation }) => {
  return (
    <div>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          style={{ padding: '10px', borderBottom: '1px solid #ccc', cursor: 'pointer' }}
        >
          <h4>{conversation.recipientName}</h4>
          <p>{conversation.lastMessageContent}</p>
          <small>{new Date(conversation.lastMessageTime).toLocaleString()}</small>
          {conversation.unreadCount > 0 && <span> ({conversation.unreadCount} unread)</span>}
        </div>
      ))}
    </div>
  );
};

export default ConversationList;