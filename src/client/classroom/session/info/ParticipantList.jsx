import {
  Button, Badge, Overlay, Tooltip, Row, Col, Container
} from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import {
  BsChevronCompactUp, BsFillMicMuteFill, BsFillMicFill, BsArrowUp, BsArrowDown
} from 'react-icons/bs';
import { FaAward, FaBan } from 'react-icons/fa';
import { RiWifiOffLine } from 'react-icons/ri';
import copy from '../../../copy.js';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import env from '../../../environment.js';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import TokenAwarder from '../TokenAwarder.jsx';
import './ParticipantList.scoped.css';

/**
 * The list of participants with control buttons
 * Classroom-wide actions are also placed here
 */
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

  // Send request to server
  const onRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (ex) {
      toast('error', 'Error when requsting for permission', ex.error);
    }
  };

  // Send request to server
  const onCancelRequest = async () => {
    try {
      await cancelRequestPermission();
    } catch (ex) {
      toast('error', 'Error when canceling request', ex.error);
    }
  };

  // Send request to server
  const onPromote = async (userId) => {
    try {
      await promoteParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when promoting a participant', ex.error);
    }
  };

  // Send request to server
  const onDemote = async (userId) => {
    try {
      await demoteParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when demoting a participant', ex.error);
    }
  };

  // Send request to server
  const onToggleMute = async (userId) => {
    try {
      await toggleMuteParticipant(userId);
    } catch (ex) {
      toast('error', 'Error when toggling mute on a participant', ex.error);
    }
  };

  // Send request to server
  const onToggleGlobalMute = async () => {
    try {
      await toggleGlobalMute();
    } catch (ex) {
      toast('error', 'Error when toggling mute on the entire classroom', ex.error);
    }
  };

  // Send request to server
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
    <div className="d-flex flex-column justify-content-between mt-2">
      <Container className="mb-2">
        <Row className="justify-content-center">
          {/* The classroom-wide actions */}
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
              <Button
                className="w-full-btn"
                onClick={onToggleGlobalMute}
              >
                {data.classroomMeta.isMuted ? 'Unmute entire classroom' : 'Mute entire classroom'}
              </Button>
            </Col>
          ) : null}
        </Row>
      </Container>
      <TokenAwarder userIds={selectedUsers} onClose={() => setSelectedUsers(null)} />
      <div className="flex-grow-1 p-2 participant-container">
        <Container>
          {/* The list of participants */}
          {
            data.participants.map(x => (
              <div key={x.user.id} className="participant-box d-flex justify-content-end align-items-center flex-wrap ">
                <span className={`${!x.isOnline || x.isMuted ? 'text-muted' : ''} max-w-100`}>{x.user.name}</span>
                {(() => {
                  if (x.user.id === data.classroomMeta.host.id) return (<Badge variant="primary">HOST</Badge>);
                  if (x.permission === 'instructor') return (<Badge variant="success">INSTRUCTOR</Badge>);
                  if (x.permission === 'requesting') return (<Badge variant="secondary">REQUESTING</Badge>);
                  return null;
                })()}
                {x.isOnline ? null : (<RiWifiOffLine />)}
                {x.isMuted ? (<BsFillMicMuteFill className="text-danger" />) : null}
                {(() => {
                  const unresolved = data.messages
                    .filter(m => (m.sender?.id ?? m.sender) === (x.user.id ?? x.user)
                    && m.type === 'question'
                    && !m.content.isResolved);
                  if (unresolved.length > 0) {
                    return (
                      <Badge variant="primary">
                        QUESTION x
                        {unresolved.length}
                      </Badge>
                    );
                  }
                  return null;
                })()}
                <div className="flex-grow-1" />
                {/* The buttons to control this participant */}
                {isInstructor
                  ? (
                    <>
                      {x.permission !== 'instructor'
                        ? (
                          <Button variant="flat" className="participant-ctrl-btn" onClick={() => onPromote(x.user.id)}>
                            <BsArrowUp className="mr-1" />
                            <span className="d-none d-md-inline">Promote</span>
                          </Button>
                        )
                        : null}
                      {(isHost && x.user.id !== data.user.id) ? (
                        <Button variant="flat" className="participant-ctrl-btn" onClick={() => onDemote(x.user.id)}>
                          <BsArrowDown className="mr-1" />
                          <span className="d-none d-md-inline">Demote</span>
                        </Button>
                      ) : null}
                      <Button variant="flat" className="participant-ctrl-btn" onClick={() => setSelectedUsers([x.user.id])}>
                        <FaAward className="mr-1" />
                        <span className="d-none d-md-inline">Token</span>
                      </Button>
                      <Button variant="flat" className="participant-ctrl-btn" onClick={() => onToggleMute(x.user.id)}>
                        {x.isMuted ? (
                          <>
                            <BsFillMicFill className="mr-1" />
                            <span className="d-none d-md-inline">Unmute</span>
                          </>
                        ) : (
                          <>
                            <BsFillMicMuteFill className="mr-1" />
                            <span className="d-none d-md-inline">Mute</span>
                          </>
                        )}
                      </Button>
                      {(isHost && x.user.id !== data.user.id) || x.permission === 'student'
                        ? (
                          <Button variant="danger" className="participant-ctrl-btn" onClick={() => onKick(x.user.id)}>
                            <FaBan className="mr-1" />
                            <span className="d-none d-md-inline">Kick</span>
                          </Button>
                        )
                        : null}
                    </>
                  ) : null}
              </div>
            ))
          }
        </Container>
      </div>
      <Button className="close-list" variant="flat" onClick={onCloseParticipantList}><BsChevronCompactUp /></Button>
    </div>
  );
}
