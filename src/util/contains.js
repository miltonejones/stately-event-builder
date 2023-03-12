export const contains = (a, b) => typeof b === 'string' && 
  typeof a === 'string' && 
  a.toLowerCase().indexOf(b.toLowerCase()) > -1