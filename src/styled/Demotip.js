
import React from 'react';
import { Tooltip } from '@mui/material';

const Demotip =  ({component: Component, children, title, ...props}) => {
  return <Tooltip title={title} open>
    <Component {...props}>
      {children}
    </Component>
  </Tooltip>
}

export default Demotip;
