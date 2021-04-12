import React from 'react';
import MarkdownRender from './MarkdownRender.jsx';

export default function TextMessage({ message }) {
  return (
    <div>
      <div className="markdown-content"><MarkdownRender>{message.content}</MarkdownRender></div>
    </div>
  );
}
