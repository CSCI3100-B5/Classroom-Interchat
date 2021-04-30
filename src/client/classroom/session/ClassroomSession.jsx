import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import ChatBox from './chatbox/ChatBox.jsx';
import { useDataStore } from '../../contexts/DataStoreProvider.jsx';
import './ClassroomSession.scoped.css';
import ParticipantList from './info/ParticipantList.jsx';

/**
 * The page containing related major components
 * Handles routing and the show/hide logic of participant list
 */
export default function ClassroomSession() {
  const history = useHistory();
  const { data } = useDataStore();
  const [showParticipantList, setShowParticipantList] = useState(false);

  // if refresh token is falsy, the user is not logged in yet
  // redirect to Auth page
  useEffect(() => {
    if (!data.refreshToken) history.push('/auth');
  }, [data.refreshToken]);

  // if classroom metadata is falsy, the user hasn't joined any classrooms
  // this is to guard against direct navigation to /classroom/session via URL
  // redirect to Join Classroom page
  useEffect(() => {
    if (!data.classroomMeta) {
      console.log('Classroom meta does not exist, re-routing to join classroom');
      history.push('/classroom');
    }
  }, [data.classroomMeta]);

  // short-circuit rendering if redirecting
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
