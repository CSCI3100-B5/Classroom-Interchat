import { Button, Badge } from 'react-bootstrap';
import React from 'react';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';


function ParticipantList() {
  const { data } = useDataStore();
  return (
    <ul>
      {
        data.participants.map(x => (
          <li key={x.user.id}>
            {x.user.name}
            {(() => {
              if (x.user.id === data.classroomMeta.host.id) return (<Badge variant="primary">HOST</Badge>);
              if (x.permission === 'instructor') return (<Badge variant="success">INSTRUCTOR</Badge>);
              if (x.permission === 'requesting') return (<Badge variant="secondary">REQUESTING</Badge>);
              return null;
            })()}
            {x.isOnline ? null : (<Badge>OFFLINE</Badge>)}
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
