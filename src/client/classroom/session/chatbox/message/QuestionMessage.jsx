import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';


export default function QuestionMessage({ message }) {
  const { data } = useDataStore();
  const replies = data.messages.filter(x => x.type === 'reply' && x.content.replyTo === message.id);
  return (
    <div>
      <Badge>{message.content.isResolved ? 'RESOLVED' : 'QUESTION'}</Badge>
      <p>{message.content.content}</p>
      <Button>Reply</Button>
      {replies.length > 0
        ? (<Button>{replies.length === 1 ? '1 reply' : `${replies.length} replies`}</Button>)
        : (<p className="text-muted">Send a reply</p>)}
    </div>
  );
}
