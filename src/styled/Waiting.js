import React from 'react';
import { styled, LinearProgress, Snackbar, Alert, Stack, Box } from '@mui/material';
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
}));

const messages = {
  init_lookup: 'Loading app settings...',
  'editing.reload': "Reloading event details...",
  'listing.searching': "Starting search...",
  'listing.list_received': "Collating response...",
  'editing.load_event': "Loading event details...",
  'saving': "Saving event details..."
}

const Waiting = ({ handler }) => {
  if (handler.is(['listing.ready', 'editing.leaving', 'editing.form'])) {
    return <i />;
  }
  const state = objectPath(handler.state.value);
  const messageKey = Object.keys(messages).find(handler.state.matches);
  const messageText = messages[messageKey] || `current state: ${state}`;

  return (
    <>
    <Waiter>
      {messageText} 
      {!!handler.lookup_progress && (
        <Box sx={{ width: 500 }}>
          <LinearProgress
            value={handler.lookup_progress}
            variant="determinate"
          />
        </Box>
      )}</Waiter>
     {!!messages[messageKey] && <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open 
      >
        <Alert severity="success" sx={{ maxWidth: 300 }}>
          {messages[messageKey]}
        </Alert>
      </Snackbar>}
    </>
  );
};

export default Waiting;
