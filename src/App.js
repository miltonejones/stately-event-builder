// import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';

// import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

import ListSettings from './components/view/EventList/components/ListSettings/ListSettings';
import {
  LinearProgress,
  Box,
  // Card,
  Alert,
  createTheme,
  ThemeProvider,
  useTheme,
  Snackbar,
  // IconButton,
  Stack,
  Typography,
  // styled,
} from '@mui/material';

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import { themeTypes } from './colors';

import {
  DiagnosticsMenu,
  AppsMenu,
  Diagnostics,
  EventForm,
  UserMenu,
  PageTitle,
  // RoomList,
  DemoStepper,
  // UserList,
  DomainManager,
  EventList,
  AuthForm,
  EventSearch,
  ThemeMenu,
  Sidebar,
} from './components';
import {
  // APPTYPE,
  VIEW,
  useMenu,
  useAmplify,
  useProfile,
  useEventList,
  // useUserList,
  useSimpleList,
  useDemo,
  useDomain,
  useEventSearch,
} from './machines';
// import { objectPath } from './util/objectPath';
import {
  // BacklessDrawer,
  Columns,
  Waiting,
  Nowrap,
  Btn,
  TinyButton,
  // TextIcon,
  Warn,
  Flex,
} from './styled';

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
  const profile = useProfile((user) =>
    authenticator.send({
      type: 'UPDATE',
      user,
    })
  );
  const defaultTheme = useTheme();
  const appslist = useSimpleList();
  const navigate = useNavigate();
  const domain = useDomain();
  // const users = useUserList();
  // const rooms = useRoomList();
  const events = useEventList();
  const search = useEventSearch();
  const settings = useMenu(console.log);
  const palette = useMenu(
    (val) =>
      !!val &&
      events.send({
        type: 'CHANGE',
        key: 'theme',
        value: val,
      })
  );
  const diagnosis = useMenu((val) =>
    events.send({
      type: 'CHANGE',
      key: 'active_machine',
      value: val,
    })
  );
  const appMenu = useMenu((choice) => {
    choice !== undefined &&
    events.send({
        type: 'LOAD',
        choice,
      });
  });


  const demo = useDemo(events, appslist, search.send, authenticator.send);

  const debuggableMachines = [events, demo, authenticator];
  const themeType = themeTypes[events.props.theme];

  // return <pre>{JSON.stringify(defaultTheme,0,2)}</pre>

  const theme = createTheme({
    palette: {
      text: {
        primary: '#393939',
      },
      primary: themeType,
      secondary:
        defaultTheme.palette[
          ['default', 'primary'].some((f) => events.props.theme === f)
            ? 'secondary'
            : 'primary'
        ],
    },
    button: {
      textTransform: 'capitalize',
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
    return (
      <ThemeProvider theme={theme}>
        <PageTitle
          handler={{
            pagename: 'Home',
            label: 'Please log in',
          }}
        />
        <AuthForm handler={authenticator} source={events} demo={demo} />
      </ThemeProvider>
    );
  }

  // const buttons = [
  //   {
  //     label: 'Events',
  //     active: ![APPTYPE.ROOM, APPTYPE.USER].some((f) => appslist.choice === f),
  //     icon: 'Bolt',
  //     activeIcon: 'Bolt',
  //   },
  //   {
  //     label: 'Rooms',
  //     active: appslist.choice === APPTYPE.ROOM,
  //     action: () =>
  //       appslist.send({
  //         type: 'LOAD',
  //         choice: APPTYPE.ROOM,
  //       }),
  //       icon: 'MeetingRoomOutlined',
  //       activeIcon: 'MeetingRoom',
  //   },
  //   {
  //     label: 'Users',
  //     active: appslist.choice === APPTYPE.USER,
  //     action: () =>
  //       appslist.send({
  //         type: 'LOAD',
  //         choice: APPTYPE.USER,
  //       }),
  //     icon: 'PeopleOutlined',
  //     activeIcon: "People"
  //   },
  // ];
  // const controls = [
  //   {
  //     label: 'Back',
  //     icon: 'KeyboardArrowLeft',
  //     action: () => navigate('/list'),
  //   },
  //   {
  //     label: 'Delete',
  //     icon: 'Delete',
  //   },
  //   {
  //     label: 'Save',
  //     warning: 1,
  //     icon: 'Save',
  //   },
  // ];

  // const navigation = events.is(['editing', 'saving']) ? controls : buttons;

  const opened =
    Boolean(events.view & VIEW.FORM_SIDEBAR) && events.props.format === 1;
  const expandedCols = opened
    ? '80px var(--sidebar-width) 1fr'
    : '80px 24px 1fr';
  const spacer = !(
    events.props.format === 1 && Boolean(events.view & VIEW.LIST_SIDEBAR)
  )
    ? '180px'
    : '310px';

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <PageTitle handler={events} />
        {/* {JSON.stringify(events.state.value)} */}

        {/* {JSON.stringify(events.state.nextEvents)} */}
        {!events.props.informed && !authenticator.admin && (
          <Warn
            filled
            severity="warning"
            onDismiss={() => {
              events.send({
                type: 'CHANGE',
                key: 'informed',
                value: 1,
              });
            }}
          >
            You are logged in as Guest. Some features may be disabled.
          </Warn>
        )}
        {['init.tick', 'init.tock', 'init.waiting'].some(
          demo.state.matches
        ) && (
          <Stack
            sx={{
              width: '100vw',
              height: '100vh',
              position: 'absolute',
              display: 'flex',
              backgroundColor: 'rgba(0,0,0,0.12)',
              alignItems: 'center',
              zIndex: 25,
              justifyContent: 'center',
            }}
          >
            <Box sx={{ fontSize: '3rem' }}>
              automated demo starts in {demo.ticks}
            </Box>
            <Btn onClick={() => demo.send('CANCEL')} variant="contained">
              Cancel
            </Btn>
          </Stack>
        )}

        <Waiting handler={events} />

        <Columns
          columns={
            events.is(['editing', 'saving'])
              ? `80px var(--sidebar-width) 1fr 48px`
              : `80px ${spacer} 1fr 48px`
          }
          sx={{
            p: 1,
            backgroundColor: (t) => t.palette.primary.dark,
            color: (t) => t.palette.common.white,
          }}
          spacing={1}
        >
          <Box sx={{ width: 64, textAlign: 'center' }}>
            {' '}
            <AppsMenu
              menu={appMenu}
              user={authenticator.user}
              domain={domain}
              handler={appslist}
              groups={events.groups}
              samples={events.eventList}
            />{' '}
          </Box>

          <Stack>
            <Nowrap sx={{ lineHeight: 1, fontSize: '0.75rem' }} small>EventBuilder 8</Nowrap>
            <Typography sx={{ lineHeight: 1, letterSpacing: '.061em', fontSize: '0.85rem', fontWeight: 900 }} variant="body1">
              <b>
                {events.whois?.InstanceName || "EventBuilder 8"}
                {/* <sup>beta</sup> */}
              </b>
            </Typography>
          </Stack>

          <EventSearch
            handler={search}
            settings={settings}
            onValueSelected={(e) => !!e && navigate(`/edit/${e.ID}`)}
          /> 

          <UserMenu
            diagnosis={diagnosis}
            handler={authenticator}
            domain={domain}
            profile={profile}
            palette={palette}
            app={events}
          />
        </Columns>

        <ThemeMenu handler={palette} />

        <DiagnosticsMenu
          menu={diagnosis}
          machines={debuggableMachines}
          handler={events}
          value={events.props.active_machine}
        />

        {events.busy && <LinearProgress variant="indeterminate" />}


        <Columns
          sx={{ alignItems: 'flex-start' }}
          columns={
            events.is(['editing', 'saving']) ? expandedCols : '72px 1fr'
          }
        >

          {/* navigation sidebar */}
          <Sidebar handler={appslist} appMenu={appMenu} demo={demo} />
         
          {/* event search results list */}
          {['listing', 'searching', 'editing', 'saving'].some(
            events.state.matches
          ) &&
            !(!opened && events.is(['editing', 'saving'])) && (
              <EventList
                search={search}
                appslist={appslist}
                reports={events.reports}
                collapsed={events.is(['editing', 'saving'])}
                handler={events}
              />
            )}

          {!opened && events.is(['editing', 'saving']) && (
            <Flex sx={{ m: 1 }}>
              <TinyButton
                icon="KeyboardArrowRight"
                onClick={() => {
                  events.send({
                    type: 'VIEW',
                    bit: VIEW.FORM_SIDEBAR,
                  });
                }}
              />
            </Flex>
          )}

          {/* selected event edit form */}
          {events.is(['editing', 'saving']) && (
            <EventForm handler={events} disabled={!authenticator.admin} whois={authenticator} />
          )}
        </Columns>

        {debuggableMachines.map((mac) => (
          <Diagnostics
            key={mac.diagnosticProps.id}
            handler={events}
            {...mac.diagnosticProps}
          />
        ))}
        <ListSettings handler={settings} source={events} />
        <DomainManager handler={domain} source={events}  /> 
        <DemoStepper step={demo.step} handler={demo} /> 

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={demo.open}
        >
          <Alert severity="info" sx={{ maxWidth: 300 }}>
            {demo.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

// const Ctrl = styled(Card)(({ theme, warning, active }) => ({
//   width: 56,
//   height: 56,
//   backgroundColor: active
//     ? theme.palette.common.white
//     : warning
//     ? theme.palette.warning.main
//     : theme.palette.grey[200],
//   color:
//     active || warning ? theme.palette.common.white : theme.palette.text.main,
//   margin: theme.spacing(1),
//   cursor: 'pointer',
//   transition: 'all 0.1s linear',
//   // outline: active ? "solid 2px red" : "",
//   '&:hover': {
//     outline: active ? '' : 'solid 2px ' + theme.palette.primary.dark,
//     outlineOffset: 2,
//   },
// }));

export default App;
