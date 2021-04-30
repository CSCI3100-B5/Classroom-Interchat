import React, { useState } from 'react';
import MessageList from './MessageList.jsx';
import MessageCompose from './MessageCompose.jsx';
import CreateQuiz from './CreateQuiz.jsx';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import './ChatBox.scoped.css';

/**
 * This is a mid-level component to render different major parts of the
 * chat box: the Message List, the Message Compose box and the
 * Create Quiz form (if shown)
 * Sub-component show/hide logic and CSS layout is handled here
 */
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
