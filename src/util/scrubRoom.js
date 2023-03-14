import { scrubProp  } from './scrubProp';

export const scrubRoom = obj => !obj ? null : Object.keys(obj).reduce((out, key) => { 
  out[key] = typeof obj[key] === 'string'
    ? scrubProp(obj[key])
    : obj[key]
  return out;
}, {})
 
 