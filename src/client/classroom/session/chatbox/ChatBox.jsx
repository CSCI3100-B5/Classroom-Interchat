import React, { useState } from 'react';
import MessageList from './MessageList.jsx';
import MessageCompose from './MessageCompose.jsx';
import CreateQuiz from './CreateQuiz.jsx';

export default function ChatBox() {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  if (showCreateQuiz) {
    return (
      <div>
        <CreateQuiz />
      </div>
    );
  }
  return (
    <div>
      <MessageList />
      <MessageCompose onCreateQuiz={() => setShowCreateQuiz(true)} />
    </div>
  );
}
