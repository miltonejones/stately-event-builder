import React from "react";

import { getPagination } from "../../../util/getPagination";
 

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Daytimer from './components/Daytimer/Daytimer';
import EventPopover from './components/EventPopover/EventPopover';

import { styled, 
  Stack, Switch, Pagination,
  // IconButton, 
  Card, Box, Collapse, Typography } from "@mui/material";
import { 
  // DateInput, 
  CalendarInput, DateBox, ActionsMenu } from "../..";
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

import { VIEW, useEventPop } from '../../../machines';
import moment from "moment";
import { useNavigate } from "react-router-dom";

const LineItem = styled(Stack)(({ theme, collapsed, spacing=1 }) => ({
  alignItems: collapsed ? "flex-start" : 'center',
  gap: collapsed ? 0 : theme.spacing(spacing), 
}))

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const EventList = ({ handler, collapsed, search, appslist, reports }) => {
  const navigate = useNavigate();
  const { eventList: handlerList, state } = handler;
  const eventList = search?.options?.length ? search.options : handlerList;
  const eventPages = search.pages?.visible ? search.pages :  {visible: handlerList};

  const { props,  } = state.context;

  const popMenu = useEventPop(() => {
    handler.send({
      type: 'FIND',
      params: handler.params
    })
  }); 
  
  const opened = Boolean(handler.view & VIEW.LIST_SIDEBAR) && handler.props.format === 1;
  const expandedCols = opened ? "275px 1fr" : "0 1fr";

  const width = collapsed ? 'var(--sidebar-width)' : `calc(100vw - ${opened ? 432 : 132}px)`;
  const direction = collapsed ? "column" : "row";
 

  const handleChange = (event, value) => {
    handler.setProp('format', value); 
  };

  const control = {
    value: handler.props.format,
    onChange: handleChange,
    exclusive: true,
  };

  const { excluded = [], editmode } = handler.props;
  const exclude = ID => { 
    handler.setProp('excluded', 
      excluded.indexOf(ID) > -1 
        ? excluded.filter(f => f !== ID)
        : excluded.concat(ID))
  }



  return (
    <Layout data-testid="test-for-EventList">
       <EventPopover menu={popMenu} /> 
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

            {/* <TinyButton icon={!opened ? "KeyboardArrowLeft" : "Close"} deg={opened?0:180} onClick={() => {
                  handler.send({
                    type: 'VIEW',
                    bit: VIEW.LIST_SIDEBAR
                  })
                }} /> */}

              <CalendarInput hidden={!opened} onClose={() => {
                  handler.send({
                    type: 'VIEW',
                    bit: VIEW.LIST_SIDEBAR
                  })
                }} handler={handler} />
             
              
              </Box>} 

            <Box>

 

              <Card sx={{ m: 1 , width, ml: collapsed ? 0 : 3 }}>

                <Banner   
                  sx={{ 
                    width
                  }}
                >
                  {!collapsed && <ActionsMenu handler={handler} appslist={appslist} reports={reports} />}

                  <Typography color="inherit">
                    {search.label || handler.label}
                  </Typography>

                  <Spacer />          
                
                {!collapsed && <ToggleButtonGroup sx={{ color: "inherit", 
                  '& .Mui-selected': { 
                    backgroundColor: t => `${t.palette.primary.light} !important`, 
                    color: t => t.palette.common.white  
                    } }} size="small" {...control} >
                    <ToggleButton sx={{ color: "inherit"}} value={1} size="small">
                      <TextIcon icon="FormatListBulleted" />
                    </ToggleButton>,
                    <ToggleButton sx={{ color: "inherit"}}  value={2} size="small">
                      <TextIcon icon="CalendarMonth" />
                    </ToggleButton>
                  </ToggleButtonGroup>}

                  {!collapsed && <Btn size="small" variant="contained" color="warning" endIcon={<TextIcon icon="Add" />}>
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

                      
                  
                  {eventPages.pageCount > 1 && handler.props.format === 1 && <Box sx={{m: 2}}><Pagination
                      count={Number(eventPages.pageCount)}
                      page={search.page} 
                      onChange={(a, num) => search.send({
                        type: 'PAGE',
                        page: num
                      })}
                    /></Box>}
                  

                  {/* [{JSON.stringify(search.pages)}] */}
{/* [{JSON.stringify(search.state.value)}] */}
                  {handler.props.format === 2 && !search.options?.length && <Daytimer popMenu={popMenu} handler={handler} />}

                  {(handler.props.format === 1 || !!search.options?.length) && eventPages.visible?.map((ev) => (
                    <Stack
                      sx={{
                        p: 1,
                        borderBottom: 1,
                        borderColor: "divider",
                        width
                      }}
                    >
                      <LineItem direction={direction} collapsed={collapsed}>
                        
                        {!!editmode && <Switch 
                          onClick={() => exclude(ev.ID)} 
                          checked={!excluded || excluded.indexOf(ev.ID) < 0} 
                          size="small" />}


                        {!!ev.categories?.length && <Flex spacing={1}>
                        {ev.categories?.map(c => <Pill  color={c.color}>{c.title}</Pill>)}
                        </Flex>}


                        <Nowrap
                          onClick={() => {
                            if (editmode) {
                              return exclude(ev.ID);
                            }
                            navigate(`/edit/${ev.ID}`)
                          }}
                          hover
                          muted={excluded?.indexOf(ev.ID) > -1 && editmode} 
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
                       {!collapsed && <TinyButton icon="MoreVert" 

                              onClick={(e) => {
                                popMenu.handleClick(e, ev.ID, ev.CustomDate, true)
                              }}
                          />}
                      </LineItem>

                      <LineItem direction={direction} collapsed={collapsed}>
                      {!collapsed && <Nowrap sx={{maxWidth: '50vw'}} small>{ev.Comments}</Nowrap>}
                        <Spacer />
                           {!!search.options?.length && <Nowrap small bold sx={{mr: 1}}>{moment(ev.CustomDate).format('MMM Do YY')}</Nowrap>}
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
