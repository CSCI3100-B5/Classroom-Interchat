import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div className="relativeBox">
      <p className="otherMessageLeft">
        {message.content}
      </p>
    </div>
  );
}
