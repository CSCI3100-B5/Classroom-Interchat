import { useState } from 'react';

let globalInstantUpdate = false;

export function setGlobalInstantUpdate(value) {
  globalInstantUpdate = value;
}

export function bindState(arrayOrGetter, setter) {
  if (setter === undefined) {
    const [state, setState] = arrayOrGetter;
    return {
      value: state,
      onChange: e => setState(e.currentTarget.value)
    };
  }

  return {
    value: arrayOrGetter,
    onChange: e => setter(e.currentTarget.value)
  };
}

export function useStates(initialValues, instantUpdate = globalInstantUpdate) {
  const data = {};
  Object.entries(initialValues).forEach(([key, value]) => {
    const [state, setState] = useState.call(this, value);
    data[key] = [state, (val) => {
      setState(val);
      if (instantUpdate) data[key][0] = val;
    }];
  });
  const proxy = new Proxy(data, {
    get(target, name) {
      if (name === '__isProxy') {
        return true;
      }
      if (name.startsWith('$')) {
        const key = name.substr(1);
        return target[key];
      }
      return target[name][0];
    },
    set(target, name, value) {
      target[name][1](value);
      return true;
    }
  });
  return proxy;
}
