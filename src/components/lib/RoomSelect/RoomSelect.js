import React from 'react';
import { styled, Box, Autocomplete, TextField } from '@mui/material';
import { roomRecurse } from '../../../util/roomRecurse';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0),
 width: "100%"
}));

const keys = {
  '&amp;': '&',
  '&apos;': "'"
}

const scrubProp = str => {
  Object.keys(keys).map(key => {
    while(str.indexOf(key) > 0) {
       str = str.replace(key, keys[key]);
    }
    return key;
  })
  return str;
}

const scrubRoom = obj => !obj ? null : Object.keys(obj).reduce((out, key) => { 
  out[key] = typeof obj[key] === 'string'
    ? scrubProp(obj[key])
    : obj[key]
  return out;
}, {})
 
 
 
const RoomSelect = ({ rooms, eventfk, onChange, value }) => {
  const items = roomRecurse(rooms);
  const found = value?.map(rm => {
    const item = items?.find(f => f.ID === rm.roomfk);
    return {
      ...rm,
      ...item
    }
  })



  const renderOption = (props, option) => {
    
   
    return <Box {...props} sx={{ ml: option.indent  }}>
      {option.RoomName}  
    </Box>;
  };


 return (
   <Layout data-testid="test-for-RoomSelect"> 
   {/* [{found?.RoomName}]---
   [{scrubProp(found?.RoomName)}] */}
   <Autocomplete 
      options={items.map(scrubRoom)}
      multiple
      getOptionLabel={(option) => option.RoomName || option}
      renderOption={renderOption}
      onChange={(_, newValue) => {
        const updated = newValue.map(f => ( {
          eventfk,
          roomfk: f.ID, 
        })) 
        onChange(updated)
      }}
      renderInput={(params) => <TextField {...params} fullWidth size="small" label="Event Room" />}
      value={found.map(scrubRoom)}
    />
     {/* <TextField 
      fullWidth
      size="small"
      value={value}
      select
      >
       {items.map((item, i) => (
        <MenuItem value={item.ID}><Box sx={{ pl: item.indent }}>{item.ID}-{item.RoomName}</Box></MenuItem>
      ))}
      </TextField>  */}
   </Layout>
 );
}
RoomSelect.defaultProps = {};
export default RoomSelect;
