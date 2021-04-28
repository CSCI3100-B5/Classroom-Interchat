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
import LaunchApp from '../account/LaunchApp.jsx';

import { renderWithRouter } from './test-utils.js';

describe('LaunchApp Component', function () {
  // before each test, set up the fake contexts
  beforeEach(function () {
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('click on Launch', function () {
    renderWithRouter(<LaunchApp />, { route: '/somePath' });

    expect(screen.findByText('Launch')).to.not.be.equal(null);

    userEvent.click(screen.getByRole('link', { name: /Launch/i }));
  });
});
