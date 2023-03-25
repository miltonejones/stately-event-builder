import React from 'react';
import { 
  // styled, 
  Switch, 
  // Box, 
  Menu, Link, MenuItem } from '@mui/material';
import {
  Flex, 
  // IconTextField, 
  TinyButton, 
  // TextIcon,
  Nowrap
} from '../../../../../styled';
import { timeToNum } from '../../../../../util/timeToNum';
import { useMenu } from '../../../../../machines';
import moment from 'moment';

// const Layout = styled(Box)(({ theme }) => ({
//  margin: theme.spacing(4)
// }));
 
const SetupMenu = ({ handler, handleChange }) => {

  const menu = useMenu((val) => {
    if (!val) return;
    const offset = val * 1000 * 60;
    const start = values.EventStartTime * 1000 * 60;
    const end = values.EventEndTime * 1000 * 60;
    const span = {
      start: moment.utc(start - offset).format('HH:mm') + ":00",
      end: moment.utc(end + offset).format('HH:mm') + ":00",
    }

    handleChange("SetupStartTime", span.start);
    handleChange("SetupEndTime", span.end);
  });


  const values = ['EventStartTime', 'EventEndTime', 'SetupStartTime', 'SetupEndTime']
    .reduce((out, key) => {
      out[key] = timeToNum(handler.eventProp[key]) / 1000 / 60
      return out;
    }, {}); 

  const span = {
    start: values.EventStartTime - values.SetupStartTime,
    end: values.SetupEndTime - values.EventEndTime
  }

  const matching = span.start === span.end;
  const spans = {
    30: '30 minutes', 
    60: '1 hour', 
    90: '90 minutes', 
    120: '2 hours'
  };
  const selected = Object.keys(spans).find(f => Number(f) === Number(span.start));

 return (
<>
<Flex spacing={1} sx={{ height: '100%'}}>
    <Switch checked={matching} />
    <Nowrap small muted> Allow <Link sx={{ cursor: 'pointer' }} onClick={menu.handleClick}>{spans[selected]}</Link> setup</Nowrap>
    <TinyButton icon="Settings" />
    {/* {JSON.stringify(span.start)}--
    {JSON.stringify(selected)} */}
  </Flex>

     <Menu
     onClose={menu.handleClose()} 
     anchorEl={menu.anchorEl}
     value={span.start}
     open={menu.state.matches('opened')}
   >
    {Object.keys(spans).map(f => <MenuItem key={f} onClick={menu.handleClose(f)}>
      <Flex bold={Number(f) === Number(span.start)}>{spans[f]}</Flex>
    </MenuItem>)}
    
   </Menu>

</>
 );
}
SetupMenu.defaultProps = {};
export default SetupMenu;
