import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from 'use-states';
import MarkdownRender from '../MarkdownRender.jsx';

export default function SAQPrompt({ message }) {
  const data = useStates({
    answer: ''
  });
  const onSubmit = () => {
    // TODO: send answer to server
    console.log(data.answer);
  };
  return (
    <div>
      <div><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
      <InputGroup>
        <FormControl
          placeholder="Type your answer..."
          aria-label="Type your answer"
          {...bindState(data.$answer)}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={onSubmit}>Send</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}
