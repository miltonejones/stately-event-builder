import React from "react";

// import { apiDate } from "../../../util/apiDate";

// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

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
  // Flex,
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
  const opened = Boolean(handler.view & VIEW.LIST_SIDEBAR);
  const expandedCols = opened ? "275px 1fr" : "0 1fr";

  const width = collapsed ? 'var(--sidebar-width)' : `calc(100vw - ${opened ? 432 : 132}px)`;
  const direction = collapsed ? "column" : "row";

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

{/*               
             {!collapsed && <LineItem sx={{ margin: collapsed ? 1 : 0}} direction={direction} collapsed={collapsed} spacing={1}>
                
                <Typography sx={{ mt: 1 }}>Find</Typography>
                {is(["listing", "editing"]) && (
                  <IconTextField
                    endIcon={
                      <TextIcon
                        icon={!params.title ? "Search" : "Close"}
                        onClick={() => {
                          send({
                            type: "FIND",
                            params: {
                              ...params,
                              start_date: apiDate(new Date()),
                              title: null,
                            },
                          });
                        }}
                      />
                    }
                    sx={{ mt: 1, maxWidth: 200 }}
                    label="Event title"
                    placeholder="Type an event name"
                    size="small"
                    value={params.title}
                    onChange={(e) => {
                      send({
                        type: "PARAM",
                        key: "title",
                        value: e.target.value,
                      });
                    }}
                  />
                )}

                <DateInput
                  label="Date"
                  value={params.start_date}
                  setValue={(value) => {
                    send({
                      type: "PARAM",
                      key: "start_date",
                      value: apiDate(new Date(value)),
                    });
                  }}
                />

                <Collapse in={props.showAdvanced} orientation={collapsed ? "vertical" : "horizontal"}>
                  <DateInput
                    value={params.end_date}
                    setValue={(value) => {
                      send({
                        type: "PARAM",
                        key: "end_date",
                        value: apiDate(new Date(value)),
                      });
                    }}
                  />
                </Collapse>

                <Flex spacing={1}>
                <Btn  
                  disabled={!dirty}
                  size="small"
                  variant="contained"
                  onClick={() => {
                    send({
                      type: "FIND",
                      params,
                    });
                  }}
                >
                  search
                </Btn>

                <Btn
                  size="small"
                  endIcon={
                    <TextIcon
                      icon={
                        props.showAdvanced
                          ? "KeyboardArrowDown"
                          : "KeyboardArrowRight"
                      }
                    />
                  }
                  variant={props.showAdvanced ? "contained" : "outlined"}
                  onClick={() => {
                    send({
                      type: "CHANGE",
                      key: "showAdvanced",
                      value: !props.showAdvanced,
                    });
                  }}
                >
                  advanced
                </Btn>
                </Flex>


              </LineItem>} */}


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


                  <Box sx={{
                    height: 'calc(100vh - 124px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    width 
                  }}>


                {eventList?.map((ev) => (
                  <Stack
                    sx={{
                      p: 1,
                      borderBottom: 1,
                      borderColor: "divider",
                      width
                    }}
                  >
                    <LineItem direction={direction} collapsed={collapsed}>
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
