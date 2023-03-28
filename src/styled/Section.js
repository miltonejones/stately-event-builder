
// import React from 'react';
import { styled, Box } from '@mui/material';

const Section = styled(Box)(({ offset =  136 }) => ({
  height: `calc(100vh - ${offset}px)`,
  overflowY: 'auto',
  overflowX: 'hidden',
}))

export default Section;
