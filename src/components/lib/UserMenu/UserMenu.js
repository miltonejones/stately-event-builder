import React from 'react';
import { styled, Avatar, Box, Divider, Menu, MenuItem, ListItemIcon, Dialog } from '@mui/material';
import { Nowrap, Btn, Flex, MenuStack, Spacer, JsonCollapse, TextIcon, GridForm,  } from "../../../styled";
import { initials  } from "../../../util/initials";
import { useMenu } from '../../../machines';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
})); 

const UserMenu = ({ handler, palette, profile, diagnosis, app }) => {
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
    }),
    () => palette.handleClick(),
    () => diagnosis.handleClick()
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
  const error = profile.state.matches('confirm');
  return <Layout>
  <Flex spacing={1}>
  <Spacer /> 

          <Avatar onClick={menu.handleClick} 
          sx={{ cursor: 'pointer',
        '&:hover': {
          outline: t => `solid 2px ${t.palette.error.main}`,
          outlineOffset: 1
        } }}
          size="small" src={image} alt={FirstName}>{initials(`${FirstName} ${LastName}`)}</Avatar>
  </Flex>
  {!!profile?.user && <Dialog onClose={() => profile.send('CLOSE')} open={profile.open}>
 
    <Box>
      <JsonCollapse object={profile.user} open={profile.state.matches('json')}>


         <Box sx={{ p: 1}}>
          {/* [{JSON.stringify(profile.dirty)}] */}
         <GridForm 
          config={config}
          error={error}
          values={profile.user}
          dirty={profile.dirty}
          handleChange={handleChange}
          handleClose={() =>  profile.send('CLOSE')}
          handleUndo={() =>  profile.send('RESET')}
          handleSave={() =>  profile.send('SAVE')}
          title="Edit Your Profile"
          icon="Person"
          />
         </Box> 


        <Flex spacing={1} sx={{ 
            mt: 2,
            p: 3, 
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: t => t.palette.grey[200] }}>
            {!!error && <> 
            <Btn onClick={() =>  profile.send('SAVE')}  variant="contained">save changes</Btn>
            </>}
          <Spacer />
          {!error && <>
            <Btn onClick={() =>  profile.send('CLOSE')}>Cancel</Btn>
          <Btn onClick={() =>  profile.send('SAVE')} variant="contained">Save</Btn>
          </>}
          {!!error && <>
            <Btn onClick={() =>  profile.send('CANCEL')}>Cancel</Btn>
          <Btn onClick={() =>  profile.send('OK')} color="error" variant="contained">close anyway</Btn>
          </>}
        </Flex>


        </JsonCollapse>
            </Box>
           
          </Dialog>}

      <Menu 
        anchorEl={menu.anchorEl}
        open={open}
        onClose={menu.handleClose()}
      >

        <Flex spacing={1} sx={{
          minWidth: 300,
          p: 1, 
          borderBottom:1,
          borderColor: 'divider'
        }}>


            <Avatar size="small" 
            src={image} alt={FirstName}>{initials(`${FirstName} ${LastName}`)}</Avatar>
  <Nowrap bold variant="body2">
     Welcome back, {FirstName || username} 
    </Nowrap>

        </Flex>


        <MenuStack 
          icon={'Person'} 
          onClick={menu.handleClose(2)}
          caption={"Edit your profile details."}
        >
          Profile
        </MenuStack>
      
        <MenuStack 
          icon={'Palette'} 
          onClick={menu.handleClose(3)}
          caption={"Change the look of EventBuilder."}
        >
          Choose Theme
        </MenuStack>
      



 
        <Divider />
        <MenuItem onClick={menu.handleClose(0)}>
        <ListItemIcon>
            <TextIcon icon="Lock" />
          </ListItemIcon>
         <b>Sign out</b></MenuItem>
         <Divider textAlign="left"><Nowrap small muted>Developer Tools</Nowrap></Divider>
        <MenuItem onClick={menu.handleClose(1)}>{app.showJSON ? "Hide" : "Show"} JSON output</MenuItem>
        <MenuItem onClick={menu.handleClose(4)}>View machine states</MenuItem>
      </Menu>
  </Layout>
}


  
UserMenu.defaultProps = {};
export default UserMenu;


// const config = [
//   {
//     field: "image",
//     type: 'avatar',
//     xs: 1,
//   },
//   {
//     field: "FirstName",
//     label: 'First Name',
//     xs: 5,
//   },
//   {
//     field: "LastName",
//     label: 'Last Name',
//     xs: 6,
//   },
//   {
//     field: "username", 
//     label: "Username", 
//     readonly: 1
//   },
//   {
//     attribute: "email", 
//     label: "EMail address" , 
//     readonly: 1
//   },
//   {
//     field: "Salutation",
//     xs: 4,
//   },
//   {
//     field: "Title",
//     xs: 4,
//   },
//   {
//     field: "Phone",
//     xs: 4,
//   },
//   // {
//   //   field: "image", 
//   //   label: "User Avatar", 
//   // },
// ]


const config = [
  {
    label: "Name",
    caption: "Enter first and last name, or add an optional image"
  },
  {
    field: "image",
    // label: "Set user image",
    type: 'avatar',
    xs: 1,
  },
  {
    field: "Salutation",
    xs: 3,
  },
  {
    field: "FirstName",
    // label: 'First Name',
    xs: 4,
  },
  {
    field: "LastName",
    // label: 'Last Name',
    xs: 4,
  },
  {
    label: "Username", 
    caption: "This is the username the you use to sign in."
  },
  {
    field: "UserID", 
    icon: "Lock",
    xs: 6,
    disabled: true
  },
  { 
    field: "Title", 
    xs: 6
  }, 
  {
    caption: "The email address is required for authentication and cannot be changed.",
    label: "Contact information" , 
  },
  {
    field: "Email", 
    icon: "Email",
    disabled: true,
    xs: 6
  }, 
  {
    field: "Phone", 
    icon: "Phone",
    xs: 6
  }, 
]
