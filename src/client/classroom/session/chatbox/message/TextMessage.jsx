import React from 'react';
import MarkdownRender from './MarkdownRender.jsx';

/**
 * A Text Message, simply renders a message box containing the rendered
 * Markdown content
 * The styling used to create the message box and to adapt the Markdown
 * content is in message.css, shared by all message components
 */
export default function TextMessage({ message }) {
  return (
    <div className="message-box markdown-content">
      <MarkdownRender>{message.content}</MarkdownRender>
    </div>
  );
}
