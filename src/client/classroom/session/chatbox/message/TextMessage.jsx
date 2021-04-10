import React, { useReducer } from 'react';
import MarkdownRender from './MarkdownRender.jsx';
import './TextMessage.scoped.css';

export default function TextMessage({ message }) {
  return (
    <divout>
      <div className="myMessage">
        <div><MarkdownRender>{message.content}</MarkdownRender></div>
      </div>
    </divout>
  );
}
/* <div>
<div><MarkdownRender>{message.content}</MarkdownRender></div>
</div> */
