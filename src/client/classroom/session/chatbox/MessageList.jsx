import React, { useState } from 'react';
import Message from './message/Message.jsx';

export default function MessageList() {
  const [messageList] = useState([
    {
      type: 'Text',
      text: 'message text',
      sender: 'Username',
      timestamp: new Date(),
    },
    {
      type: 'Quiz',
      text: 'message text 2',
      sender: 'Username2',
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
