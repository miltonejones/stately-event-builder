
import React from 'react';
// import { styled, Box } from '@mui/material';
import Flex from './Flex';

const Banner = ({ children , disabled}) => {
  return <Flex 
    spacing={1} 
    sx={{
      backgroundColor: (t) => disabled ?  t.palette.grey[200] : t.palette.primary.dark,
      color: (t) => disabled ?  t.palette.text.main : t.palette.common.white,
      p: 1, 
    }}
  >{children}</Flex>
}

export default Banner;
