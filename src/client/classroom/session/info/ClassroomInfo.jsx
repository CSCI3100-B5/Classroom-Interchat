import React from 'react';
import { Button, Card, Accordion } from 'react-bootstrap';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import ParticipantList from './ParticipantList.jsx';

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
    <div>
      <p>{data.classroomMeta.name}</p>
      <p>{data.user.name}</p>
      <p>
        {data.participants.length}
        {' '}
        participants
      </p>
      <Button variant="danger" onClick={onLeave}>Leave</Button>
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
