import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div>
      <span className="text-muted">
        {message.content}
      </span>
    </div>
  );
}
