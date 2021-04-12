import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import ChatBox from './chatbox/ChatBox.jsx';
import { useDataStore } from '../../contexts/DataStoreProvider.jsx';
import './ClassroomSession.scoped.css';
import ParticipantList from './info/ParticipantList.jsx';

export default function ClassroomSession() {
  const history = useHistory();
  const { data } = useDataStore();
  const [showParticipantList, setShowParticipantList] = useState(false);

  useEffect(() => {
    if (!data.classroomMeta) {
      console.log('Classroom meta does not exist, re-routing to join classroom');
      history.push('/classroom');
    }
  }, [data.classroomMeta]);

  if (!data.classroomMeta) return (<p>No session detected...</p>);
  return (
    <div className="session-container">
      <ClassroomInfo className="classroom-info" onShowParticipantList={() => setShowParticipantList(!showParticipantList)} />
      {showParticipantList
        ? <ParticipantList onCloseParticipantList={() => setShowParticipantList(false)} />
        : <ChatBox className="chat-box" />}
    </div>
  );
}
