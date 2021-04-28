/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

// import our component to be tested
import Landing from '../landing/Landing.jsx';

import { renderWithRouter } from './test-utils.js';

describe('Landing Component', function () {
  // before each test, set up the fake contexts
  beforeEach(function () {
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders Landing', function () {
    renderWithRouter(<Landing />, { route: '/somePath' });
    expect(screen.findByText('Classroom Interchat')).to.not.be.equal(null);
    expect(screen.findByText('Log in')).to.not.be.equal(null);
    expect(screen.findByText('Sign up')).to.not.be.equal(null);

    userEvent.click(screen.getByRole('link', { name: /Log in/i }));
    userEvent.click(screen.getByRole('link', { name: /Sign up/i }));
  });
});
