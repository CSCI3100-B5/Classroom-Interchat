import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';


export default function Logout() {
  const {
    data
  } = useDataStore();
  const history = useHistory();

  return (
    <Button onClick={() => {
      data.rememberMe = true;
      data.accessToken = null;
      data.refreshToken = null;
      data.user = null;
      history.push('/');
    }}
    >
      Logout

    </Button>

  );
}
