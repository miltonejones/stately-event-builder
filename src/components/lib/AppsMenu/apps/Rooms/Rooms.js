import React from 'react';
import { styled, TextField, Stack, MenuItem, Box } from '@mui/material';

import {
  // Flex,
  Nowrap,
  // Btn,
  // reportItem,
  // Spacer,
  TinyButton,
  ConfirmPop,
  // TextIcon,
  Columns,
} from '../../../../../styled';
import { contains } from '../../../../../util/contains';

const Layout = styled(Box)(({ theme, small, tall }) => ({
  margin: theme.spacing(1),
  height:  '60vh'  ,
  transition: 'height  0.3s ease-in'
}));

 
const RoomTree = ({ rooms, filter, ID, onChange, parentID = 0, ml = 0 }) => {
  const items = !!filter 
    ? rooms.filter (f => contains(f.RoomName, filter))
    : rooms.filter (f => f.RoomFk === parentID);
  const hidden = <em>value not set</em>

  return (
    <>
    {items.map((item, i) => (
      <>
      <Nowrap selected={ID === item.ID} onClick={() => onChange && onChange(item.ID, item.RoomName)} border hover sx={{ ml, overflow: 'hidden' }}>{item.RoomName}</Nowrap>
      <Nowrap selected={ID === item.ID} muted={!item.Directions} border sx={{ overflow: 'hidden' }}>{item.Directions || hidden}</Nowrap>
      <Nowrap selected={ID === item.ID} muted={!item.Comments} border sx={{ overflow: 'hidden' }}>{item.Comments || hidden}</Nowrap>

      <ConfirmPop 
        label="Confirm delete"
        caption="This action cannot be undone."
        message={<>Are you sure you want to delete room <b>{item.RoomName}</b>?</>} onChange={ok => {
        alert(JSON.stringify(ok))
      }}><TinyButton icon="Delete" /></ConfirmPop>

      {!filter && <RoomTree ID={ID} onChange={onChange} rooms={rooms} parentID={item.ID} ml={ml + 2} />}
      </>
    ))}
    </>
  )
}
 
const Rooms = ({ handler }) => {
  const selectedRoom = handler.item;
  
  const handleChange = (event, value) => {
    handler.send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }
 return (
   <Layout data-testid="test-for-Rooms">

    <Columns sx={{ alignItems: 'flex-start' }} columns={handler.is('editing') ? "65% 1fr" : "100% 0"}>
      {handler.is(['editing', 'idle']) && <Box sx={{ m: 2, height: 'calc(60vh - 40px)', overflow: 'auto' }}>
        <Columns spacing={0} columns="30% 30% 1fr 24px">
         <RoomTree ID={handler.ID} onChange={(ID, title) => {
            handler.send({
              type: 'EDIT',
              ID,
              title
            })
          }} rooms={handler.items} filter={handler.filter} />
        </Columns>
        </Box>}

        <Box>
        {handler.is('editing') && !!selectedRoom && <Stack spacing={1} sx={{p: 2}}>
          <TextField 
            label="Parent Room" 
            name="RoomFk" 
            fullWidth 
            onChange={handleChange} 
            size="small" 
            select
            value={selectedRoom.RoomFk} 
            >
              {handler.items.map(rm => <MenuItem value={rm.ID}>{rm.RoomName}</MenuItem>)}

          </TextField>


          <TextField label="Room Name" name="RoomName" fullWidth onChange={handleChange} size="small" value={selectedRoom.RoomName} />
          <TextField label="Directions" name="Directions" fullWidth onChange={handleChange}
            multiline rows={2}
            size="small" value={selectedRoom.Directions} />
          <TextField label="Comments" name="Comments" fullWidth  onChange={handleChange}
            multiline rows={2}
            size="small" value={selectedRoom.Comments} />
            {/* <Flex spacing={1}>
              <Spacer />
              <Btn onClick={() => handler.send('CLOSE')}>Cancel</Btn>
              <Btn disabled={disabled} variant="contained">Save</Btn>
            </Flex>  */}
        </Stack>}
        </Box>
      </Columns>
   </Layout>
 );
}
Rooms.defaultProps = {};
export default Rooms;
