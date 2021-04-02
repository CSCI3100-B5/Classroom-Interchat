import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import ChatBox from './chatbox/ChatBox.jsx';
import { useDataStore } from '../../contexts/DataStoreProvider.jsx';

export default function ClassroomSession() {
  const history = useHistory();
  const { classroomMeta } = useDataStore();

  useEffect(() => {
    if (!classroomMeta) history.push('/classroom');
  }, []);
  if (!classroomMeta) return (<p>No session detected...</p>);
  return (
    <div>
      <ClassroomInfo />
      <ChatBox />
    </div>
  );
}
