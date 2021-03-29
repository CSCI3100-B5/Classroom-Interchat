import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import ChatBox from './chatbox/ChatBox.jsx';

// A page shown when users have joined the classroom.
// This page is divided into 3 main parts:
//  - ClassroomInfo - basic info of this classroom and participant list
//  - ChatBox - message history and the send message box
//  - Dashboard - visible to instructors only, allowing them to
//      perform actions such as creating quizzes and disabling the classroom

export default function ClassroomSession() {
  const { classroomId } = useParams();
  const [classroom] = useState({
    id: classroomId,
    name: 'Classroom name',
    createdBy: {
      name: 'name'
    },
    participants: [
      {
        name: 'name 1'
      },
      {
        name: 'name 2'
      }
    ]
  });
  return (
    <div>
      <ClassroomInfo classroom={classroom} />
      <ChatBox />
      <Dashboard />
    </div>
  );
}
