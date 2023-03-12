import React from 'react';
import { Chip, Typography } from '@mui/material';
import { Spacer, Flex } from '../../../styled';
import moment from 'moment';
 

function recurseType (value) {
  var values = ['daily','weekly','monthly by date','monthly by day','yearly','weekdays','', 'custom'];
  return values[value] || 'Does not repeat';
}; 
 
const DateBox = ({ event, collapsed }) => {
  const sx = collapsed ? { width: '100%'} : {};
  if (!event.RecurseEndDate) {
    if (collapsed) {
      return <Typography variant="body2">
      {moment(event.CustomDate).format('MMM Do YY')}  
    </Typography>
    }
    return <Chip label={moment(event.CustomDate).format('MMM Do YY')} variant="filled" size="small" color="primary" />
  }

  return <Flex sx={sx} spacing={1}><Typography variant="body2">
    {moment(event.EventDate).format('MMM Do YY')} to  {moment(event.RecurseEndDate).format('MMM Do YY')}
  </Typography>
  {!!collapsed && <Spacer />}
  <Chip label={recurseType(event.RecurseType)} variant="outlined" color="primary" size="small"/>
  </Flex>
}


DateBox.defaultProps = {};
export default DateBox;
