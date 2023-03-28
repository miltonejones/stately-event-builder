import React from 'react';
import { Divider, Switch, Menu, MenuItem  } from '@mui/material'; 
import { MenuStack, Flex, Nowrap  } from "../../../../../styled";
 
 
const ListSettings = ({ handler, source }) => {
  const { excludedProps = {
    FullName: true
  } } = source.props;
  const fields = [
    {
      label: "Event Name",
      field: "EventName",
      disabled: 1
    },
    {
      label: "Room Names",
      field: "RoomNames"
    },
    {
      label: "Dates",
      field: "dates"
    },
    {
      label: "Categories",
      field: "categories"
    },
    {
      label: "Comments",
      field: "Comments"
    },
    {
      label: "Times",
      field: "times"
    },
    {
      label: "Creator",
      field: "FullName"
    },
  ]

  const handleClick = value => {
    source.setProp('excludedProps', {
      ...excludedProps,
      [value]: !excludedProps[value]
    } ) 


  }
 return (
   
        <Menu 
        dense
        onClose={handler.handleClose()} 
        anchorEl={handler.anchorEl}
        open={handler.state.matches('opened')}
      >

        <MenuStack 
          caption="Select which  event fields appear in the list." 
          icon="PhonelinkSetup">
          Configure Results
        </MenuStack>

        {/* <Stack  sx={{ minWidth: 400, p: 2 }}>
          <Nowrap>Configure Results</Nowrap>
          <Nowrap small muted>Select which  event fields appear in the list.</Nowrap>
        </Stack> */}

        <Divider />
        
        {fields.map(f => <MenuItem onClick={() => handleClick(f.field)} key={f.field}>
          
          <Flex  spacing={1}>
          <Switch disabled={f.disabled} checked={!excludedProps[f.field]} />
            <Nowrap muted={excludedProps[f.field]} >{f.label}</Nowrap>
            
            </Flex>
          
          </MenuItem>)}
        
      </Menu>
 
 );
}
ListSettings.defaultProps = {};
export default ListSettings;
