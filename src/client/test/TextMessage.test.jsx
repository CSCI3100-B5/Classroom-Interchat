import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'mocha';
import React from 'react';
import TextMessage from '../classroom/session/chatbox/message/TextMessage.jsx';

describe('TextMessage Component', () => {
  it('Renders a plain text message', () => {
    render(<TextMessage message={{ content: 'hello world' }} />);
    expect(screen.queryByText('hello world')).to.not.be.equal(null);
  });
});
