
import React from 'react';
import { Collapse } from '@mui/material';

const JsonCollapse =  ({children, open, object,  ...props}) => {
  return <>
    <Collapse in={open} {...props}>
     {!!open && <pre>
        {JSON.stringify(object, 0, 2)}
      </pre>}
    </Collapse>
    <Collapse in={!open} {...props}>
     {children}
    </Collapse>
  </>
}

export default JsonCollapse;
