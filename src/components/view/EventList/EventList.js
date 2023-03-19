import React from "react";

// import { apiDate } from "../../../util/apiDate";

// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Daytimer from './components/Daytimer/Daytimer';

import { styled, 
  Stack, 
  // IconButton, 
  Card, Box, Collapse, Typography } from "@mui/material";
import { 
  // DateInput, 
  CalendarInput, DateBox } from "../..";
import {
  Nowrap,
  Btn,
  // IconTextField,
  TextIcon,
  TinyButton,
  Columns,
  Spacer,
  Pill,
  Flex,
  Banner
  // Demotip
} from "../../../styled";

import { VIEW } from '../../../machines';
import moment from "moment";
import { useNavigate } from "react-router-dom";

const LineItem = styled(Stack)(({ theme, collapsed }) => ({
  alignItems: collapsed ? "flex-start" : 'center',
  gap: collapsed ? 0 : theme.spacing(1), 
}))

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const EventList = ({ handler, collapsed }) => {
  const navigate = useNavigate();
  const { eventList, state } = handler;
  const { props,  } = state.context;
  // const is = (val) => Array.isArray(val)
  //   ? val.some(state.matches)
  //   : state.matches(val);
  const opened = Boolean(handler.view & VIEW.LIST_SIDEBAR) && handler.props.format === 1;
  const expandedCols = opened ? "275px 1fr" : "0 1fr";

  const width = collapsed ? 'var(--sidebar-width)' : `calc(100vw - ${opened ? 432 : 132}px)`;
  const direction = collapsed ? "column" : "row";
 

  const handleChange = (event, value) => {
    handler.send({
      type: 'CHANGE',
      key: 'format',
      value
    })
  };

  const control = {
    value: handler.props.format,
    onChange: handleChange,
    exclusive: true,
  };


  return (
    <Layout data-testid="test-for-EventList">
      <Collapse in={!!props.showJSON}>
        <pre>{JSON.stringify(eventList, 0, 2)}</pre>
      </Collapse>

 

      <Collapse in={!props.showJSON}>
        {!!eventList && (
          <Columns
            spacing={opened ? 4 : 0}
            sx={{ alignItems: "flex-start" }}
            columns={collapsed ? "300px" : expandedCols}
          >

            
            {!collapsed && <Box sx={{ width: '100%', pt: 1}}>

            <TinyButton icon={!opened ? "KeyboardArrowLeft" : "Close"} deg={opened?0:180} onClick={() => {
                  handler.send({
                    type: 'VIEW',
                    bit: VIEW.LIST_SIDEBAR
                  })
                }} />

              {opened && <CalendarInput handler={handler} />}
              
              </Box>} 

            <Box>

 

              <Card sx={{ m: 1 , width, ml: collapsed ? 0 : 3 }}>

                <Banner   
                  sx={{ 
                    width
                  }}
                >
                  {!collapsed && <Btn variant="contained" endIcon={<TextIcon icon="Menu" />}>
                    Actions
                  </Btn>}
                  <Typography color="inherit">
                    {handler.label}
                  </Typography>
                  <Spacer />
               

                  {!collapsed && <ToggleButtonGroup sx={{ color: "inherit"}} size="small" {...control} >
                    <ToggleButton sx={{ color: "inherit"}} value={1} key="left">
                      <TextIcon icon="FormatListBulleted" />
                    </ToggleButton>,
                    <ToggleButton sx={{ color: "inherit"}}  value={2} key="center">
                      <TextIcon icon="CalendarMonth" />
                    </ToggleButton>
                  </ToggleButtonGroup>}

                  {!collapsed && <Btn variant="contained" color="warning" endIcon={<TextIcon icon="Add" />}>
                    Create Event
                  </Btn>}

                 {!!collapsed &&  <TinyButton color="inherit" icon="Close" onClick={() => {
                    handler.send({
                      type: 'VIEW',
                      bit: VIEW.FORM_SIDEBAR
                    })
                  }} />}
                </Banner>

{/*  
                  <Collapse in={handler.props.format === 2}>
                  
                  horizontal date picker
                  
                  </Collapse> */}


          

            <Box sx={{
                  height: 'calc(100vh - 124px)',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width 
                }}>

                {handler.props.format === 2 && <Daytimer handler={handler} />}

              {handler.props.format  === 1 && eventList?.map((ev) => (
                <Stack
                  sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                    width
                  }}
                >
                  <LineItem direction={direction} collapsed={collapsed}>
                    <Flex spacing={1}>
                    {ev.categories?.map(c => <Pill  color={c.color}>{c.title}</Pill>)}
                    </Flex>
                    <Nowrap
                      onClick={() => navigate(`/edit/${ev.ID}`)}
                      hover
                      
                      selected={Number(ev.ID) === Number(handler.ID) ? 1 : 0}
                      bold={!!ev.RecurseEndDate}
                    >
                      {ev.EventName} 
                    </Nowrap>

                    <Nowrap variant="caption" muted>
                      {ev.RoomNames}
                    </Nowrap>

                    <Spacer />
                    <DateBox collapsed={collapsed} event={ev} />
                  </LineItem>

                  <LineItem direction={direction} collapsed={collapsed}>
                  {!collapsed && <Nowrap sx={{maxWidth: '50vw'}} small>{ev.Comments}</Nowrap>}
                    <Spacer />
                    <Typography variant="caption">
                      {moment("2022-08-22T" + ev.EventStartTime).format(
                        "h:mm a"
                      )}{" "}
                      to{" "}
                      {moment("2022-08-22T" + ev.EventEndTime).format("h:mm a")}
                    </Typography>
                  </LineItem>
                </Stack>
              ))}

              
                </Box>
              </Card>


            </Box>
          </Columns>
        )}
      </Collapse>
    </Layout>
  );
};
EventList.defaultProps = {};
export default EventList;
