import {
  Button, Badge, Overlay, Tooltip
} from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import copy from 'copy-text-to-clipboard';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import env from '../../../environment.js';
import { useToast } from '../../../contexts/ToastProvider.jsx';


function ParticipantList() {
  const { data, getSelfParticipant } = useDataStore();
  const { requestPermission, cancelRequestPermission, promoteParticipant } = useRealtime();
  const { toast } = useToast();

  const tooltipTarget = useRef(null);
  const [show, setShow] = useState(false);

  const onRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (ex) {
      toast('error', 'Error when requsting for permission', ex.error);
    }
  };

  const onCancelRequest = async () => {
    try {
      await cancelRequestPermission();
    } catch (ex) {
      toast('error', 'Error when canceling request', ex.error);
    }
  };

  const onPromote = async (userId) => {
    try {
      await promoteParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when promoting a participant', ex.error);
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

  return (
    <>
      {permissionButton}
      <Button
        ref={tooltipTarget}
        onClick={() => {
          copy(`${env.hostUrl}classroom/join?id=${data.classroomMeta.id}`);
          setShow(true);
          setTimeout(() => setShow(false), 2000);
        }}
      >
        Copy invite link
      </Button>
      <Overlay target={tooltipTarget.current} show={show} placement="bottom">
        {props => (
          <Tooltip {...props}>
            Link copied!
          </Tooltip>
        )}
      </Overlay>
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
            <Button variant="danger">Kick</Button>
          </li>
        ))
      }
      </ul>
    </>
  );
}

export default ParticipantList;
