import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';


export default function ManageTokens() {
  const [sentTokens, setSentTokens] = useState([]);
  const [receivedTokens, setReceivedTokens] = useState([]);

  const { getUserTokens, setTokenFalse } = useApi();
  const { data } = useDataStore();

  useEffect(() => {
    // TODO: call API and populate token list
    // defined a getTokens function here,
    // because chrome suggested not to add async in the useEffect function?
    async function getTokens() {
      const result = await getUserTokens(data.user.id);
      if (result.success) {
        setSentTokens(result.body.created);
        setReceivedTokens(result.body.received);
      }
    }
    getTokens();
  }, []);

  const invalidateToken = async (token) => {
    // TODO: call API to invalidate token
    const result = await setTokenFalse(token.id);
    if (result.success) {
      token.isValid = false;
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
          {sentTokens.map((token, idx) => (
            <tr key={token.id}>
              <td>{idx + 1}</td>
              <th>{token.id}</th>
              <th>{token.classroom.name}</th>
              <th>{token.value}</th>
              <th>{token.isValid ? 'Valid' : 'Invalid'}</th>
              <th><Button variant="flat" onClick={invalidateToken(token)}>Invalidate</Button></th>
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
          {receivedTokens.map((token, idx) => (
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
