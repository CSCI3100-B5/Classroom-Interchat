import React from 'react';
import MessageList from './MessageList.jsx';
import MessageCompose from './MessageCompose.jsx';

// A part of the classroom session page. A combination of the message
// list and the send message text box.

export default function ChatBox() {
  return (
    <div>
      <MessageList />
      <MessageCompose />
    </div>
  );
}
