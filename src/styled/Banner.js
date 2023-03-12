
import React from 'react';
// import { styled, Box } from '@mui/material';
import Flex from './Flex';

const Banner = ({ children }) => {
  return <Flex 
    spacing={1} 
    sx={{
      backgroundColor: (t) => t.palette.primary.main,
      p: 1,
      color: "white",
    }}
  >{children}</Flex>
}

export default Banner;
