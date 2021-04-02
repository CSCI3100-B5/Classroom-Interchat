import React, { useState } from 'react';
import Message from './message/Message.jsx';

// The message history, belonging to the chatbox.

export default function MessageList() {
  const [messageList] = useState([
    {
      type: 'Text',
      text: 'message text',
      sender: 'name',
      timestamp: new Date(),
    },
    {
      type: 'Quiz',
      text: 'message text 2',
      sender: 'name2',
      timestamp: new Date(),
    }
  ]);
  return (
    <div>
      <ul>
        {
          messageList.map(message => (
            <li><Message message={message} /></li>
          ))
        }
      </ul>
    </div>
  );
}
