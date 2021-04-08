import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../../contexts/RealtimeProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';


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

  return (
    <div>
      <Badge>{message.content.isResolved ? 'RESOLVED' : 'QUESTION'}</Badge>
      {resolveButton}
      <div><MarkdownRender>{message.content.content}</MarkdownRender></div>
      <Button onClick={() => { data.replyToMessage = message; }}>
        Reply
      </Button>
      {replies.length > 0
        ? (<Button>{replies.length === 1 ? '1 reply' : `${replies.length} replies`}</Button>)
        : (<p className="text-muted">Send a reply</p>)}
    </div>
  );
}
