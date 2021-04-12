import {
  Button, Badge, Overlay, Tooltip, Row, Col, Container
} from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import copy from 'copy-text-to-clipboard';
import { BsChevronCompactUp } from 'react-icons/bs';
import { RiSendPlane2Line, RiWifiOffLine } from 'react-icons/ri';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import env from '../../../environment.js';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import TokenAwarder from '../TokenAwarder.jsx';
import './ParticipantList.scoped.css';

export default function ParticipantList({ onCloseParticipantList }) {
  const { data, getSelfParticipant } = useDataStore();
  const {
    requestPermission,
    cancelRequestPermission,
    promoteParticipant,
    demoteParticipant,
    kickParticipant,
    toggleMuteParticipant,
    toggleGlobalMute
  } = useRealtime();
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState(null);

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

  const onDemote = async (userId) => {
    try {
      await demoteParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when demoting a participant', ex.error);
    }
  };

  const onToggleMute = async (userId) => {
    try {
      await toggleMuteParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when toggling mute on a participant', ex.error);
    }
  };

  const onToggleGlobalMute = async () => {
    try {
      await toggleGlobalMute();
    } catch (ex) {
      toast('error', 'Error when toggling mute on the entire classroom', ex.error);
    }
  };

  const onKick = async (userId) => {
    try {
      await kickParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when kicking a participant', ex.error);
    }
  };

  let isHost = false;
  let isInstructor = false;
  if (data.user.id === data.classroomMeta.host.id) {
    isHost = true;
  }

  let permissionButton = null;
  let perm = getSelfParticipant();
  if (perm) {
    perm = perm.permission;
    if (perm === 'student') {
      permissionButton = (
        <Button className="w-full-btn" onClick={onRequestPermission}>Request instructor permission</Button>
      );
    } else if (perm === 'requesting') {
      permissionButton = (
        <Button variant="secondary" className="w-full-btn" onClick={onCancelRequest}>Cancel permission request</Button>
      );
    } else {
      isInstructor = true;
    }
  }

  return (

    <div className="d-flex flex-column justify-content-between">
      <Container className="mb-4">
        <Row className="justify-content-center">
          {permissionButton ? (
            <Col sm={6}>
              {permissionButton}
            </Col>
          ) : null}
          <Col sm={6}>
            <Button
              className="w-full-btn"
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
          </Col>
          {isInstructor ? (
            <Col sm={6}>
              <Button onClick={onToggleGlobalMute}>{data.classroomMeta.isMuted ? 'Unmute entire classroom' : 'Mute entire classroom'}</Button>
            </Col>
          ) : null}
        </Row>
      </Container>
      <TokenAwarder userIds={selectedUsers} onClose={() => setSelectedUsers(null)} />
      <div className="flex-grow-1 p-2 participant-container">
        {
        data.participants.map(x => (
          <div key={x.user.id} className="participant-box d-flex justify-content-between align-items-center">
            <span>{x.user.name}</span>
            {(() => {
              if (x.user.id === data.classroomMeta.host.id) return (<Badge variant="primary">HOST</Badge>);
              if (x.permission === 'instructor') return (<Badge variant="success">INSTRUCTOR</Badge>);
              if (x.permission === 'requesting') return (<Badge variant="secondary">REQUESTING</Badge>);
              return null;
            })()}
            {x.isOnline ? null : (<RiWifiOffLine />)}
            {x.isMuted ? (<Badge>MUTED</Badge>) : null}
            <div className="flex-grow-1" />
            {isInstructor
              ? (
                <>
                  {x.permission !== 'instructor'
                    ? <Button variant="flat" onClick={() => onPromote(x.user.id)}>Promote</Button>
                    : null}
                  {(isHost && x.user.id !== data.user.id) ? (
                    <Button variant="flat" onClick={() => onDemote(x.user.id)}>Deomote</Button>
                  ) : null}
                  <Button variant="flat" onClick={() => setSelectedUsers([x.user.id])}>Token</Button>
                  <Button variant="flat" onClick={() => onToggleMute(x.user.id)}>{x.isMuted ? 'Unmute' : 'Mute'}</Button>
                  {(isHost && x.user.id !== data.user.id) || x.permission === 'student'
                    ? <Button variant="danger" onClick={() => onKick(x.user.id)}>Kick</Button>
                    : null}

                </>
              ) : null}
          </div>
        ))
      }
      </div>
      <Button className="close-list" variant="flat" onClick={onCloseParticipantList}><BsChevronCompactUp /></Button>
    </div>
  );
}
