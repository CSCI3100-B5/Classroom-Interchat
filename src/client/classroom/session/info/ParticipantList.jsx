import React from 'react';
import ClassroomPropType from './ClassroomPropType.js';

function ParticipantList(props) {
  const { classroom } = props;
  return (
    <ul>
      {
        classroom.participants.map(x => (
          <li key={x.username}>
            {x.username}
          </li>
        ))
      }
    </ul>
  );
}

ParticipantList.propTypes = ClassroomPropType;

export default ParticipantList;
