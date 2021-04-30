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

// import the component to be tested
import JoinClassroom from '../classroom/JoinClassroom.jsx';

// import contexts to be faked
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
import * as SocketContext from '../contexts/SocketProvider.jsx';
import { renderWithRouter } from './test-utils.js';

// all tests related to JoinClassroom
describe('JoinClassroom Component', function () {
  // all the faked functions
  let fakeToast;
  let fakePeekClassroom;
  let fakeJoinClassroom;
  let fakelogout;
  let fakesocket;

  // set up fakes before each test
  beforeEach(function () {
    // fake the peek classroom function to only succeed if given a specific
    // classroom id
    // normally this function should send a socket event to server
    fakePeekClassroom = sinon.fake((classroomId) => {
      if (classroomId === '606eaf55a406552de05d996a') {
        return new Promise((resolve) => {
          resolve({
            id: '606eaf55a406552de05d996a'
          });
        });
      }
      return new Promise((resolve, reject) => {
        reject({ error: 'test error' });
      });
    });

    // fake the join classroom function
    // similar case as above
    fakeJoinClassroom = sinon.fake((classroomId) => {
      if (classroomId === '606eaf55a406552de05d996a') {
        return new Promise(resolve => resolve());
      }
      return new Promise((resolve, reject) => {
        reject({ error: 'test error' });
      });
    });

    fakeToast = sinon.spy();

    fakelogout = sinon.fake(() => new Promise((resolve) => {
      resolve({ success: true, response: { } });
    }));

    // fakesocket = ;

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      peekClassroom: fakePeekClassroom,
      joinClassroom: fakeJoinClassroom
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: { rememberMe: true } }));
    sinon.replace(ApiContext, 'useApi', () => ({ logout: fakelogout }));
  });

  // remember to restore the faked function after each test
  afterEach(function () {
    sinon.restore();
  });

  // test that loading an invite link in browser causes the classroom ID textbox to be auto-filled
  it('Auto-fill classroom ID for invite links', function () {
    renderWithRouter(<JoinClassroom />, { route: '/classroom/join?id=testclassroomid1234' });

    expect(screen.getByRole('textbox', { name: /classroom Id/i }).value).to.equal('testclassroomid1234');
  });

  // load a valid invite link, then click join
  it('Join classroom through valid invite link', async function () {
    renderWithRouter(<JoinClassroom />, { route: '/classroom/join?id=606eaf55a406552de05d996a' });

    expect(screen.getByRole('textbox', { name: /classroom Id/i }).value).to.equal('606eaf55a406552de05d996a');

    userEvent.click(screen.getByRole('button', { name: /join classroom/i }));

    await new Promise(resolve => setTimeout(resolve, 10));
    sinon.assert.calledOnce(fakeJoinClassroom);
  });

  // load an invalid invite link, then click join
  it('Join classroom through invalid invite link', async function () {
    renderWithRouter(<JoinClassroom />, { route: '/classroom/join?id=606eaf55a406552de05d996b' });

    expect(screen.getByRole('textbox', { name: /classroom Id/i }).value).to.equal('606eaf55a406552de05d996b');

    userEvent.click(screen.getByRole('button', { name: /join classroom/i }));

    await new Promise(resolve => setTimeout(resolve, 10));
    sinon.assert.calledOnce(fakeJoinClassroom);

    // since fakeJoinClassroom returns a failure, we expect JoinClassroom
    // to display that error to the user by calling toast
    sinon.assert.calledOnce(fakeToast);
    sinon.assert.calledWith(fakeToast, 'error');
  });
});
