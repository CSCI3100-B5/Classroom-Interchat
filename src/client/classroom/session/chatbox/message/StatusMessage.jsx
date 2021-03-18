import React from 'react';

// A type of message sent by the system.
// Examples include "xxx left the classroom", "xxx disabled the classroom"...

export default function StatusMessage() {
  return (
    <div>
      <p className="text-muted">
        Status broadcast (e.g. someone left the chat, someone disabled the classroom)
      </p>
    </div>
  );
}
