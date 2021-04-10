import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div>
      <p className="text-muted">
        {message.content}
      </p>
    </div>
  );
}
