import React from 'react';

export default function StatusMessage({ message }) {
  return (
    <div>
      <p className="text-muted">
        {message.content}
      </p>
    </div>
  );
}
