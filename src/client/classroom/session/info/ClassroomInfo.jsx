import React from 'react';
import { Button } from 'react-bootstrap';
import ClassroomPropType from './ClassroomPropType.js';

function ClassroomInfo(props) {
  const { classroom } = props;
  return (
    <div>
      <p>{classroom.name}</p>
      <p>{classroom.createdBy.username}</p>
      <p>{classroom.participants.length}</p>
      <Button variant="danger">Leave</Button>
    </div>
  );
}

ClassroomInfo.propTypes = ClassroomPropType;

export default ClassroomInfo;
