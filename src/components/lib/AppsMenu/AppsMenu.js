import React from 'react';
import {
  styled,
  Stack,
  LinearProgress,
  Drawer,
  IconButton,
  Box,
  Typography,
} from '@mui/material';

import { Tooltag, Columns, Nowrap, Flex, TextIcon } from '../../../styled';

import AppsFooter from './components/AppsFooter/AppsFooter';
import AppsHeader from './components/AppsHeader/AppsHeader';
import Rooms from './apps/Rooms/Rooms';
import Categories from './apps/Categories/Categories';
import Calendars from './apps/Calendars/Calendars';
import Reports from './apps/Reports/Reports';
import Amenities from './apps/Amenities/Amenities';
import Users from './apps/Users/Users';

const AppButton = styled(IconButton)(({ theme, color, dark }) => ({
  color: theme.palette[color][dark ? 'dark' : 'main'],
}));

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  minWidth: 360,
  minHeight: 300,
}));

const AppsMenu = ({ menu, user, handler, domain, samples, groups }) => {
  const { group } = user;

  // const menu = useMenu((choice) => {
  //   choice !== undefined &&
  //     handler.send({
  //       type: 'LOAD',
  //       choice,
  //     });
  // });

  const apps = [
    {
      label: 'Categories',
      icon: 'Class',
      color: 'warning',
      component: Categories,
      anchor: 'left',
      singular: 'category',
      labelfield: 'title',
      description:
        'Categories can be addded to events to help identify them more easily.',
    },
    {
      label: 'Reports',
      icon: 'Summarize',
      color: 'success',
      component: Reports,
      singular: 'report',
      labelfield: 'title',
    },
    {
      label: 'Calendars',
      icon: 'CalendarMonth',
      color: 'info',
      anchor: 'left',
      component: Calendars,
      singular: 'event calendar',
      labelfield: 'calendar_name',
    },
    {
      label: 'Amenities',
      icon: 'Tune',
      color: 'error',
      component: Amenities,
      anchor: 'left',
      singular: 'amenity',
    },
    {
      label: 'Users',
      icon: 'People',
      color: 'warning',
      dark: true,
      component: Users,
      singular: 'user',
      labelfield: 'FirstName',
      description:
        'User access to EventBuilder is managed by credentials which you can edit here. Click any user ' +
        'name to edit the settings for that person or use the menu in the toolbar to add a new user.',
    },
    {
      label: 'Rooms',
      icon: 'MeetingRoom',
      color: 'info',
      dark: true,
      component: Rooms,
      singular: 'room',
      labelfield: 'RoomName',
      description:
        "Rooms are locations in your facility where events can happen, whether or not they are physical 'rooms'.  " + 
        "Rooms may exist inside any other room other than themselves are one of their child rooms.",
    },
  ];

  const setting = {
    label: 'Instances',
    icon: 'AppRegistration',
    color: 'success',
    // dark: true,
  };
  return (
    <>
      <Tooltag
        component={IconButton}
        title="Open apps menu"
        caption="Show EventBuilder applications"
        color="inherit"
        onClick={menu.handleClick}
      >
        <TextIcon icon="Apps" />
      </Tooltag>

      {/* application containers */}
      {apps.map((app, i) => {
        const Component = app.component;
        return (
          <Drawer
            key={i}
            open={handler.choice === i}
            onClose={() => handler.send('CLOSE')}
            anchor={app.anchor || 'bottom'}
          >
            <AppsHeader
              {...app}
              handler={handler}
              handleClose={(e) => {
                handler.send('CLOSE');
                !handler.is('editing.work') && menu.handleClick(e);
              }}
            />
            {/* {JSON.stringify(handler.state.value)} */}
            {handler.busy && <LinearProgress />}

            {handler.is('idle') && !!app.description && (
              <Stack sx={{ p: 2, maxWidth: '100%', mb: 2 }}>
                <Nowrap bold>{app.label}</Nowrap>
                <Typography
                  sx={{
                    lineHeight: 1.2,
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                  }}
                >
                  {app.description}
                </Typography>
              </Stack>
            )}

            {!!Component && (
              <Component handler={handler} samples={samples} groups={groups}>
                <AppsFooter handler={handler} anchor={app.anchor} />
              </Component>
            )}

            {!Component && <pre> {JSON.stringify(handler.items, 0, 2)}</pre>}
          </Drawer>
        );
      })}

      <Drawer
        onClose={menu.handleClose()}
        anchor="left"
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
      >
        <Layout data-testid="test-for-AppsMenu">
          <AppsHeader
            icon="Apps"
            label="Applications"
            handleClose={menu.handleClose()}
          />

          <Stack sx={{ p: (t) => t.spacing(2) }} spacing={1}>
            <Nowrap variant="h6">Apps</Nowrap>
            <Columns spacing={2}>
              {apps.map((app, i) => (
                <AppCard
                  app={app}
                  key={app.label}
                  onClick={menu.handleClose(i)}
                />
              ))}
              {group === 'Admins' && (
                <AppCard
                  onClick={() => {
                    domain.send('OPEN');
                    menu.handleClose()();
                  }}
                  app={setting}
                />
              )}
            </Columns>
          </Stack>
        </Layout>
      </Drawer>
    </>
  );
};
AppsMenu.defaultProps = {};
export default AppsMenu;

const AppCard = ({ app, onClick }) => {
  return (
    <Flex
      spacing={1}
      key={app.label}
      sx={{
        borderRadius: 1,
        cursor: 'pointer',
        pr: 1,
        '&:hover': {
          outline: (t) => `solid 2px ${t.palette[app.color].main}`,
        },
      }}
      onClick={onClick}
    >
      <AppButton color={app.color} dark={app.dark}>
        <TextIcon icon={app.icon} />
      </AppButton>
      <Nowrap variant="body2" hover>
        {app.label}
      </Nowrap>
    </Flex>
  );
};
