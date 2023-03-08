import React from 'react'; 
 
import { apiDate } from '../../../util/apiDate';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';



import { styled, Stack, Box, Collapse, Typography } from '@mui/material';
import { DateInput, CalendarInput, DateBox } from '../..';  
import { Nowrap, Btn, IconTextField, 
  TextIcon, Columns, Spacer, Flex } from '../../../styled';




import moment from 'moment';
import { 
  useNavigate, 
} from "react-router-dom";


 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const EventList = ({ handler }) => { 
  const navigate = useNavigate() 
  const { eventList, logo, send, state } = handler;
  const { props, params, dirty } = state.context;
  const is = val => state.matches(val)
  const handleDateChange = date => {
    const start_date = apiDate(new Date(date)) 
    navigate(`/find/start_date/${start_date}`); 
  }

 return (
   <Layout data-testid="test-for-EventList">
    

    <Collapse in={!!props.showJSON}><pre>
        {JSON.stringify(eventList,0,2)}
      </pre>
    </Collapse>

    <Collapse in={!props.showJSON}>

      
    {!!eventList && (
    
    <Columns spacing={4} sx={{alignItems: 'flex-start', mb: 8}} columns="300px 1fr">

        <CalendarInput handler={handler} />
        {/* <Box sx={{p: 1}}>
          <img src={logo} alt="eb" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar  value={dayjs(params.start_date)} onChange={handleDateChange} />
          </LocalizationProvider>
        </Box> */}


        <Box>

          <Flex spacing={1}>
            <Typography sx={{mt:1}}>Find</Typography>
            {is('listing') && <IconTextField 
              endIcon={<TextIcon 
                icon={!params.title ? "Search" : "Close"} 
                onClick={() => {
                  send({
                    type: "FIND",
                    params: {
                      ...params,
                      start_date: apiDate(new Date()),
                      title: null
                    }
                  })
                }} 
              />}
              sx={{ mt:1, maxWidth: 200 }}
              label="Event title"
              placeholder="Type an event name"
              size="small"
              value={params.title} 
              onChange={e => {
                send({
                  type: 'PARAM',
                  key: 'title',
                  value: e.target.value
                })
              }} />}


            <DateInput label="Date" value={params.start_date} setValue={value => { 
              send({
                type: 'PARAM',
                key: 'start_date',
                value: apiDate(new Date(value))
              })
            }}/>

            <Collapse in={props.showAdvanced} orientation="horizontal">
            
            <DateInput value={params.end_date} setValue={value => { 
              send({
                type: 'PARAM',
                key: 'end_date',
                value: apiDate(new Date(value))
              })
            }}/>

            
            </Collapse>

            <Btn
              disabled={!dirty}
              size="small"
              variant="contained"
              onClick={() => {
              send({
                type: 'FIND',
                params 
              })
            }}>search</Btn>
            
            <Btn 
              size="small"
              endIcon={<TextIcon icon={props.showAdvanced?"KeyboardArrowDown":"KeyboardArrowRight"} />}
              variant={props.showAdvanced?"contained":"outlined"}
              onClick={() => {
              send({
                type: 'CHANGE',
                key: 'showAdvanced',
                value: !props.showAdvanced
              })
            }}>advanced</Btn>
          </Flex>

          <Flex sx={{ mt: 1, p: 1, backgroundColor: t => t.palette.primary.main, color: 'white', width: 'calc(100vw - 340px)' }}>
            <Typography color="inherit">{eventList?.length} events</Typography> 
          </Flex>

          {eventList?.map(ev => (
          <Stack sx={{ p: 1, borderBottom: 1, borderColor: 'divider', width: 'calc(100vw - 340px)' }}>

            <Flex spacing={1}> 

            
              <Nowrap 
                onClick={() => navigate(`/edit/${ev.ID}`)}
                hover
                bold={!!ev.RecurseEndDate}
              >{ev.EventName}</Nowrap>
              
              <Nowrap variant="caption" muted>{ev.RoomNames}</Nowrap>
            
            
              <Spacer />
              <DateBox event={ev} /> 
            </Flex>

            <Flex>
              <Nowrap small>{ev.Comments}</Nowrap>
              <Spacer />
              <Typography variant="caption">
                {moment('2022-08-22T'+ev.EventStartTime).format('h:mm a')} to {moment('2022-08-22T'+ev.EventEndTime).format('h:mm a')} 
              </Typography>
            </Flex>
          </Stack>))}

        </Box>


      </Columns>
    
    )}


    </Collapse>


   </Layout>
 );
}
EventList.defaultProps = {};
export default EventList;