import React from 'react';
import { Card, Stack } from '@mui/material';
import { Flex, Spacer, Btn, Warn, Nowrap } from '../../../styled';

 
const Unsaved = ({ handler, yes = 'OK', no = 'CANCEL', save = 'SAVE' }) => {
  return (
    <Card sx={{ p: 1, maxWidth: 500 }}>
      <Stack spacing={2}>
        <Warn filled severity="error">
          You have unsaved changes.
        </Warn>
        <Nowrap sx={{ mt: 1, p: t => t.spacing (2, 0) }}>Are you sure you want to exit?</Nowrap>
        <Flex sx={{ mt: 1, pb: 2 }} spacing={1}>
          <Btn variant="contained" onClick={() => handler.send(save)}>
            Save Changes
          </Btn>
          <Spacer />
          <Btn onClick={() => handler.send(no)}>Cancel</Btn>
          <Btn
            variant="contained"
            color="error"
            onClick={() => handler.send(yes)}
          >
            Discard Changes
          </Btn>
        </Flex>
      </Stack>
    </Card>
  );
};
Unsaved.defaultProps = {};
export default Unsaved;
