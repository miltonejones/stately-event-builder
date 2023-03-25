import React from 'react';
import { styled, Collapse, Switch, Card, Box } from '@mui/material';
import { Flex, Btn, GridFormHeader, TinyButton, Nowrap } from "../../../../../styled";
import { VIEW } from '../../../../../machines'; 

const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
  padding: theme.spacing(3, 2, 2, 2)
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
  const populated = !!value.length;
  const expanded = populated || (handler.view & VIEW.OPTION_CALENDAR);

  const handleCollapse = () => {
    if (populated) {
      return handler.setProp('dropcal', true);
    }
    handler.setView(VIEW.OPTION_CALENDAR) 
  }

  return (
  <Layout>
    <GridFormHeader 
    title="Calendars"
    icon="CalendarMonth"
    sx={{ mb: expanded ? 2 : 0 }}
    >
      <TinyButton 
        icon={populated ? "Delete" : "KeyboardArrowDown"} 
        deg={expanded && !populated ? 180 : 0}
        onClick={handleCollapse}   />
    </GridFormHeader>

    <Collapse in={handler.props.dropcal}>
        <Box >
         Remove all calendars from this event?
         <Btn
          onClick={() =>  handler.setProp('dropcal', false)}
         >No</Btn>
        </Box>
    </Collapse>

    {/* <Banner disabled><Nowrap small bold><b>Calendars</b></Nowrap></Banner> */}
    <Collapse in={expanded && !handler.props.dropcal}>
      <Box>
        {handler.calendars.map(cat => (
          <Flex onClick={() => onChange(cat.id)}  key={cat.id}>
            <Switch checked={value.find(f => Number(f.Calendar) === Number(cat.id))} /> 
            <Nowrap muted small>{cat.calendar_name}</Nowrap>
          </Flex>
        ))} 
      </Box>  
    </Collapse>

  </Layout>
  );
}
CalendarList.defaultProps = {};
export default CalendarList;
