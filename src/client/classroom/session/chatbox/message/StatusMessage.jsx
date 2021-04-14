import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div>
      <p className="myMessageRight">
        {message.content}
      </p>
    </div>
  );
}
