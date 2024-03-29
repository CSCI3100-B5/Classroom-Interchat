import React from 'react';
import { Toast } from 'react-bootstrap';
import { BsFillXCircleFill, BsFillExclamationCircleFill, BsFillInfoCircleFill } from 'react-icons/bs';
import { useDataStore } from './contexts/DataStoreProvider.jsx';
import { useToast } from './contexts/ToastProvider.jsx';
import './ToastCenter.scoped.css';

/**
 * Display all toasts that are sent to the toast context
 */
export default function ToastCenter() {
  const { data } = useDataStore();
  const { removeToast } = useToast();

  return (
    <div className="toast-container">
      {[...data.toasts].reverse().map((x) => {
        let icon = <BsFillInfoCircleFill />;
        if (x.type === 'error') {
          icon = <BsFillXCircleFill />;
        } else if (x.type === 'warning') {
          icon = <BsFillExclamationCircleFill />;
        }
        return (
          <Toast
            key={x.id}
            className="animate-toast glass-card"
            onClose={() => removeToast(x.id)}
            show={data.toasts.some(y => y.id === x.id)}
            delay={x.sticky ? undefined : 3000}
            autohide={!x.sticky}
          >
            <Toast.Header>
              <div className="mr-2">
                {icon}
              </div>
              <strong className="mr-2">{x.title}</strong>
              <small className="mr-auto">{x.timestamp.toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body>{x.body}</Toast.Body>
          </Toast>
        );
      })}
    </div>
  );
}
