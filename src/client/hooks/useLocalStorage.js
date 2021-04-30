// adapted from
// https://github.com/WebDevSimplified/Whatsapp-Clone/blob/master/client/src/hooks/useLocalStorage.js

import { useEffect, useState } from 'react';

const PREFIX = 'classroom-interchat-';

/**
 * Creates a stateful value that persists by saving to browser local storage
 * @param {string} key key of this value
 * @param {any} initialValue initial value
 * @returns {[any, (newValue: any) => void]} current value and a set value function
 */
export default function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === 'function') {
      return initialValue();
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  return [value, setValue];
}
