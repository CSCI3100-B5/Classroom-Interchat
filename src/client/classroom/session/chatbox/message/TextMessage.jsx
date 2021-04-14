import React from 'react';
import MarkdownRender from './MarkdownRender.jsx';
import './TextMessage.scoped.css';


export default function TextMessage({ message }) {
  return (
    <div className="message-box">
      <MarkdownRender>{message.content}</MarkdownRender>
    </div>
  );
}
