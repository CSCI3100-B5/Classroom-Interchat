import React, { useEffect, useState } from 'react';
import {
  Button, Tabs, Tab, Card, Badge
} from 'react-bootstrap';
import { useStates } from 'use-states';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';
import './ManageTokens.scoped.css';


export default function ManageTokens() {
  const localData = useStates({
    sentTokens: [],
    receivedTokens: []
  });

  const { getUserTokens, setTokenFalse } = useApi();
  const { data } = useDataStore();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const result = await getUserTokens(data.user.id);
      if (result.success) {
        localData.sentTokens = result.response.data.created;
        localData.receivedTokens = result.response.data.received;
      } else {
        toast('error', 'Error when fetching tokens', result.response.data.message);
      }
    })();
  }, [data.user]);

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
    <div className="mt-4 token-tabs">
      <Tabs justify variant="pills" defaultActiveKey="tokensReceived">
        <Tab eventKey="tokensReceived" title="Tokens Received" className="token-card-container">
          {localData.receivedTokens.sort((a, b) => {
            if (+a.isValid - +b.isValid !== 0) return +b.isValid - +a.isValid;
            return new Date(b.createdAt) - new Date(a.createdAt);
          }).map(token => (
            <Card key={token.id} className="token-card border-0 shadow-sm">
              <Card.Header>
                <span className="text-muted">{token.id}</span>
              </Card.Header>
              <Card.Body>
                {token.value && token.value.length > 0 ? (
                  <Card.Title>
                    <span>{token.value}</span>
                  </Card.Title>
                ) : null}
                <Card.Text as="div">
                  <p>
                    <span className="text-muted font-weight-light text-small mr-2">CREATED BY </span>
                    {token.createdBy.name}
                    <span className="text-muted text-small">
                      {' '}
                      (
                      {token.createdBy.email}
                      )
                    </span>
                  </p>
                  <p>
                    <span className="text-muted font-weight-light text-small mr-2">CLASSROOM </span>
                    {token.classroom.name}
                  </p>
                  <p>
                    <span className="text-muted font-weight-light text-small mr-2">CREATION DATE </span>
                    {new Date(token.createdAt).toLocaleString()}
                  </p>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                {token.isValid ? (
                  <Badge variant="success" className="badge-large">VALID</Badge>
                ) : (
                  <Badge variant="secondary" className="badge-large">INVALID</Badge>
                )}
              </Card.Footer>
            </Card>
          ))}
        </Tab>
        <Tab eventKey="tokensSent" title="Tokens Sent" className="token-card-container">
          {localData.sentTokens.sort((a, b) => {
            if (+a.isValid - +b.isValid !== 0) return +b.isValid - +a.isValid;
            return new Date(b.createdAt) - new Date(a.createdAt);
          }).map(token => (
            <Card key={token.id} className="token-card border-0 shadow-sm">
              <Card.Header>
                <span className="text-muted">{token.id}</span>
              </Card.Header>
              <Card.Body>
                {token.value && token.value.length > 0 ? (
                  <Card.Title>
                    <span>{token.value}</span>
                  </Card.Title>
                ) : null}
                <Card.Text as="div">
                  <p>
                    <span className="text-muted font-weight-light text-small mr-2">RECEIVED BY </span>
                    {token.receivedBy.name}
                    <span className="text-muted text-small">
                      {' '}
                      (
                      {token.receivedBy.email}
                      )
                    </span>
                  </p>
                  <p>
                    <span className="text-muted font-weight-light text-small mr-2">CLASSROOM </span>
                    {token.classroom.name}
                  </p>
                  <p>
                    <span className="text-muted font-weight-light text-small mr-2">CREATION DATE </span>
                    {new Date(token.createdAt).toLocaleString()}
                  </p>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                {token.isValid ? (
                  <>
                    <Badge variant="success" className="badge-large">VALID</Badge>
                    <Button variant="flat" onClick={() => invalidateToken(token)}>Invalidate</Button>
                  </>
                ) : (
                  <Badge variant="secondary" className="badge-large">INVALID</Badge>
                )}
              </Card.Footer>
            </Card>
          ))}
        </Tab>
      </Tabs>
    </div>

  );
}
