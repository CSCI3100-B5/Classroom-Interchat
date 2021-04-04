import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ClassroomInfo from './info/ClassroomInfo.jsx';
import ChatBox from './chatbox/ChatBox.jsx';
import { useDataStore } from '../../contexts/DataStoreProvider.jsx';

export default function ClassroomSession() {
  const history = useHistory();
  const { data } = useDataStore();

  useEffect(() => {
    if (!data.classroomMeta) {
      console.log('Classroom meta does not exist, re-routing to join classroom');
      history.push('/classroom');
    }
  }, []);
  if (!data.classroomMeta) return (<p>No session detected...</p>);
  return (
    <div>
      <ClassroomInfo />
      <ChatBox />
    </div>
  );
}
