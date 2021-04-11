import React, { useState } from 'react';
import { Modal, Button, FormControl } from 'react-bootstrap';
import { bindState } from 'use-states';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';

export default function TokenAwarder({ userIds, onClose }) {
  const [note, setNote] = useState(null);
  const { awardToken } = useRealtime();
  const onAwardToken = async () => {
    try {
      await awardToken(userIds, note);
      onClose();
    } catch (ex) {
      // TODO: toast on failure
    }
  };
  return (
    <Modal show={!!userIds} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Token Award</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          You are awarding a token to
          {' '}
          {userIds.length}
          {' '}
          participants
        </p>
        <FormControl
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
