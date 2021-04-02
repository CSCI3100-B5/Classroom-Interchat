import React from 'react';
import { Button, Card, Accordion } from 'react-bootstrap';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import ParticipantList from './ParticipantList.jsx';

function ClassroomInfo() {
  const { classroomMeta, participants, user } = useDataStore();
  return (
    <div>
      <p>{classroomMeta.name}</p>
      <p>{user.name}</p>
      <p>
        {participants.length}
        {' '}
        participants
      </p>
      <Button variant="danger">Leave</Button>
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
