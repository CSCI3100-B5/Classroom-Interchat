import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div className="relativeBox">
      <p className="senderLeft">
        {' '}
        <p>
          by sender at
          {' '}
          {message.createdAt.toString()}
        </p>

      </p>
      <p className="otherMessageLeft">
        {message.content}
      </p>
    </div>
  );
}
