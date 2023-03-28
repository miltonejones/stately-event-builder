
import React from 'react';
// import { styled, Box } from '@mui/material';
import Flex from './Flex';

const Banner = ({ children , bold, disabled }) => {
  return <Flex 
    spacing={1} 
    bold={bold}
    sx={{
      // backgroundColor: (t) => disabled ?  t.palette.grey[200] : t.palette.primary.dark,
      color: (t) => disabled ?  t.palette.text.main : "inherit",
      p: t => t.spacing (3, 2, 1, 2), 
    }}
  >{children}</Flex>
}

export default Banner;
