import React, { useState } from 'react';
import Message from './message/Message.jsx';

export default function MessageList() {
  const [messageList] = useState([
    {
      id: '1',
      type: 'Text',
      text: 'message text',
      sender: 'name',
      timestamp: new Date(),
    },
    {
      id: '2',
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
            <li key={message.id}><Message message={message} /></li>
          ))
        }
      </ul>
    </div>
  );
}
