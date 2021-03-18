import React from 'react';
import { Button, Card, Accordion } from 'react-bootstrap';
import ClassroomPropType from './ClassroomPropType.js';
import ParticipantList from './ParticipantList.jsx';

// Information of the classroom, shown at the top of the classroom
// session page. The participant list is opened from here.

function ClassroomInfo(props) {
  const { classroom } = props;
  return (
    <div>
      <p>{classroom.name}</p>
      <p>{classroom.createdBy.username}</p>
      <p>{classroom.participants.length}</p>
      <Button variant="danger">Leave</Button>
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Participant List
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <ParticipantList classroom={classroom} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

ClassroomInfo.propTypes = ClassroomPropType;

export default ClassroomInfo;
