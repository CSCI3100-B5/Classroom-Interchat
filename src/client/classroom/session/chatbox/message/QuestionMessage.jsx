import React from 'react';
import {
  Badge, Button, ButtonGroup, ToggleButton
} from 'react-bootstrap';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../../contexts/RealtimeProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';
import './QuestionMessage.scoped.css';

export default function QuestionMessage({ message }) {
  const { resolveQuestion } = useRealtime();
  const { data } = useDataStore();
  const replies = data.messages.filter(x => x.type === 'reply' && x.content.replyTo === message.id);

  const onResolveQuestion = () => {
    resolveQuestion(message.id);
  };

  let resolveButton = null;
  if (!message.content.isResolved) {
    resolveButton = message.sender === data.user.id
      ? (<Button onClick={onResolveQuestion}>Resolve Question</Button>)
      : (<p>not resolved</p>);
  }

  // not tested
  const onViewReply = () => {
    data.messageFilter = message.id;
  };

  return (
    <div className="relativeBox">
      <p className="timeRight">
        {' '}
        <p>
          by sender at
          {' '}
          {message.createdAt.toString()}
        </p>

      </p>
      <p className="iconRight"><BsFillQuestionCircleFill /></p>
      <p className="senderRight">
        <Badge>{message.content.isResolved ? 'RESOLVED' : 'QUESTION'}</Badge>
      </p>
      <p className="resolveButtonRight">
        {resolveButton}
      </p>
      <div className="myMessageRight">
        <MarkdownRender>{message.content.content}</MarkdownRender>
      </div>
      <div className="replybuttonRight">
        {message.content.isResolved ? null : (
          <Button onClick={() => { data.replyToMessageId = message.id; }}>
            Reply
          </Button>
        )}
      </div>
      {replies.length > 0
        ? (
          <ButtonGroup className="replyNoRight">
            <p>
              <ToggleButton
                type="checkbox"
                variant="info"
                checked={data.messageFilter === message.id}
                value="1"
                onChange={() => {
                  if (data.messageFilter === message.id) data.messageFilter = null;
                  else data.messageFilter = message.id;
                }}
              >
                {replies.length === 1 ? '1 reply' : `${replies.length} replies`}
              </ToggleButton>
            </p>
          </ButtonGroup>
        ) : (<p className="replyRight">Send a reply</p>)}
    </div>
  );
}
