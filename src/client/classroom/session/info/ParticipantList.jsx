import { Button, Badge } from 'react-bootstrap';
import React from 'react';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';


function ParticipantList() {
  const { data, getSelfParticipant } = useDataStore();
  const {
    requestPermission,
    cancelRequestPermission,
    promoteParticipant,
    demoteParticipant,
    kickParticipant
  } = useRealtime();

  const onRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (ex) {
      console.log(ex);
    }
  };

  const onCancelRequest = async () => {
    try {
      await cancelRequestPermission();
    } catch (ex) {
      console.log(ex);
    }
  };

  const onPromote = async (userId) => {
    try {
      await promoteParticipant(userId);
    } catch (ex) {
      console.log(ex);
    }
  };

  const onDemote = async (userId) => {
    try {
      await demoteParticipant(userId);
    } catch (ex) {
      console.log(ex);
    }
  };

  let permissionButton = null;
  let perm = getSelfParticipant();
  if (perm) {
    perm = perm.permission;
    if (perm === 'student') {
      permissionButton = (
        <Button onClick={onRequestPermission}>Request instructor permission</Button>
      );
    } else if (perm === 'requesting') {
      permissionButton = (
        <Button onClick={onCancelRequest}>Cancel permission request</Button>
      );
    }
  }

  const onKick = async (userId) => {
    try {
      await kickParticipant(userId);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <>
      {permissionButton}
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
            <Button variant="flat" onClick={() => onPromote(x.user.id)}>Promote</Button>
            <Button variant="flat">Token</Button>
            <Button variant="flat">{x.isMuted ? 'Unmute' : 'Mute'}</Button>
            <Button variant="danger" onClick={() => onKick(x.user.id)}>Kick</Button>
          </li>
        ))
      }
      </ul>
    </>
  );
}

export default ParticipantList;
