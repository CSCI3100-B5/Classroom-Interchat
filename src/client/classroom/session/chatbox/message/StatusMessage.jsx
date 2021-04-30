import React from 'react';
import './StatusMessage.scoped.css';

/**
 * A Status Message is basically a text message with sender = null
 * i.e. it is sent by the server to record classroom management actions
 * This component simply renders the status text
 */
export default function StatusMessage({ message }) {
  return (
    <div className="max-w-100 text-center">
      <span className="text-muted text-center">
        {message.content}
      </span>
    </div>
  );
}
