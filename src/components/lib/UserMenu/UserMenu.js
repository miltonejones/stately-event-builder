import React from 'react';
import { styled, Avatar, Box, TextField, Grid, Dialog } from '@mui/material';
import { Nowrap, Btn, Flex, Spacer, Banner  } from "../../../styled";
import { initials  } from "../../../util/initials";
 
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


 
const UserMenu = ({ handler, profile }) => {
  if (!handler.user) return <i />
  const { image, FirstName, LastName, username } = handler.user;
  const handleChange = (event) => { 
    profile.send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }
 return (
   <Layout data-testid="test-for-UserMenu">
   <Flex spacing={1}>
   <Nowrap small>
     Welcome back, {FirstName || username}  
    </Nowrap>
    <Btn variant="contained" onClick={() => handler.send('SIGNOUT')}>Sign Out</Btn> 
    <Avatar onClick={() => profile.send({
      type: 'OPEN',
      user: handler.user
    })} size="small" src={image} alt={FirstName}>{initials(`${FirstName} ${LastName}`)}</Avatar>
   </Flex>
  {!!profile?.user && <Dialog onClose={() => profile.send('CLOSE')} open={profile.open}>
    <Banner>Edit Profile</Banner>
    <Box sx={{ p: 2 }}>
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
    </Box>
      <pre>
        {JSON.stringify(profile.user.groups,0,2)}
      </pre>
   </Dialog>}
   </Layout>
 );
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

