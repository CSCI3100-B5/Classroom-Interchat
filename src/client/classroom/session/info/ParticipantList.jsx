import { Button } from 'react-bootstrap';
import React from 'react';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';


function ParticipantList() {
  const { classroomMeta, participants } = useDataStore();
  return (
    <ul>
      {
        participants.map(x => (
          <li key={x.name}>
            {x.name}
            {(() => {
              if (x.id === classroomMeta.host.id) return (<small>HOST</small>);
              if (x.permission === 'instructor') return (<small>INSTRUCTOR</small>);
              if (x.permission === 'requesting') return (<small>REQUESTING</small>);
              return null;
            })()}
            <Button variant="flat">Promote</Button>
            <Button variant="flat">Token</Button>
            <Button variant="flat">{x.isMuted ? 'Unmute' : 'Mute'}</Button>
            <Button variant="danger">Kick</Button>
          </li>
        ))
      }
    </ul>
  );
}

export default ParticipantList;
