import React from 'react';
import { styled, Avatar, Box, Menu, MenuItem, TextField, Grid, Dialog } from '@mui/material';
import { Nowrap, Btn, Flex, Spacer, TinyButton, JsonCollapse, Banner  } from "../../../styled";
import { initials  } from "../../../util/initials";
import { useMenu } from '../../../machines';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));


const UserField = ({type, ...props}) => {
  if (type === 'avatar') {
    return <Avatar src={props.value} alt="user avatar" size="small" sx={{ width: 32, height: 32 }}
      onClick={() => {
        const value = window.prompt("Enter a path to the user image", props.value);
        !!value && props.onChange({ target: { value }}); 
      }}
    >A</Avatar>
  } 
  return <TextField {...props}  />
}

const UserMenu = ({ handler, profile, app }) => {
  const actions = [
    () =>  handler.send('SIGNOUT'),
    () => {
      app.send({
        type: 'CHANGE',
        key: 'showJSON',
        value: !app.props.showJSON
      })
    },
    () => profile.send({
      type: 'OPEN',
      user: handler.user
    })
  ]
  const menu = useMenu(index => {
    const action = actions[index];
    action && action ()
  });
  const open = Boolean(menu.anchorEl)
  if (!handler.user) return <i />

  const { image, FirstName, LastName, username } = handler.user;

  const handleChange = (event) => { 
    profile.send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }
  return <Layout>
  <Flex spacing={1}>
  <Spacer />
   <Nowrap variant="caption">
     Welcome back, {FirstName || username} 
    </Nowrap>
    <Btn variant="contained" onClick={() => handler.send('SIGNOUT')}>Sign Out</Btn> 
    <Avatar onClick={menu.handleClick} size="small" src={image} alt={FirstName}>{initials(`${FirstName} ${LastName}`)}</Avatar>

  </Flex>
       
  {!!profile?.user && <Dialog onClose={() => profile.send('CLOSE')} open={profile.open}>
    <Banner>Edit Profile<Spacer />
    <TinyButton icon="Code" onClick={() => profile.send(profile.state.matches('json') ? 'EXIT' : 'JSON')} />
    </Banner>  
    <Box sx={{ p: 2 }}>
      <JsonCollapse object={profile.user} open={profile.state.matches('json')}>
    <Grid  sx={{maxWidth: '100%'}} container spacing={2}> 

        {config.map(conf => (
          <Grid item xs={conf.xs || 12} key={conf.field}
          ><UserField label={conf.label || conf.field} type={conf.type} 
            name={conf.field} disabled={conf.readonly}
            onChange={handleChange}
            fullWidth size="small" value={profile.user[conf.field] || profile.user.attributes[conf.attribute]} /></Grid>
        ))}
        </Grid>
        <Flex spacing={1} sx={{ p: 2 }}>
          <Spacer />
          <Btn onClick={() =>  profile.send('CLOSE')}>Cancel</Btn>
          <Btn onClick={() =>  profile.send('SAVE')} variant="contained">Save</Btn>
        </Flex>
        </JsonCollapse>
            </Box>
              {/* <pre>
                {JSON.stringify(profile.user.groups,0,2)}
              </pre> */}
          </Dialog>}
      <Menu 
        anchorEl={menu.anchorEl}
        open={open}
        onClose={menu.handleClose()}
      >
        <MenuItem onClick={menu.handleClose(2)}>Profile</MenuItem>
        <MenuItem onClick={menu.handleClose(0)}>Logout</MenuItem>
        <MenuItem onClick={menu.handleClose(1)}>{app.showJSON ? "Hide" : "Show"} JSON output</MenuItem>
      </Menu>
  </Layout>
}


  
UserMenu.defaultProps = {};
export default UserMenu;


const config = [
  {
    field: "image",
    type: 'avatar',
    xs: 1,
  },
  {
    field: "FirstName",
    label: 'First Name',
    xs: 5,
  },
  {
    field: "LastName",
    label: 'Last Name',
    xs: 6,
  },
  {
    field: "username", 
    label: "Username", 
    readonly: 1
  },
  {
    attribute: "email", 
    label: "EMail address" , 
    readonly: 1
  },
  {
    field: "Salutation",
    xs: 4,
  },
  {
    field: "Title",
    xs: 4,
  },
  {
    field: "Phone",
    xs: 4,
  },
  // {
  //   field: "image", 
  //   label: "User Avatar", 
  // },
]

