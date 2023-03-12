import React from 'react';
import { styled, Box, TextField, MenuItem } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 

const RoomItems = ({ rooms, parentID = 0, pl = 0}) => {
  const items = rooms.filter (f => f.RoomFk === parentID);
  return items.map((item, i) => (
    <> 
    <MenuItem value={item.ID}><Box sx={{ pl }}>{item.ID}-{item.RoomName}</Box></MenuItem>
    <RoomItems rooms={rooms} parentID={item.ID} pl={pl + 4} />
    </>
  ))
}

 
const RoomSelect = ({ rooms, value }) => {
 return (
   <Layout data-testid="test-for-RoomSelect"> 
     <TextField 
      fullWidth
      size="small"
      value={value}
      select
      >
        <RoomItems rooms={rooms}/>
      </TextField> 
   </Layout>
 );
}
RoomSelect.defaultProps = {};
export default RoomSelect;
