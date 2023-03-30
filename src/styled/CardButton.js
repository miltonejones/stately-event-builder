
// import React from 'react';
import { styled, Card } from '@mui/material';

const CardButton = styled(Card)(({ theme, warning, idle, active }) => ({
  width: 56,
  height: 56,
  backgroundColor: active
    ? theme.palette.common.white
    : warning
    ? theme.palette.warning.main
    : theme.palette.grey[200],
  color:
    active || warning ? theme.palette.common.white : theme.palette.text.main,
  margin: theme.spacing(1),
  cursor: 'pointer',
  transition: 'outline 0.1s linear',
  // outline: active ? "solid 2px red" : "",
  '&:hover': {
    outline: active || idle ? '' : 'solid 2px ' + theme.palette.primary.dark,
    outlineOffset: 2,
  },

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default CardButton;
