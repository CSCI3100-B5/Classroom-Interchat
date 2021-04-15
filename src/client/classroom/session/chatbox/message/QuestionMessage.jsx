import React from 'react';
import {
  Badge, Button, ButtonGroup, ToggleButton, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { FaCheckCircle, FaFilter } from 'react-icons/fa';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../../contexts/ToastProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';
import './QuestionMessage.scoped.css';

export default function QuestionMessage({ message }) {
  const { resolveQuestion } = useRealtime();
  const { data } = useDataStore();
  const { toast } = useToast();
  const replies = data.messages.filter(x => x.type === 'reply' && x.content.replyTo === message.id);

  const onResolveQuestion = async () => {
    try {
      await resolveQuestion(message.id);
    } catch (ex) {
      toast('error', 'Error when resolving question', ex.error);
    }
  };

  let resolveButton = null;
  if (!message.content.isResolved) {
    resolveButton = message.sender.id === data.user.id
      ? (
        <Button
          variant="outline-primary"
          className="control-button"
          onClick={onResolveQuestion}
        >
          Resolve Question
        </Button>
      )
      : null;
  }

  return (
    <div className="question-container">

      <div className="question-box">
        <OverlayTrigger
          placement="top"
          overlay={(
            <Tooltip id="tooltip-unresolved-question">
              {message.content.isResolved
                ? 'Resolved question'
                : 'Unresolved question'}
            </Tooltip>
          )}
        >
          {message.content.isResolved
            ? <FaCheckCircle className="icon-large message-icon" />
            : <BsFillQuestionCircleFill className="icon-large message-icon" />}
        </OverlayTrigger>
        <div className="message-box">
          <MarkdownRender>{message.content.content}</MarkdownRender>
        </div>
      </div>

      <div className="question-controls">
        {message.content.isResolved
          ? <Badge>RESOLVED</Badge>
          : null}
        {resolveButton}
        {message.content.isResolved ? null : (
          <Button
            variant="outline-primary"
            className="control-button"
            onClick={() => { data.replyToMessageId = message.id; }}
          >
            Reply
          </Button>
        )}
        {replies.length > 0
          ? (
            <ButtonGroup toggle>
              <ToggleButton
                type="checkbox"
                variant="outline-info"
                className="control-button"
                checked={data.messageFilter === message.id}
                value="1"
                onChange={() => {
                  if (data.messageFilter === message.id) data.messageFilter = null;
                  else data.messageFilter = message.id;
                }}
              >
                <FaFilter className="mr-2" />
                {replies.length === 1 ? '1 reply' : `${replies.length} replies`}
              </ToggleButton>
            </ButtonGroup>
          ) : (<span className="text-small text-muted">No replies</span>)}
      </div>

    </div>
  );
}
