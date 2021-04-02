import React from 'react';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import ChatBox from './chatbox/ChatBox.jsx';

export default function ClassroomSession() {
  return (
    <div>
      <ClassroomInfo />
      <ChatBox />
    </div>
  );
}
