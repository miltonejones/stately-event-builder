import React from 'react';
import {
  styled,
  Stack,
  LinearProgress,
  Drawer,
  IconButton,
  Box, 
} from '@mui/material';
import { useMenu, useSimpleList } from '../../../machines';
import {
  Tooltag,
  Columns,
  Nowrap,
  Flex, 
  TextIcon, 
} from '../../../styled';

import AppsFooter from './components/AppsFooter/AppsFooter';
import AppsHeader from './components/AppsHeader/AppsHeader';
import Categories from './apps/Categories/Categories';
import Reports from './apps/Reports/Reports';
import Amenities from './apps/Amenities/Amenities';
import Users from './apps/Users/Users';



const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  minWidth: 360,
  minHeight: 300
}));

 

const AppsMenu = ({ samples, groups }) => {
  const list = useSimpleList();

  const menu = useMenu((choice) => {
    choice !== undefined &&
      list.send({
        type: 'LOAD',
        choice,
      });
  });

  const apps = [
    {
      label: 'Categories',
      icon: 'Class',
      color: 'warning',
      component: Categories,
      anchor: 'left'
    },
    {
      label: 'Reports',
      icon: 'Summarize',
      color: 'success',
      component: Reports
    },
    {
      label: 'Calendars',
      icon: 'CalendarMonth',
      color: 'info',
    },
    {
      label: 'Amenities',
      icon: 'Tune',
      color: 'error',
      component: Amenities,
      anchor: 'left'
    },
    {
      label: 'Users',
      icon: 'Person',
      color: 'success',
      dark: true, 
      component: Users
    },
  ];
  return (
    <>
      <Tooltag
        component={TextIcon}
        title="Open apps menu"
        caption="Show EventBuilder applications"
        icon="Apps"
        onClick={menu.handleClick}
      />

      {/* application containers */}
      {apps.map((app, i) => {
        const Component = app.component;
        return (
          <Drawer
            key={i}
            open={list.choice === i}
            onClose={() => list.send('CLOSE')}
            anchor={app.anchor || "bottom"}
          >
            <AppsHeader
              {...app}
              handler={list}
              handleClose={(e) => {
                list.send('CLOSE');
                menu.handleClick(e)
              }}
              />

            {list.busy && <LinearProgress />}
 
         
              {!!Component && <Component handler={list} samples={samples} groups={groups} >
              <AppsFooter handler={list} anchor={app.anchor} />
                </Component>}
              
             {!Component && <pre> {JSON.stringify(list.items,0,2)}</pre>}
              
          
          </Drawer>
        )
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
            <Columns>
              {apps.map((app, i) => (
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
                  onClick={menu.handleClose(i)}
                >
                  <IconButton color={app.color}>
                    <TextIcon icon={app.icon} />
                  </IconButton>
                  <Nowrap variant="body2" hover>
                    {app.label}
                  </Nowrap>
                </Flex>
              ))}
            </Columns>
          </Stack>
        </Layout>
      </Drawer>
    </>
  );
};
AppsMenu.defaultProps = {};
export default AppsMenu;
