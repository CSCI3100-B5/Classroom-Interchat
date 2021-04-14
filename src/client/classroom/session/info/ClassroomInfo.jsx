import React from 'react';
import {
  Badge, Button, Card, ButtonGroup, ToggleButton, Container, Row, Col
} from 'react-bootstrap';
import { BsFillMicMuteFill, BsPeopleCircle, BsPeopleFill } from 'react-icons/bs';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { FaArrowCircleUp, FaQuestionCircle, FaFilter } from 'react-icons/fa';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import './ClassroomInfo.scoped.css';

function ClassroomInfo({ onShowParticipantList }) {
  const { data, getSelfParticipant } = useDataStore();
  const { leaveClassroom } = useRealtime();
  const { toast } = useToast();

  const onLeave = async () => {
    try {
      await leaveClassroom();
    } catch (ex) {
      toast('error', 'Error when leaving classroom', ex.error);
    }
  };

  const requestingParticipants = data.participants.filter(x => x.permission === 'requesting');
  const unresolvedQuestions = data.messages.filter(x => x.type === 'question' && !x.content.isResolved);
  const ongoingQuizzes = data.messages.filter(x => ['mcq', 'saq'].includes(x.type) && !x.content.closedAt);

  return (
    <div className="classroom-info vw-full">
      <Card
        bg="primary"
        text="light"
        className="classroom-info-card vw-full"
      >
        <Card.Body className="vw-full">
          <Card.Title className="card-title-fixed">
            <div className="classroom-card-title">
              <div className="classroom-name d-flex align-items-center">
                <span className="mr-2 classroom-name-text">{data.classroomMeta.name}</span>
                {data.classroomMeta.isMuted ? <BsFillMicMuteFill /> : null}
                {data.classroomMeta.closedAt ? <Badge variant="light">HISTORY VIEW</Badge> : null}
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
      {getSelfParticipant()
        && getSelfParticipant().permission !== 'student'
        && requestingParticipants.length ? (
          <Container className="status-banner">
            <Row>
              <Col>
                <FaArrowCircleUp className="mr-2" />
                {requestingParticipants.length}
                { ' '}
                requesting for instructor permission
              </Col>
            </Row>
          </Container>
        ) : null}
      {unresolvedQuestions.length ? (
        <Button
          as={Container}
          variant="outline-secondary"
          className={`${data.messageFilter === 'unresolved' ? 'active' : ''} status-banner clickable`}
          onClick={() => {
            if (data.messageFilter === 'unresolved') data.messageFilter = null;
            else data.messageFilter = 'unresolved';
          }}
        >
          {data.messageFilter === 'unresolved'
            ? <FaFilter className="mr-2" />
            : <FaQuestionCircle className="mr-2" />}
          {unresolvedQuestions.length}
          {' '}
          unresolved questions
        </Button>
      ) : null}
      {ongoingQuizzes.length ? (
        <Button
          as={Container}
          variant="outline-secondary"
          className={`${data.messageFilter === 'quiz' ? 'active' : ''} status-banner clickable`}
          onClick={() => {
            if (data.messageFilter === 'quiz') data.messageFilter = null;
            else data.messageFilter = 'quiz';
          }}
        >
          {data.messageFilter === 'quiz'
            ? <FaFilter className="mr-2" />
            : <RiQuestionnaireFill className="mr-2" />}
          {ongoingQuizzes.length}
          {' '}
          ongoing quizzes
        </Button>
      ) : null}
      {data.messageFilter && !['unresolved', 'quiz'].includes(data.messageFilter) ? (
        <Button
          as={Container}
          variant="outline-secondary"
          className={`${data.messageFilter ? 'active' : ''} status-banner clickable`}
          onClick={() => {
            if (data.messageFilter) data.messageFilter = null;
          }}
        >
          {data.messageFilter
            ? <FaFilter className="mr-2" />
            : <FaQuestionCircle className="mr-2" />}
          Viewing
          {' '}
          {data.messages.find(x => x.id === data.messageFilter).sender.name}
          {' '}
          &apos;s thread
        </Button>
      ) : null}
    </div>
  );
}

export default ClassroomInfo;
