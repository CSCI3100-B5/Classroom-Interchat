import React, { useEffect } from 'react';
import {
  InputGroup, FormControl, Button, Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { BsX, BsReplyFill } from 'react-icons/bs';
import { IoSend, IoCreate } from 'react-icons/io5';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { useStates, bindState } from 'use-states';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import { useToast } from '../../../contexts/ToastProvider.jsx';
import './MessageCompose.scoped.css';

export default function MessageCompose({ onCreateQuiz }) {
  const { sendMessage } = useRealtime();
  const { data, getSelfParticipant } = useDataStore();
  const { toast } = useToast();

  const messageData = useStates({
    message: '',
    information: null
  });

  const onSend = async () => {
    if (!messageData.message) return;
    const msgText = messageData.message;
    messageData.message = '';
    console.log('Send message object: ', { message: msgText, information: messageData.information });
    try {
      await sendMessage(msgText, messageData.information);
    } catch (ex) {
      toast('error', 'Error when sending message', ex.error);
    }
    messageData.information = null;
  };


  useEffect(() => {
    const replyToMessage = data.replyToMessageId
      ? data.messages.find(x => x.id === data.replyToMessageId)
      : null;
    if (!replyToMessage || replyToMessage.content.isResolved) {
      data.replyToMessageId = null;
    }
  }, [data.replyToMessageId]);

  const replyToMessage = data.replyToMessageId
    ? data.messages.find(x => x.id === data.replyToMessageId)
    : null;

  if (data.classroomMeta.isMuted || getSelfParticipant()?.isMuted) {
    return (
      <div className="message-compose">
        <div className="compose-shadow d-flex justify-content-center align-items-center h-50px">
          <span className="text-muted text-center font-weight-light">
            {data.classroomMeta.isMuted ? 'The entire classroom is muted' : 'You are muted'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="message-compose">
      {replyToMessage !== null
        ? (
          <div className="compose-shadow">
            <div className="reply-box">
              <span className="reply-text btn">
                Replying to
                {' '}
                {data.participants.find(x => x.user.id === (replyToMessage.sender.id ?? replyToMessage.sender)).user.name}
                {'\'s Question'}
              </span>
              <span className="reply-content btn">
                {replyToMessage.content.content}
              </span>
              <OverlayTrigger
                placement="top"
                overlay={(
                  <Tooltip id="tooltip-cancel-reply">
                    Cancel reply
                  </Tooltip>
                  )}
              >
                <Button
                  variant="outline-danger"
                  onClick={() => { data.replyToMessageId = null; }}
                  className="reply-button"
                >
                  <BsX />
                </Button>
              </OverlayTrigger>
            </div>

            <InputGroup>
              <FormControl
                as="textarea"
                maxLength={5000}
                placeholder="Type your reply..."
                aria-label="Type your reply"
                className="reply-compose compose-box"
                onKeyPress={(e) => {
                  let isShift;
                  if (window.event) {
                    isShift = !!window.event.shiftKey;
                  } else {
                    isShift = !!e.shiftKey;
                  }
                  if (e.key === 'Enter' && !isShift) {
                    e.preventDefault();
                    messageData.information = { type: 'reply', qMessageId: data.replyToMessageId };
                    onSend();
                  }
                }}
                {...bindState(messageData.$message)}
              />
              <InputGroup.Append>
                <OverlayTrigger
                  placement="top"
                  {...(() => {
                    if (!messageData.message) return { show: false };
                    return {};
                  })()}
                  overlay={(
                    <Tooltip id="tooltip-reply">
                      Send reply
                    </Tooltip>
                  )}
                >
                  <Button
                    variant="outline-secondary"
                    className="reply-send"
                    onClick={() => { messageData.information = { type: 'reply', qMessageId: data.replyToMessageId }; onSend(); }}
                    disabled={!messageData.message}
                  >
                    <BsReplyFill className="button-icon" />
                  </Button>
                </OverlayTrigger>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )
        : (
          <InputGroup className="compose-shadow">
            <FormControl
              as="textarea"
              maxLength={5000}
              className="compose-box"
              placeholder="Type your message..."
              aria-label="Type your message"
              onKeyPress={(e) => {
                let isShift;
                if (window.event) {
                  isShift = !!window.event.shiftKey;
                } else {
                  isShift = !!e.shiftKey;
                }
                if (e.key === 'Enter' && !isShift) {
                  e.preventDefault();
                  messageData.information = { type: 'text' };
                  onSend();
                }
              }}
              {...bindState(messageData.$message)}
            />
            <InputGroup.Append>
              <OverlayTrigger
                placement="top"
                {...(() => {
                  if (!messageData.message) return { show: false };
                  return {};
                })()}
                overlay={(
                  <Tooltip id="tooltip-send">
                    Send
                  </Tooltip>
                  )}
              >
                <Button
                  variant="outline-secondary"
                  className="compose-button"
                  onClick={() => { messageData.information = { type: 'text' }; onSend(); }}
                  disabled={!messageData.message}
                >
                  <IoSend className="button-icon" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                {...(() => {
                  if (!messageData.message) return { show: false };
                  return {};
                })()}
                overlay={(
                  <Tooltip id="tooltip-send-as-question">
                    Send as question
                  </Tooltip>
                  )}
              >
                <Button
                  variant="outline-secondary"
                  className="compose-button"
                  onClick={() => { messageData.information = { type: 'question' }; onSend(); }}
                  disabled={!messageData.message}
                >
                  <RiQuestionnaireFill className="button-icon" />
                </Button>
              </OverlayTrigger>
              {getSelfParticipant()?.permission === 'instructor' ? (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="tooltip-create-quiz">
                      Create quiz
                    </Tooltip>
                  )}
                >
                  <Button
                    variant="outline-secondary"
                    onClick={onCreateQuiz}
                    className="compose-button"
                  >
                    <IoCreate className="button-icon" />
                  </Button>
                </OverlayTrigger>
            ) : null}
            </InputGroup.Append>
          </InputGroup>
        )}
    </div>
  );
}
