/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
// user-event allows us to fake inputs like typing and clicking buttons
import userEvent from '@testing-library/user-event';
// sinon creates fake functions
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

// import our component to be tested
import LaunchApp from '../account/LaunchApp.jsx';

// This is to fake the react router context
// which makes the component believe it is living in the /account page
// and allows the component to browse to another page
import { renderWithRouter } from './test-utils.js';

describe('LaunchApp Component', function () {
  it('click on Launch', async function () {
    renderWithRouter(<LaunchApp />, { route: '/account' });

    expect(await screen.findByText('Launch')).to.not.be.equal(null);

    userEvent.click(screen.getByRole('link', { name: /Launch/i }));

    expect(window.location.pathname).to.be.equal('/classroom');
  });
});
