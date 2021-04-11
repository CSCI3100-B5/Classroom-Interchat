import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from 'use-states';
import MarkdownRender from '../MarkdownRender.jsx';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../../../contexts/ToastProvider.jsx';

export default function SAQPrompt({ message }) {
  const { ansSAQuiz } = useRealtime();
  const data = useStates({
    answer: ''
  });
  const { toast } = useToast();
  const onSubmit = async () => {
    // TODO: send answer to server
    if (!data.answer) return;
    console.log('SAQ answer object', data.answer);
    try {
      await ansSAQuiz(data.answer, message.id);
    } catch (ex) {
      toast('error', 'Error when answering SAQ', ex.error);
    }
  };
  return (
    <div>
      <div><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
      <InputGroup>
        <FormControl
          placeholder="Type your answer..."
          aria-label="Type your answer"
          disabled={!!message.content.closedAt}
          {...bindState(data.$answer)}
        />
        <InputGroup.Append>
          <Button
            variant="outline-secondary"
            onClick={onSubmit}
            disabled={!!message.content.closedAt}
          >
            Send
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}
