import React from 'react';

export default function TextMessage({ message }) {
  return (
    <div>
      <p>{message.content}</p>
    </div>
  );
}
