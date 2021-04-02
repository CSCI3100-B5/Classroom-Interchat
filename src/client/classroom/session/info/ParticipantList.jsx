import React from 'react';
import ClassroomPropType from './ClassroomPropType.js';

// A list of participants. The layout of this component is undecided.
// It may become a page, a pop-up in the classroom session page,
// or just be part of the classroom session page.

function ParticipantList(props) {
  const { classroom } = props;
  return (
    <ul>
      {
        classroom.participants.map(x => (
          <li key={x.name}>
            {x.name}
          </li>
        ))
      }
    </ul>
  );
}

ParticipantList.propTypes = ClassroomPropType;

export default ParticipantList;
