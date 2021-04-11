import React from 'react';
import { Button, Card, Accordion } from 'react-bootstrap';
import { BsPeopleCircle, BsPeopleFill } from 'react-icons/bs';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import ParticipantList from './ParticipantList.jsx';
import './ClassroomInfo.scoped.css';

function ClassroomInfo() {
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
              <div className="classroom-name">{data.classroomMeta.name}</div>
              <div className="account-name">
                <BsPeopleCircle className="mr-2" />
                <span>{data.user.name}</span>
              </div>
            </div>
          </Card.Title>
          <Card.Text as="div">
            <div className="classroom-card-body">
              <div className="participant-count">
                <BsPeopleFill className="mr-2" />
                {data.participants.length}
                {' '}
                participants
              </div>
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

      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Participant List
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <ParticipantList />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default ClassroomInfo;
