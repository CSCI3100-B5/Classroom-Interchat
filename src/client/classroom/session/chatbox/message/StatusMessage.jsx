import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div className="relativeBox">
      <p className="myMessageRight">
        {message.content}
      </p>
    </div>
  );
}
