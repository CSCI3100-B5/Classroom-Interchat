import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useStates } from 'use-states';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';


export default function ManageTokens() {
  const localData = useStates({
    sentTokens: [],
    receivedTokens: []
  });

  const { getUserTokens, setTokenFalse } = useApi();
  const { data } = useDataStore();
  const { toast } = useToast();

  useEffect(() => {
    // TODO: call API and populate token list
    (async () => {
      const result = await getUserTokens(data.user.id);
      if (result.success) {
        localData.sentTokens = result.response.data.created;
        localData.receivedTokens = result.response.data.received;
      } else {
        toast('error', 'Error when fetching tokens', result.response.data.message);
      }
    })();
  }, []);

  const invalidateToken = async (token) => {
    const result = await setTokenFalse(token.id);
    if (result.success) {
      const tokens = [...localData.sentTokens];
      tokens[tokens.findIndex(x => x.id === result.response.data.id)] = result.response.data;
      localData.sentTokens = tokens;
      const tokens2 = [...localData.receivedTokens];
      const idx = tokens2.findIndex(x => x.id === result.response.data.id);
      if (idx >= 0) tokens2[idx] = result.response.data;
      localData.receivedTokens = tokens2;
      toast('info', 'Token invalidation', 'Token successfully invalidated');
    } else {
      toast('error', 'Error when invalidating tokens', result.response.data.message);
    }
  };

  return (
    <div>
      <h4>Tokens Sent</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Classroom</th>
            <th>Value</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {localData.sentTokens.map((token, idx) => (
            <tr key={token.id}>
              <td>{idx + 1}</td>
              <th>{token.id}</th>
              <th>{token.classroom.name}</th>
              <th>{token.value}</th>
              <th>{token.isValid ? 'Valid' : 'Invalid'}</th>
              <th><Button variant="flat" onClick={() => invalidateToken(token)}>Invalidate</Button></th>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4>Tokens Received</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Classroom</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {localData.receivedTokens.map((token, idx) => (
            <tr key={token.id}>
              <td>{idx + 1}</td>
              <th>{token.id}</th>
              <th>{token.classroom.name}</th>
              <th>{token.value}</th>
              <th>{token.isValid ? 'Valid' : 'Invalid'}</th>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

  );
}
