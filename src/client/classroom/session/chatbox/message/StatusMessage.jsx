import React from 'react';
import './StatusMessage.scoped.css';

export default function StatusMessage({ message }) {
  return (
    <div className="max-w-100 text-center">
      <span className="text-muted text-center">
        {message.content}
      </span>
    </div>
  );
}
