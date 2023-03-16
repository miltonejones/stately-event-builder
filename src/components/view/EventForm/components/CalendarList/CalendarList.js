import React from 'react';
import { styled, Switch, Card, Box } from '@mui/material';
import { Flex, Banner, Nowrap } from "../../../../../styled";

const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
}));
 
const CalendarList = ({ handler, value, handleChange }) => {
  const onChange = (Calendar) => {
    const calendar = {
      Calendar,
      Eventfk: handler.eventProp.ID
    };

    const updatedProp = value.find(f => f.Calendar === Calendar)
      ? value.filter(f => f.Calendar !== Calendar)
      : value.concat(calendar);
      
      handleChange('calendars', updatedProp);
  }
  return (
  <Layout>
    <Banner disabled><Nowrap small bold><b>Calendars</b></Nowrap></Banner>
    <Box sx={{ m: 1 }}>
    {handler.calendars.map(cat => (
      <Flex onClick={() => onChange(cat.id)}  key={cat.id}>
        <Switch checked={value.find(f => Number(f.Calendar) === Number(cat.id))} /> 
        <Nowrap muted small>{cat.calendar_name}</Nowrap>
      </Flex>
    ))} 
    </Box>
  </Layout>
  );
}
CalendarList.defaultProps = {};
export default CalendarList;
