/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';
import { assert } from 'joi';
import JoinClassroom from '../classroom/JoinClassroom.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';
import { renderWithRouter } from './test-utils.js';

describe('JoinClassroom Component', function () {
  beforeEach(function () {
    const fakePeekClassroom = sinon.fake((classroomId) => {
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
    const fakeJoinClassroom = sinon.fake((classroomId) => {
      if (classroomId === '606eaf55a406552de05d996a') {
        return new Promise(resolve => resolve());
      }
      return new Promise((resolve, reject) => {
        reject({ error: 'test error' });
      });
    });
    const fakeToast = sinon.spy();
    this.currentTest.fakePeekClassroom = fakePeekClassroom;
    this.currentTest.fakeJoinClassroom = fakeJoinClassroom;
    this.currentTest.fakeToast = fakeToast;
    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      peekClassroom: fakePeekClassroom,
      joinClassroom: fakeJoinClassroom
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: { rememberMe: true } }));
  });

  afterEach(function () {
    sinon.restore();
  });

  it('Auto-fill classroom ID for invite links', function () {
    renderWithRouter(<JoinClassroom />, { route: '/classroom/join?id=testclassroomid1234' });

    expect(screen.getByRole('textbox', { name: /classroom Id/i }).value).to.equal('testclassroomid1234');
  });

  it('Join classroom through valid invite link', async function () {
    renderWithRouter(<JoinClassroom />, { route: '/classroom/join?id=606eaf55a406552de05d996a' });

    expect(screen.getByRole('textbox', { name: /classroom Id/i }).value).to.equal('606eaf55a406552de05d996a');

    userEvent.click(screen.getByRole('button', { name: /join classroom/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    sinon.assert.calledOnce(this.test.fakeJoinClassroom);
  });

  it('Join classroom through invalid invite link', async function () {
    renderWithRouter(<JoinClassroom />, { route: '/classroom/join?id=606eaf55a406552de05d996b' });

    expect(screen.getByRole('textbox', { name: /classroom Id/i }).value).to.equal('606eaf55a406552de05d996b');

    userEvent.click(screen.getByRole('button', { name: /join classroom/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    sinon.assert.calledOnce(this.test.fakeJoinClassroom);
    sinon.assert.calledOnce(this.test.fakeToast);
    sinon.assert.calledWith(this.test.fakeToast, 'error');
  });
});
