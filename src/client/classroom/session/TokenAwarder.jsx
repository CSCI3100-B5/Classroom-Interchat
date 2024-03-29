import React, { useState, useEffect } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import { bindState } from 'use-states';
import { useRealtime } from '../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../contexts/ToastProvider.jsx';

/**
 * The dialog box that pops up when the user wants to award tokens
 * Allows the user to input an optional note for the tokens
 */
export default function TokenAwarder({ userIds, onClose }) {
  const [note, setNote] = useState('');
  const { awardToken } = useRealtime();
  const { toast } = useToast();

  // send the request to server
  const onAwardToken = async () => {
    try {
      await awardToken(userIds, note);
      toast('info', 'Token award', 'Tokens awarded');
      onClose();
    } catch (ex) {
      toast('error', 'Error when awarding tokens', ex.error);
    }
  };

  // if the dialog is opened without user ids, then close it and send a toast
  // this happens when the user wants to award a token to those who answered a
  // quiz correctly but there are none
  useEffect(() => {
    if (userIds && userIds.length === 0) {
      toast('error', 'Error when awarding tokens', 'There is no one to award a token to');
      onClose();
    }
  }, [userIds]);

  return (
    <Modal show={!!userIds} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Token Award</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          You are awarding a token to
          {' '}
          {userIds?.length}
          {' '}
          {userIds?.length > 1 ? 'participants' : 'participant'}
        </p>
        <FormControl
          maxLength={200}
          placeholder="Specify a note for this token (optional)"
          aria-label="Optionally specify a note for this token"
          {...bindState(note, setNote)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onAwardToken}>
          Award Token
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
