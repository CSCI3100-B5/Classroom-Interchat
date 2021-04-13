import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { BsFillMicMuteFill, BsPeopleCircle, BsPeopleFill } from 'react-icons/bs';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import './ClassroomInfo.scoped.css';

function ClassroomInfo({ onShowParticipantList }) {
  const { data } = useDataStore();
  const { leaveClassroom } = useRealtime();
  const { toast } = useToast();

  const onLeave = async () => {
    try {
      await leaveClassroom();
    } catch (ex) {
      toast('error', 'Error when leaving classroom', ex.error);
    }
  };

  return (
    <div className="classroom-info">
      <Card
        bg="primary"
        text="light"
        className="classroom-info-card"
      >
        <Card.Body>
          <Card.Title>
            <div className="classroom-card-title">
              <div className="classroom-name d-flex align-items-center">
                <span className="mr-2">{data.classroomMeta.name}</span>
                {data.classroomMeta.isMuted ? <BsFillMicMuteFill /> : null}
              </div>
              <div className="account-name">
                <BsPeopleCircle className="mr-2" />
                <span>{data.user.name}</span>
              </div>
            </div>
          </Card.Title>
          <Card.Text as="div">
            <div className="classroom-card-body">
              <Button variant="flat" className="participant-count" onClick={onShowParticipantList}>
                <BsPeopleFill className="mr-2" />
                {data.participants.length}
                {' '}
                participants
              </Button>
              <Button
                variant="danger"
                onClick={onLeave}
                className="leave-button"
              >
                Leave
              </Button>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ClassroomInfo;
