
import React from 'react';
import { Popover, Stack, Box, TextField, Typography } from "@mui/material"; 
import { useMenu } from '../machines';
import Flex from './Flex';
import Spacer from './Spacer';
import Nowrap from './Nowrap';
import Btn from './Btn'; 

const PopoverModal = ({button, headButtons, title, children, ...props}) => {
  const menu = useMenu(console.log);

  return (
   <>
   <Box onClick={menu.handleClick}>
    {button}
   </Box>

    <Popover anchorEl={menu.anchorEl}
      onClose={menu.handleClose()}  
      open={Boolean(menu.anchorEl) }
     
      > 

    <Stack  sx={{ backgroundColor: t => t.palette.grey[100]}}>
      <Box sx={{ p: 2, minWidth: 360}}>
        <Flex spacing={1}>
          <Nowrap muted small>{title}</Nowrap>
          <Spacer />
          {headButtons}
        </Flex>

      </Box>


    <Typography>{props.label}</Typography>

    <TextField
      size="small"
      autoComplete="off" 
      {...props}
    />

    <Flex spacing={1}>
      <Spacer />
      <Btn onClick={menu.handleClose()}>cancel</Btn>
      <Btn onClick={menu.handleClose()} variant="contained">Okay</Btn>
    </Flex>

    </Stack>

    
   </Popover>
   
   
   </>
  )

}


export default PopoverModal;
