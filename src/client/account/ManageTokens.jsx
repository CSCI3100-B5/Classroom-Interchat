import React, { useEffect, useState } from 'react';
import { Button, Table, Col } from 'react-bootstrap';


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
    <div className="mt-4">
      <h4>Tokens Sent</h4>
      <Col sm={11}>
        <Table striped bordered hover variant="light">
          <thead>
            <tr>
              <th>#</th>
              <th className="text-center">ID</th>
              <th className="text-center">Classroom</th>
              <th className="text-center">Value</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
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
      </Col>
      <div className="mt-4">
        <h4>Tokens Received</h4>
      </div>
      <Col sm={9}>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>#</th>
            <th className="text-center">ID</th>
            <th className="text-center">Classroom</th>
            <th className="text-center">Value</th>
            <th className="text-center">Status</th>
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
      </Col>
      <Col></Col>
    </div>

  );
}
