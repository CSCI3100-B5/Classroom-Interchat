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
import NotFound from '../not-found/NotFound.jsx';

import { renderWithRouter } from './test-utils.js';

describe('NotFound Component', function () {
  // before each test, set up the fake contexts
  beforeEach(function () {
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders NotFound', function () {
    renderWithRouter(<NotFound />, { route: '/somePath' });
    expect(screen.findByText('Page not found')).to.not.be.equal(null);
    expect(screen.findByText('Go to home page')).to.not.be.equal(null);

    userEvent.click(screen.getByRole('button', { name: /Go back/i }));
  });
});
