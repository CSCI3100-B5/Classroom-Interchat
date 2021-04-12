import React, { useReducer } from 'react';
import MarkdownRender from './MarkdownRender.jsx';
import './TextMessage.scoped.css';
import { BsTextCenter } from 'react-icons/bs';


export default function TextMessage({ message }) {
  return (
    <div className="relativeBox">
      <p className="iconRight"><BsTextCenter /></p>
      <p className="MessageRight">{message.sender.name}</p>
      <div className="MessageRight">
        <div className="MessageRight"><MarkdownRender>{message.content}</MarkdownRender></div>
      </div>
    </div>
  );
}
/* <div>
<div><MarkdownRender>{message.content}</MarkdownRender></div>
</div> */
