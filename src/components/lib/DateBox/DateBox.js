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
  const format = collapsed ? "M/DD/YY" : "MMM Do YY"
  if (!event.RecurseEndDate) {
    if (collapsed) {
      return <Typography variant="body2">
      {moment(event.CustomDate).format(format)}  
    </Typography>
    }
    return <Chip label={moment(event.CustomDate).format(format)} variant="filled" size="small" color="primary" />
  }

  return <Flex sx={sx} spacing={1}><Typography variant="body2">
    {moment(event.EventDate).format(format)} to  {moment(event.RecurseEndDate).format(format)}
  </Typography>
  {!!collapsed && <Spacer />}
  <Chip label={recurseType(event.RecurseType)} variant="outlined" color="primary" size="small"/>
  </Flex>
}


DateBox.defaultProps = {};
export default DateBox;
