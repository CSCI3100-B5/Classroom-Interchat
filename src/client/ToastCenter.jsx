import React from 'react';
import { Toast } from 'react-bootstrap';
import { BsFillXCircleFill, BsFillExclamationCircleFill, BsFillInfoCircleFill } from 'react-icons/bs';
import { useDataStore } from './contexts/DataStoreProvider.jsx';
import { useToast } from './contexts/ToastProvider.jsx';
import './ToastCenter.scoped.css';

export default function ToastCenter() {
  const { data } = useDataStore();
  const { removeToast } = useToast();

  return (
    <div className="toast-container">
      {data.toasts.map((x) => {
        let icon = <BsFillInfoCircleFill />;
        if (x.type === 'error') {
          icon = <BsFillXCircleFill />;
        } else if (x.type === 'warning') {
          icon = <BsFillExclamationCircleFill />;
        }
        return (
          <Toast
            key={x.id}
            className="toast"
            onClose={() => removeToast(x.id)}
            show={data.toasts.some(y => y.id === x.id)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <div className="mr-2">
                {icon}
              </div>
              <strong className="mr-2">{x.title}</strong>
              <small>{x.timestamp.toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body>{x.body}</Toast.Body>
          </Toast>
        );
      })}
    </div>
  );
}
