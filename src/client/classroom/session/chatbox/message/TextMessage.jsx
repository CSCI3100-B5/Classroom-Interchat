import React, { useReducer } from 'react';
import MarkdownRender from './MarkdownRender.jsx';
import './TextMessage.scoped.css';

export default function TextMessage({ message }) {
  return (
    <div className="relativeBox">
      <p className="myMessageRight">{message.sender.name}</p>
      <div className="myMessageRight">
        <div><MarkdownRender>{message.content}</MarkdownRender></div>
      </div>
    </div>
  );
}
/* <div>
<div><MarkdownRender>{message.content}</MarkdownRender></div>
</div> */
