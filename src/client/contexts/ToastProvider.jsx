import React, { useContext } from 'react';
import { useDataStore } from './DataStoreProvider.jsx';

const ToastContext = React.createContext();

/**
 * The hook used by children to access this context
 */
export function useToast() {
  return useContext(ToastContext);
}

/**
 * A React context component implementing a central toast logic
 */
export function ToastProvider({ children }) {
  const { data } = useDataStore();

  /**
   * Create a new toast notification
   * @param {"error"|"warning"|"info"} type Type of toast, determines the icon to be shown
   * @param {string} title Title of the toast
   * @param {string} body Body text of the toast
   * @param {boolean} dedupe Whether toasts with the same title and body should be treated as the same toast
   * @param {boolean} sticky Whether this toast should never disappear
   * @returns id of the toast
   */
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

  /**
   * Remove a toast by its id
   * @param {string} id id of the toast to be removed
   */
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
