import React from 'react';
import { styled, Drawer, LinearProgress,TextField, Box, Stack } from '@mui/material';
import { 
  Flex,
  Nowrap,
  Columns,
  SectionHead,
  IconTextField,
  TextIcon,
  Spacer,
  Btn 
} from "../../../styled";

import { contains } from '../../../util/contains';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0),
 height: '60vh',
 overflow: 'hidden'
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
      <Nowrap selected={ID === item.ID} onClick={() => onChange(item.ID)} border hover sx={{ ml, overflow: 'hidden' }}>{item.RoomName}</Nowrap>
      <Nowrap selected={ID === item.ID} muted={!item.Directions} border sx={{ overflow: 'hidden' }}>{item.Directions || hidden}</Nowrap>
      <Nowrap selected={ID === item.ID} muted={!item.Comments} border sx={{ overflow: 'hidden' }}>{item.Comments || hidden}</Nowrap>
      {!filter && <RoomTree ID={ID} onChange={onChange} rooms={rooms} parentID={item.ID} ml={ml + 2} />}
      </>
    ))}
    </>
  )
}
 
const RoomList = ({ handler, disabled }) => {
 return (
  <Drawer anchor="bottom" open={handler.open}>
   <Layout data-testid="test-for-RoomList">
    <SectionHead sx={{ p: t => t.spacing(1, 1)}}>Rooms
{/* [{handler.filter}] */}
      <Spacer />
      <IconTextField 
        size="small" 
        label="filter"
        value={handler.filter}
        onChange={e => {
          handler.send({
            type: 'CHANGE',
            key: 'filter',
            value: e.target.value
          })
        }}
        endIcon={<TextIcon icon="Search" />}
      />
      <Btn onClick={() => handler.send('CLOSE')}
        endIcon={<TextIcon icon="Close" />}> 
        close  
      </Btn>
    </SectionHead>
    {handler.busy && <LinearProgress variant="indeterminate" />}

    {/* {handler.ID} */}
    {/* {JSON.stringify(handler.state.value)} */}

    <Columns sx={{ alignItems: 'flex-start' }} columns={handler.state.matches('opened.editing') ? "65% 1fr" : "100% 0"}>
      <Box sx={{ m: 2, height: 'calc(60vh - 80px)', overflow: 'auto' }}>
        <Columns spacing={0} columns="30% 30% 1fr">
          <RoomTree ID={handler.ID} onChange={ID => {
            handler.send({
              type: 'EDIT',
              ID
            })
          }} rooms={handler.roomList} filter={handler.filter} />
        </Columns>
      </Box>
      
        {!!handler.room && <Stack spacing={1} sx={{p: 2}}>
          <TextField label="Room Name" fullWidth size="small" value={handler.room.RoomName} />
          <TextField label="Directions" fullWidth 
            multiline rows={2}
            size="small" value={handler.room.Directions} />
          <TextField label="Comments" fullWidth 
            multiline rows={2}
            size="small" value={handler.room.Comments} />
            <Flex spacing={1}>
              <Spacer />
              <Btn onClick={() => handler.send('CLOSE')}>Cancel</Btn>
              <Btn disabled={disabled} variant="contained">Save</Btn>
            </Flex> 
        </Stack>}
    </Columns>
      {/* {JSON.stringify(handler.state.value,0,2)} */}
    {/* <pre>
      {JSON.stringify(handler.roomList,0,2)}
    </pre> */}
   </Layout>
   </Drawer>
 );
}
RoomList.defaultProps = {};
export default RoomList;
