import { Button, Badge } from 'react-bootstrap';
import React from 'react';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';


function ParticipantList() {
  const { data } = useDataStore();
  return (
    <ul>
      {
        data.participants.map(x => (
          <li key={x.name}>
            {x.name}
            {(() => {
              if (x.id === data.classroomMeta.host.id) return (<Badge variant="primary">HOST</Badge>);
              if (x.permission === 'instructor') return (<Badge variant="success">INSTRUCTOR</Badge>);
              if (x.permission === 'requesting') return (<Badge variant="secondary">REQUESTING</Badge>);
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
