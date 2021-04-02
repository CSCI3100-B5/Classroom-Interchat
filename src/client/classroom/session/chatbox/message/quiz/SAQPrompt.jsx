import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default function SAQPrompt({ message }) {
  const [answer, setAnswer] = useState('');
  const onSubmit = () => {
    // TODO: send answer to server
  };
  return (
    <div>
      <p>{message.content.prompt}</p>
      <InputGroup>
        <FormControl
          placeholder="Type your answer..."
          aria-label="Type your answer"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={onSubmit}>Send</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}
