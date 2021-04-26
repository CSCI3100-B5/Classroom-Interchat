import React from 'react';
import MarkdownRender from './MarkdownRender.jsx';

export default function TextMessage({ message }) {
  return (
    <div className="message-box markdown-content">
      <MarkdownRender>{message.content}</MarkdownRender>
    </div>
  );
}
