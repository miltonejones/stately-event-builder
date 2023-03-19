import React from 'react';
import { Stack,Collapse } from '@mui/material';
import { Flex, Spacer,  Nowrap, Btn } from '../../../../../styled';
  
 
const AppsFooter = ({ handler, anchor }) => {
  if (!handler) return <i />

 return (
   <>
        <Collapse in={handler?.is('confirm_close')} orientation={anchor === 'bottom' ? "horizontal" : "vertical"}>
        <Stack direction={anchor === 'bottom' ? "row" : "column"} spacing={1}>
        <Nowrap>You have unsaved changes</Nowrap>
        <Flex spacing={1}> 
        <Btn variant="contained" onClick={() => handler.send('UPDATE')}>save</Btn> 
         {anchor !== 'bottom' && <Spacer />}
        <Btn onClick={() => handler.send('CANCEL')}>cancel</Btn>
        <Btn variant="contained" color="error" onClick={() => handler.send('OK')}>Don't save</Btn> 
        </Flex>
        </Stack>
      </Collapse>

      <Collapse in={handler?.is('editing')} orientation={anchor === 'bottom' ? "horizontal" : "vertical"}>
        <Flex wrap="nowrap" spacing={1}>
        <Btn variant="contained" color="error" onClick={() => handler.send('DELETE')}>delete</Btn> 
         {anchor !== 'bottom' && <Spacer />}
        <Btn onClick={() => handler.send('EXIT')}>cancel</Btn>
        <Btn disabled={!handler.dirty} variant="contained" onClick={() => handler.send('UPDATE')}>save</Btn> 
        </Flex>
      </Collapse>
   </>
 );
}
AppsFooter.defaultProps = {};
export default AppsFooter;
