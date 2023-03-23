// import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';

// import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

import { 
  LinearProgress, Box, Card, Alert,  
  createTheme, 
  ThemeProvider, 
  useTheme,
   Snackbar, IconButton, Stack, Typography, styled } from "@mui/material";

import {
  BrowserRouter,
  Routes,
  Route, 
  useNavigate
} from "react-router-dom";


import { themeTypes } from './colors';

 
import { DiagnosticsMenu, AppsMenu, Diagnostics, EventForm, UserMenu, PageTitle, RoomList, DemoStepper, 
  UserList, EventList, AuthForm, EventSearch, ThemeMenu } from './components';
import { APPTYPE, VIEW, useMenu, useAmplify, useProfile, useEventList, useUserList, useSimpleList, useDemo, useRoomList, useEventSearch } from './machines';
// import { objectPath } from './util/objectPath';
import {  BacklessDrawer, Columns, Waiting, Nowrap, Btn, TinyButton, TextIcon, Warn, Flex } from './styled'; 
  
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
  const authenticator = useAmplify();
  const profile = useProfile(user => authenticator.send({
    type: 'UPDATE',
    user
  }))
  const defaultTheme = useTheme();
  const appslist = useSimpleList();
  const navigate = useNavigate();
  const users = useUserList() ;
  const rooms = useRoomList() ;
  const events = useEventList() ;
  const search = useEventSearch(); 
  const palette = useMenu(val => !!val && events.send({
    type: 'CHANGE',
    key: 'theme',
    value: val
  }));
  const diagnosis =  useMenu(val => events.send({
    type: 'CHANGE',
    key: 'active_machine',
    value: val
  }));


  const demo = useDemo(events, appslist, search.send, authenticator.send)

  const debuggableMachines = [events, demo, authenticator];
  const themeType = themeTypes[events.props.theme];


  // return <pre>{JSON.stringify(defaultTheme,0,2)}</pre>

  const theme = createTheme({
    palette: {
      text: {
        primary: "#393939"
      },
      primary: themeType,
      secondary: defaultTheme.palette[['default','primary'].some(f => events.props.theme === f) ? 'secondary' :  'primary']
    },
    button:{
      textTransform: "capitalize"
    },
    typography: {
      lineHeight: '.1rem',
      letterSpacing: '0.025rem', 
      fontFamily: [ 
        'Archivo',
        'Inconsolata',
        'Sono',
        'Lato',
        '"Roboto Slab"',
        '"Segoe UI"',
        '"Helvetica Neue"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  }); 

  if (!authenticator.state.matches('signed_in')) {
    return <ThemeProvider theme={theme}>
    <PageTitle handler={{
      pagename: "Home",
      label: "Please log in"
    }} />
    <AuthForm handler={authenticator} demo={demo}/>
    </ThemeProvider>
  }


  const buttons = [
    {
      label: 'Events',
      active: ![APPTYPE.ROOM, APPTYPE.USER].some(f => appslist.choice === f),
      icon: 'Bolt'
    },
    {
      label: 'Rooms',
      active: appslist.choice === APPTYPE.ROOM,
      action: () => appslist.send({
        type: 'LOAD',
        choice: APPTYPE.ROOM
      }),  
      icon: 'MeetingRoom'
    },
    {
      label: 'Users',
      active: appslist.choice === APPTYPE.USER,
      action: () => appslist.send({
        type: 'LOAD',
        choice: APPTYPE.USER
      }), 
      icon: 'Group'
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

  const navigation = events.is(['editing', 'saving']) ? controls : buttons;

  const opened = Boolean(events.view & VIEW.FORM_SIDEBAR) && events.props.format === 1;
  const expandedCols = opened ? "80px var(--sidebar-width) 1fr" : "80px 24px 1fr";
  const spacer = !(events.props.format === 1 && Boolean(events.view & VIEW.LIST_SIDEBAR)) ? "180px" : "310px";

  

  
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
<PageTitle handler={events} />
    {/* {JSON.stringify(events.state.value)} */}
 
{!events.props.informed && !authenticator.admin && <Warn filled severity="warning" onDismiss={() => {
  events.send({
    type: 'CHANGE',
    key: 'informed',
    value: 1
  })
}}>You are logged in as Guest. Some features may be disabled.</Warn>}
{['init.tick', 'init.tock', 'init.waiting'].some(demo.state.matches) && <Stack  sx={{
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  display: 'flex',
  backgroundColor: 'rgba(0,0,0,0.12)',
  alignItems: 'center',
  zIndex: 25,
  justifyContent: 'center',
  
}}  > 
<Box sx={{ fontSize: '3rem', }}>automated demo  starts in  {demo.ticks}</Box>
<Btn onClick={() => demo.send('CANCEL')} variant="contained">Cancel</Btn>
</Stack>}
<Waiting handler={events} />

    <Columns 
    columns={events.is(['editing', 'saving']) ? `80px var(--sidebar-width) 1fr 64px` : `80px ${spacer} 1fr  64px`} 
      sx={{
      p: 1, backgroundColor: t => t.palette.primary.dark,  
      color: t=> t.palette.common.white
      }} spacing={1}>

    <Box sx={{ width: 64, textAlign: 'center'}}>   <AppsMenu 
        handler={appslist}
        groups={events.groups} 
        samples={events.eventList} 
    
    /> </Box>

      <Typography variant="body1">
      <b>EventBuilder 8 <sup>beta</sup></b>
      </Typography>


    <EventSearch handler={search} 
      onValueSelected={e => !!e && navigate(`/edit/${e.ID}`) }
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
 
      <UserMenu diagnosis={diagnosis} handler={authenticator} profile={profile} palette={palette} app={events} />
 
    </Columns>
  
          <ThemeMenu handler={palette} />

        <DiagnosticsMenu 
          menu={diagnosis} 
          machines={debuggableMachines} 
          handler={events} 
          value={events.props.active_machine}  
          />

    {events.busy && <LinearProgress variant="indeterminate" />}

{/* <pre>

[{JSON.stringify(defaultTheme,0,2)}]
</pre> */}
      <Columns 
        sx={{alignItems: 'flex-start'}} 
        columns={events.is(['editing', 'saving']) ? expandedCols : "72px 100vw"}>


        <Stack sx={{ pb: 2, borderRight: 1, borderColor: 'divider', height: '100%', backgroundColor: t => t.palette.grey[200]}}>
          {navigation.map(btn => (
            <Ctrl raised={btn.active} elevation={btn.active ? 1 : 0} key={btn.label} active={btn.active}  
            onClick={() => btn.action && btn.action()}>
            <Stack sx={{ alignItems: 'center'}}>
            <IconButton 
              size="small"
              sx={{ color: theme => btn.active ? theme.palette.primary.dark : theme.palette.text.primary}}
              >
              <TextIcon icon={btn.icon}  />
            </IconButton>
              <Nowrap color={
                btn.active ? "primary.dark" : "text.primary"
              }  variant="caption">{btn.label}</Nowrap>
          </Stack>
            </Ctrl>
          ))}
          <Box  sx={{flexGrow: 1}}/>
         {['init.dormant'].some(demo.state.matches) &&  <Ctrl elevation={0} sx={{ m: 1}}>
          <Stack sx={{ alignItems: 'center'}}>
            <IconButton  >
              <TextIcon icon="Help"  />
            </IconButton>
            <Nowrap variant="caption">Demo</Nowrap>
          </Stack>
          </Ctrl> }
        </Stack>


    {['listing', 'searching', 'editing', 'saving'].some(events.state.matches) && 
      !(!opened && events.is(['editing', 'saving'])) && 
        <EventList search={search} appslist={appslist} reports={events.reports} collapsed={events.is(['editing', 'saving'])} handler={events} /> }

    {(!opened && events.is(['editing', 'saving'])) && <Flex sx={{m: 1}}>
    <TinyButton icon="KeyboardArrowRight" onClick={() => {
      events.send({
        type: 'VIEW',
        bit:  VIEW.FORM_SIDEBAR
      })
    }} />
      </Flex>}

    
    {events.is(['editing', 'saving']) && <EventForm handler={events} disabled={!authenticator.admin} />}
      </Columns>



     {debuggableMachines.map(mac =>  <Diagnostics key={mac.diagnosticProps.id} handler={events} {...mac.diagnosticProps} /> )}

      <BacklessDrawer anchor="bottom" open={demo.drawer}>
        <Box sx={{ p: 2}}>
          <DemoStepper step={demo.step} handler={demo} />
          <Flex spacing={1}>
            <Typography variant="body1">{demo.text}</Typography>
            <Typography color="error" variant="subtitle2">{demo.paused ? "PAUSED" : <>in {demo.ticks} secs.</>}</Typography> 
            <Btn size="small" variant="contained" onClick={() => demo.send(demo.paused ? "RESUME" : "PAUSE")}>{demo.paused ? "Resume" : "Pause"}</Btn>
            <Btn size="small" variant="outlined" color="error" onClick={() => demo.send('QUIT')}>quit</Btn>
          </Flex>
        </Box>
      </BacklessDrawer>
      
    <RoomList handler={rooms} disabled={!authenticator.admin} />
    <UserList handler={users} disabled={!authenticator.admin} />


      <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'right' }} open={demo.open}>
        <Alert severity="info" sx={{ maxWidth: 300 }}>
          {demo.message}
        </Alert>
      </Snackbar>
    </div>
    </ThemeProvider>
  );
}

const Ctrl = styled(Card)(({ theme, warning, active }) => ({
  backgroundColor: active ? theme.palette.common.white : (warning ? theme.palette.warning.main : theme.palette.grey[200]),
  color: active || warning ? theme.palette.common.white : theme.palette.text.main,
  margin: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.1s linear',
  // outline: active ? "solid 2px red" : "",
  '&:hover': {
    outline: active ? "" : 'solid 2px ' + theme.palette.primary.dark,
    outlineOffset: 2
  }
}))

export default App;
