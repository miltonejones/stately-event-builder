import React from 'react';
import { Chip, Typography } from '@mui/material';
import { Flex } from '../../../styled';
import moment from 'moment';
 

function recurseType (value) {
  var values = ['daily','weekly','monthly by date','monthly by day','yearly','weekdays','', 'custom'];
  return values[value] || 'Does not repeat';
}; 
 
const DateBox = ({ event }) => {
  if (!event.RecurseEndDate) {
    return <Chip label={moment(event.CustomDate).format('MMM Do YY')} variant="filled" size="small" color="primary" />
  }

  return <Flex spacing={1}><Typography variant="body2">
    {moment(event.EventDate).format('MMM Do YY')} to  {moment(event.RecurseEndDate).format('MMM Do YY')}
  </Typography>
  <Chip label={recurseType(event.RecurseType)} variant="outlined" color="primary" size="small"/>
  </Flex>
}


DateBox.defaultProps = {};
export default DateBox;
