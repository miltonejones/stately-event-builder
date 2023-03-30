import React from 'react';
import { styled, IconButton, Stack, Box } from '@mui/material';
import {
  APPTYPE, 
} from "../../../machines";
import {
  TextIcon, Nowrap, CardButton
} from "../../../styled";
 
const Layout = styled(Stack)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  borderRight: `solid 1px ${theme.palette.divider}`, 
  height: 'calc(100vh - 52px)',
  backgroundColor: theme.palette.grey[200],
}));
 
const Sidebar = ({ appMenu, handler, demo }) => {

  const buttons = [
    {
      label: 'Events',
      active: ![APPTYPE.ROOM, APPTYPE.USER].some((f) => handler.choice === f),
      icon: 'Bolt',
      activeIcon: 'Bolt',
    },
    {
      label: 'Rooms',
      active: handler.choice === APPTYPE.ROOM,
      action: () =>
        handler.send({
          type: 'LOAD',
          choice: APPTYPE.ROOM,
        }),
        icon: 'MeetingRoomOutlined',
        activeIcon: 'MeetingRoom',
    },
    {
      label: 'Users',
      active: handler.choice === APPTYPE.USER,
      action: () =>
        handler.send({
          type: 'LOAD',
          choice: APPTYPE.USER,
        }),
      icon: 'PeopleOutlined',
      activeIcon: "People"
    },
    {
      // label: 'Users',
      // active: handler.choice === APPTYPE.USER,
      action: appMenu.handleClick,
      icon: 'MoreHoriz',
      activeIcon: "MoreHoriz"
    },
  ];


 return (
  <Layout >
  {buttons.map((btn) => (
    <CardButton
      raised={btn.active}
      elevation={btn.active ? 1 : 0}
      key={btn.label}
      active={btn.active}
      idle={!btn.label}
      onClick={(e) => btn.action && btn.action(e)}
    >
      <Stack sx={{ alignItems: 'center' }}>
        <IconButton
          size="small"
          sx={{
            color: (theme) =>
              btn.active
                ? theme.palette.primary.dark
                : theme.palette.text.primary,
          }}
        >
          <TextIcon icon={btn.active ? btn.activeIcon : btn.icon} />
        </IconButton>
       {!!btn.label && <Nowrap
          bold={btn.active}
          color={btn.active ? 'primary.dark' : 'text.secondary'}
          tiny
        >
          {btn.label}
        </Nowrap>}
      </Stack>
    </CardButton>
  ))}
  <Box sx={{ flexGrow: 1 }} />
  {['init.dormant'].some(demo.state.matches) && (
    <CardButton elevation={0} sx={{ m: 1 }}>
      <Stack sx={{ alignItems: 'center' }}>
        <IconButton>
          <TextIcon icon="HelpOutline" />
        </IconButton>
        <Nowrap variant="caption">Demo</Nowrap>
      </Stack>
    </CardButton>
  )}
</Layout>

 );
}
Sidebar.defaultProps = {};
export default Sidebar;
