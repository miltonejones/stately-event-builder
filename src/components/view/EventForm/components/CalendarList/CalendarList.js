import React from 'react';
import { styled, Collapse, Card, Stack, Box } from '@mui/material';
import { Flex, Btn, GridFormHeader, Check, TinyButton, Nowrap } from "../../../../../styled";
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
        <Flex spacing={1}>
        <Btn variant="contained"
          onClick={() =>  {
            handleChange('calendars', []);
            handler.setProp('dropcal', false);
          }}
         >Yes</Btn>
         <Btn
          onClick={() =>  handler.setProp('dropcal', false)}
         >No</Btn>
        </Flex>
        </Box>
    </Collapse>
 
    <Collapse in={expanded && !handler.props.dropcal}>
      <Stack spacing={1}>
        {handler.calendars.map(cat => (
          <Flex spacing={1} onClick={() => onChange(cat.id)}  key={cat.id}>
            <Check on={value.find(f => Number(f.Calendar) === Number(cat.id))} />
            {/* <Switch checked={value.find(f => Number(f.Calendar) === Number(cat.id))} />  */}
            <Nowrap bold={value.find(f => Number(f.Calendar) === Number(cat.id))} muted small>{cat.calendar_name}</Nowrap>
          </Flex>
        ))} 
      </Stack>  
    </Collapse>

  </Layout>
  );
}
CalendarList.defaultProps = {};
export default CalendarList;
