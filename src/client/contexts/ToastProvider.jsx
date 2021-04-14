import React, { useContext } from 'react';
import { useDataStore } from './DataStoreProvider.jsx';

const ToastContext = React.createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const { data } = useDataStore();

  function toast(type, title, body, dedupe = true, sticky = false) {
    let toasts = [...data.toasts];
    const id = (+new Date()).toString(36);
    if (!sticky) {
      if (dedupe) {
        toasts = toasts.filter(x => x.type !== type
        || x.title !== title
        || x.body !== body);
      }
      toasts.push({
        type,
        title,
        body,
        timestamp: new Date(),
        id,
        sticky
      });
    } else {
      const t = toasts.find(x => x.type === type && x.title === title && x.body === body);
      if (t) {
        t.sticky = true;
      } else {
        toasts.push({
          type,
          title,
          body,
          timestamp: new Date(),
          id,
          sticky
        });
      }
    }
    data.toasts = toasts;
    return id;
  }

  function removeToast(id) {
    data.toasts = data.toasts.filter(x => x.id !== id);
  }

  return (
    <ToastContext.Provider value={{
      toast,
      removeToast
    }}
    >
      {children}
    </ToastContext.Provider>
  );
}
