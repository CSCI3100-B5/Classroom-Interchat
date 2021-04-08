import { useRef, useState } from 'react';

// This is a wrapper for useState

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

export function useStates(initialValues) {
  const data = {};
  Object.entries(initialValues).forEach(([key, value]) => {
    const [state, setState] = useState.call(this, value);
    const stateContainer = useRef(null);
    stateContainer.current = state;
    data[key] = [stateContainer, (val) => {
      setState(val);
      data[key][0].current = val;
    }];
  });
  const proxy = new Proxy(data, {
    get(target, name) {
      if (name === '__isProxy') {
        return true;
      }
      if (name.startsWith('$')) {
        const key = name.substr(1);
        return [target[key][0].current, target[key][1]];
      }
      return target[name][0].current;
    },
    set(target, name, value) {
      if (name.startsWith('$')) {
        if (!(value instanceof Array)) return false;
        if (value.length < 2) return false;
        const key = name.substr(1);
        target[key] = value;
        return true;
      }
      target[name][1](value);
      return true;
    }
  });
  return proxy;
}
