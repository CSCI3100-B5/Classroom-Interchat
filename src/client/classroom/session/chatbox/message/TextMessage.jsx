import React, { useReducer } from 'react';
import MarkdownRender from './MarkdownRender.jsx';
import './TextMessage.scoped.css';
import { BsTextCenter } from 'react-icons/bs';


export default function TextMessage({ message }) {
  return (
    <div>
      <p className="iconRight"><BsTextCenter /></p>
      <div>
        <div className="MessageRight"><MarkdownRender>{message.content}</MarkdownRender></div>
      </div>
    </div>
  );
}
/* <div>
<div><MarkdownRender>{message.content}</MarkdownRender></div>
</div> */
/* <p className="MessageRight">{message.sender.name}</p> */
