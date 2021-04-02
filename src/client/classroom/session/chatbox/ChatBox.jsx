import React from 'react';
import MessageList from './MessageList.jsx';
import MessageCompose from './MessageCompose.jsx';

export default function ChatBox() {
  return (
    <div>
      <MessageList />
      <MessageCompose />
    </div>
  );
}
