import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import ParticipantList from './info/ParticipantList.jsx';
import Dashboard from './dashboard/Dashboard.jsx';

export default function ClassroomSession() {
  const { classroomId } = useParams();
  const [classroom] = useState({
    id: classroomId,
    name: 'Classroom name',
    createdBy: {
      username: 'Username'
    },
    participants: [
      {
        username: 'Username 1'
      },
      {
        username: 'Username 2'
      }
    ]
  });
  return (
    <div>
      <ClassroomInfo classroom={classroom} />
      <ParticipantList classroom={classroom} />
      <Dashboard />
    </div>
  );
}
