
import React from 'react';
// import { styled, Stack, Collapse, Box } from '@mui/material';
import Flex from './Flex';
import Nowrap from './Nowrap';
import Spacer from './Spacer';
import TextIcon from './TextIcon';
import ConfirmPop from './ConfirmPop';
import Btn from './Btn';

const GridFormFooter = ({ 
  handler, 
  error, 
  horizontal = true, 

  cancel='CANCEL',
  ok = 'OK', 

  handleClose,
  handleSave,

  // save = 'SAVE',
  // quit = 'EXIT',
  drop , // = 'DELETE',
  ...props
}) => {
  return <>
    <Flex { ...props} >

  <Flex wrap="nowrap" sx={{ width: !error ? 0 : '100%', overflow: 'hidden', transition: 'width 0.3s linear'}} spacing={1}>
      <Nowrap>You have unsaved changes</Nowrap>
    
       {!!handleSave && <Btn variant="contained" onClick={handleSave}>
          save
        </Btn>}
      <Spacer />
        <Btn variant="outlined" onClick={() => handler.send(cancel)}>cancel</Btn>
        <Btn
          variant="contained"
          color="error"
          onClick={() => handler.send(ok)}
        >
          Don't save
        </Btn>
     
    </Flex>
 

  <Flex wrap="nowrap" sx={{ width: error ? 0 : '100%', overflow: 'hidden', transition: 'width 0.3s linear'}} spacing={1}>
     {!!drop && <ConfirmPop
            onChange={() => handler.send(drop)}
      ><Btn
        variant="contained"
        color="error"
        disabled={props.disabled || !handler.dirty}
      >
        delete
      </Btn></ConfirmPop>}
      <Spacer />
      {handleClose && <Btn
        disabled={props.disabled} onClick={handleClose}>cancel</Btn>}
      {handleSave && <Btn
        endIcon={<TextIcon icon="Save" />}
        disabled={props.disabled || !handler.dirty}
        variant="contained"
        onClick={handleSave}
      >
        save
      </Btn>}
    </Flex>

    </Flex>
 
  {/* <Collapse
    sx={{ width: '100%'}}
    in={!error}
    orientation={horizontal ? 'horizontal' : 'vertical'}
  >
  
  </Collapse> */}

  </>
}

export default GridFormFooter;
