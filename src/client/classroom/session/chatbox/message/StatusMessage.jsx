import React from 'react';

export default function StatusMessage({ message }) {
  return (
    <div>
      <span className="text-muted">
        {message.content}
      </span>
    </div>
  );
}
