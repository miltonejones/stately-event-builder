
import React from 'react';
import { styled, LinearProgress,Stack, Box } from '@mui/material';
import { objectPath } from '../util/objectPath';


const Waiter = styled(Stack)(() => ({
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  display: 'flex',
  backgroundColor: 'rgba(0,0,0,0.12)',
  alignItems: 'center',
  zIndex: 25,
  justifyContent: 'center',
}))

const Waiting = ({ handler }) => {
  if (handler.is(['listing.ready', 'editing.form'])) {
   return <i />
  }

  

  return <Waiter>
    {objectPath(handler.state.value)}[{handler.lookup_progress}]
   {!!handler.lookup_progress && <Box sx={{ width: 500 }}>
      <LinearProgress value={handler.lookup_progress}  variant="determinate"/>
    </Box>} 
  </Waiter>
}

export default Waiting;
