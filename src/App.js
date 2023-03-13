// import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';

// import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

import { 
  LinearProgress, Box, Card, Alert,  
   Snackbar, IconButton, Stack, Typography, styled } from "@mui/material";

import {
  BrowserRouter,
  Routes,
  Route, 
  useNavigate
} from "react-router-dom";



 
import { EventForm, RoomList, DemoStepper, UserList, EventList, AuthForm, EventSearch } from './components';
import { VIEW, useAmplify, useEventList, useUserList, useDemo, useRoomList, useEventSearch } from './machines';
// import { objectPath } from './util/objectPath';
import {  BacklessDrawer, Columns, Nowrap, Btn, TinyButton, TextIcon,  Flex } from './styled'; 
  
Amplify.configure(awsExports);


function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="/list/*" element={<Application />} />
        <Route path="/find/*" element={<Application />} />
        <Route path="/edit/:id" element={<Application />} /> 
      </Routes>
    </BrowserRouter>
  );
}




function Application() { 
  const authenticator = useAmplify()
  const navigate = useNavigate();
  const users = useUserList() ;
  const rooms = useRoomList() ;
  const events = useEventList() ;
  const search = useEventSearch()
  const demo = useDemo(events, rooms.send, search.send)


  if (!authenticator.state.matches('signed_in')) {
    return <>
    {/* {JSON.stringify(authenticator.state.value)} */}
    <AuthForm handler={authenticator} />
    </>
  }


  const buttons = [
    {
      label: 'Events',
      active: !(rooms.open || users.open),
      icon: 'Bolt'
    },
    {
      label: 'Rooms',
      active: rooms.open,
      action: () => rooms.send('OPEN'),
      icon: 'MeetingRoom'
    },
    {
      label: 'Users',
      active: users.open,
      action: () => users.send('OPEN'),
      icon: 'Group'
    },
    {
      label: 'Calendars', 
      icon: 'CalendarMonth'
    },
  ]
  const controls = [
    {
      label: 'Back',
      icon: "KeyboardArrowLeft",
      action: () => navigate('/list')
    },
    {
      label: 'Delete',
      icon: "Delete"
    },
    {
      label: 'Save',
      warning: 1,
      icon: "Save"
    },
  ]

  const navigation = events.state.matches('editing') ? controls : buttons;

  const opened = Boolean(events.view & VIEW.FORM_SIDEBAR);
  const expandedCols = opened ? "80px var(--sidebar-width) 1fr" : "80px 24px 1fr";
  const spacer = ['init.dormant'].some(demo.state.matches) ? "60px" : "30px";

  

  
  return (
    <div className="App">



{['init.tick', 'init.tock', 'init.waiting'].some(demo.state.matches) && <Stack  sx={{
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  display: 'flex',
  backgroundColor: 'rgba(0,0,0,0.12)',
  alignItems: 'center',
  zIndex: 25,
  justifyContent: 'center',
  
}}  onClick={() => demo.send('CANCEL')}> 
<Box sx={{ fontSize: '3rem', }}>automated demo  starts in  {demo.ticks}</Box>
<Btn variant="contained">Cancel</Btn>
</Stack>}


    <Columns columns={events.state.matches('editing') ? `80px var(--sidebar-width) 1fr ${spacer}` : `80px 310px 1fr ${spacer}`} sx={{
      p: 1, backgroundColor: t => t.palette.primary.dark,  
      color: t=> t.palette.common.white
      }} spacing={1}>

    <Box sx={{ width: 64, textAlign: 'center'}}>   <TextIcon icon="Menu"  /></Box>

      <Typography variant="body1">
      <b>EventBuilder 8 (beta)</b>
      </Typography>


    <EventSearch handler={search}
      onValueSelected={e => navigate(`/edit/${e.ID}`) }
    />

  



      {/* {navigation.map(btn => <Btn 
        onClick={() => btn.action && btn.action()}
        size="small"
        startIcon={!btn.icon ? null : <TextIcon icon={btn.icon} />}
        variant={btn.active ? "contained" : "text"}
        key={btn.label}>{btn.label}</Btn>)} */}
{/* 
    <Spacer />   


{objectPath(events.state.value)} */}

    <Flex sx={{ justifyContent: 'flex-end'}} spacing={1}>


      { ['init.dormant'].some(demo.state.matches) &&  <TextIcon icon="Help"  
        onClick={() => demo.send('START')}
        />}


        <TextIcon icon="Code"  
          onClick={() => {
            events.send({
            type: 'CHANGE',
            key: 'showJSON',
            value: !events.props.showJSON
          })
        }}
          />


    </Flex>
    </Columns>
  
    {events.busy && <LinearProgress variant="indeterminate" />}

{/* <pre>

[{JSON.stringify(authenticator.state.value,0,2)}]
[{JSON.stringify(authenticator.user,0,2)}]
</pre> */}
      <Columns 
        sx={{alignItems: 'flex-start'}} 
        columns={events.state.matches('editing') ? expandedCols : "80px 100vw"}>
        <Stack sx={{ borderRight: 1, borderColor: 'divider', height: '100%', backgroundColor: t => t.palette.grey[5]}}>
          {navigation.map(btn => (
            <Ctrl raised={btn.active} elevation={btn.active ? 2 : 0} key={btn.label}    sx={{m: 1}} 
            onClick={() => btn.action && btn.action()}>
            <Stack sx={{ alignItems: 'center'}}>
            <IconButton sx={{ color: theme => btn.active ? theme.palette.primary.dark : theme.palette.text.main}}>
              <TextIcon icon={btn.icon}  />
            </IconButton>
              <Nowrap color={
                btn.active ? "primary.dark" : "text.primary"
              } bold={btn.active  || btn.warning} variant="caption">{btn.label}</Nowrap>
          </Stack>
            </Ctrl>
          ))}
        </Stack>


    {['listing', 'searching', 'editing'].some(events.state.matches) && 
      !(!opened && events.state.matches('editing')) && 
        <EventList collapsed={events.state.matches('editing')} handler={events} /> }

    {(!opened && events.state.matches('editing')) && <Flex sx={{m: 1}}>
    <TinyButton icon="KeyboardArrowRight" onClick={() => {
      events.send({
        type: 'VIEW',
        bit:  VIEW.FORM_SIDEBAR
      })
    }} />
      </Flex>}

    
    {['editing'].some(events.state.matches) && <EventForm handler={events} />}
      </Columns>




      <BacklessDrawer anchor="bottom" open={demo.drawer}>
        <Box sx={{ p: 2}}>
          <DemoStepper step={demo.step} />
          <Flex spacing={1}>
            <Typography variant="body1">{demo.text}</Typography>
            <Typography color="error" variant="subtitle2">{demo.paused ? "PAUSED" : <>in {demo.ticks} secs.</>}</Typography> 
            <Btn variant="contained" onClick={() => demo.send(demo.paused ? "RESUME" : "PAUSE")}>{demo.paused ? "Resume" : "Pause"}</Btn>
          </Flex>
        </Box>
      </BacklessDrawer>
    <RoomList handler={rooms} />
    <UserList handler={users} />


      <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'right' }} open={demo.open}>
        <Alert severity="info" sx={{ maxWidth: 300 }}>
          {demo.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

const Ctrl = styled(Card)(({ theme, warning, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : (warning ? theme.palette.warning.main : theme.palette.common.white),
  color: active || warning ? theme.palette.common.white : theme.palette.text.main,
  // outline: active ? "solid 2px red" : "",
  '&:hover': {
    outline: active ? "" : 'solid 2px ' + theme.palette.primary.dark
  }
}))

export default App;
