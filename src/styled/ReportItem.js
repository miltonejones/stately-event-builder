
// import React from 'react';
// import { styled, Box } from '@mui/material';
import { findMatches } from '../util/findMatches';
import { timeToNum } from '../util/timeToNum';
// import { TextIcon, Spacer } from '../styled';
// var moment = require('moment');  
import moment from 'moment';
/**
  // [
  //   'EventStartTime', 
  //   'EventEndTime', 
  //   'SetupStartTime', 
  //   'SetupEndTime'
  // ].map(time => !!ev && !!ev[time] && Object.assign(ev, { [time]: timeof(ev[time]) })); */

const dateStandardize = (date) => {
  if (!date) {
    console.log ({ date })
    return null
  }

  if (!moment(date).isValid()) {
    return date
  }
  const converted = moment(date).format('dddd MMM Do, YYYY') 
  // console.log({date, converted});
  return converted;
};

const dateRevert = ev => { 
  if (!ev) { 
    return 
  }

  const object = { ...ev };
  
  const dateProps = ['RecurseEndDate', 'EventDate', 'CustomDate', 'CreateDate', 'ApproveDate', 'CommentDate'];
  const timeProps = ['EventStartTime', 'EventEndTime', 'SetupStartTime', 'SetupEndTime'];

  dateProps.map(date => !!object && !!object[date] && Object.assign(object, { [date]: dateStandardize(object[date])}))
  timeProps.map(time => !!object && !!object[time] && Object.assign(object, { [time]: timeof(object[time])}))


  return object;
}

const timeof = str => {
  const time =  moment.utc(timeToNum(str));
  if (!time.isValid()) {
    return str;
  }
  return time.format('h:mm a');
}

const reportItem =  ({ value, source }) => {

  const bracketTest = /\(([^)]+)\)/g;
  const parms = findMatches(bracketTest, value);
  const parts = value?.split(bracketTest);

  const src = dateRevert(source);

  console.log ({
    src,
    source
  })

  // return <pre>
  //   {JSON.stringify(parms,0,2)}
  // </pre>

  const fixed = parts.map((f) => {
    const match = parms.find((e) => e[1] === f);
    if (match) {
      return src[f];
    }
    return f;
  }).join("");

  return fixed.toString();
}

export default reportItem;
