/**
 * This component is just a styled MUI CircularProgress component
 * positioned in the center of the screen using absolute positioning.
 * 
 * @component
 */

import React from 'react';
import { styled, CircularProgress } from '@mui/material';

const CircleWrap = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  bottom: 'calc(50vh - 54px)' ,
  right:  'calc(50vw - 54px)', 
}));

export default CircleWrap;
 