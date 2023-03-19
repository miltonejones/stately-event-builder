
// import React from 'react';
// import { styled, Box } from '@mui/material';
import { findMatches } from '../util/findMatches';
// import { TextIcon, Spacer } from '../styled';

const reportItem =  ({ value, source }) => {

  const bracketTest = /\(([^)]+)\)/g;
  const parms = findMatches(bracketTest, value);
  const parts = value?.split(bracketTest);

  // return <pre>
  //   {JSON.stringify(parms,0,2)}
  // </pre>

  const fixed = parts.map((f) => {
    const match = parms.find((e) => e[1] === f);
    if (match) {
      return source[f];
    }
    return f;
  }).join("");

  return fixed.toString();
}

export default reportItem;
