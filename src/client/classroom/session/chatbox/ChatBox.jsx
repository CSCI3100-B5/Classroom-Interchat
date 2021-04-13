import React, { useState } from 'react';
import MessageList from './MessageList.jsx';
import MessageCompose from './MessageCompose.jsx';
import CreateQuiz from './CreateQuiz.jsx';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import './ChatBox.scoped.css';

export default function ChatBox() {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const { data } = useDataStore();
  if (showCreateQuiz) {
    return (
      <div className="create-quiz-container">
        <CreateQuiz onBack={() => setShowCreateQuiz(false)} />
      </div>
    );
  }
  return (
    <div className="chat-box">
      <MessageList />
      {data.classroomMeta.closedAt
        ? null
        : <MessageCompose onCreateQuiz={() => setShowCreateQuiz(true)} />}
    </div>
  );
}
