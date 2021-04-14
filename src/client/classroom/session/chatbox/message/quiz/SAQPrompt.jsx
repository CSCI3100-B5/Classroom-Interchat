import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from 'use-states';
import MarkdownRender from '../MarkdownRender.jsx';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../../../contexts/ToastProvider.jsx';

export default function SAQPrompt({ message }) {
  const { ansSAQuiz } = useRealtime();
  const { toast } = useToast();
  const data = useStates({
    answer: ''
  });

  const onSubmit = async () => {
    if (!data.answer) return;
    console.log('SAQ answer object', data.answer);
    try {
      await ansSAQuiz(data.answer, message.id);
      toast('info', 'Short answer quiz', 'Answer sent');
    } catch (ex) {
      toast('error', 'Error when answering SAQ', ex.error);
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="m-2"><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
      <InputGroup className="mb-2">
        <FormControl
          placeholder="Type your answer..."
          aria-label="Type your answer"
          maxLength={200}
          disabled={!!message.content.closedAt}
          {...bindState(data.$answer)}
        />
        <InputGroup.Append>
          <Button
            variant="outline-light"
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
