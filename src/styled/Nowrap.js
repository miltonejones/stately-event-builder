
// import React from 'react';
import { styled, Typography } from '@mui/material';
//  import { blue } from '@mui/material/colors';

const Nowrap = styled(Typography)(( { theme, selected, color, width, muted, small, thin, border, bold = false, hover } ) => {
  const obj = {
    cursor: hover ? 'pointer' : 'default',
    fontWeight:  bold || selected ? 600 : 400,
    // backgroundColor: odd ? blue[50] : theme.palette.common.white,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: selected ? theme.palette.primary.dark : null ,
    width:  width || '',
    color: selected ? theme.palette.common.white : (muted ? theme.palette.text.secondary : null) ,
    '&:hover': {
      textDecoration: hover ? 'underline' : 'none'
    }
  };
  if (small) {
    Object.assign(obj, {
      fontSize: '0.85rem'
    })
  }
  if (border) {
    Object.assign(obj, {
      borderBottom: 'solid 1px ' + theme.palette.divider
    })
  }
  if (thin) {
    Object.assign(obj, {
      lineHeight: '1em'
    })
  }

  if (color && theme.palette[color]){
    Object.assign(obj, {
      color: theme.palette[color].main
    })
  }
  return obj;
})

export default Nowrap;
