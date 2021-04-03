import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';


export default function ManageTokens() {
  const [sentTokens, setSentTokens] = useState([]);
  const [receivedTokens, setReceivedTokens] = useState([]);


  useEffect(() => {
    // TODO: call API and populate token list
  }, []);

  const invalidateToken = (token) => {
    // TODO: call API to invalidate token
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
