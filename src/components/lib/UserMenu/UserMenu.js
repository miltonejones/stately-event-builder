import React from 'react';
import { styled, Avatar, Box } from '@mui/material';
import { Nowrap, Btn, Flex  } from "../../../styled";
import { initials  } from "../../../util/initials";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const UserMenu = ({ handler }) => {
  if (!handler.user) return <i />
  const { image, FirstName, LastName, username } = handler.user;
 return (
   <Layout data-testid="test-for-UserMenu">
   <Flex spacing={1}>
   <Nowrap small>
     Welcome back, {FirstName || username}  
    </Nowrap>
    <Btn variant="contained" onClick={() => handler.send('SIGNOUT')}>Sign Out</Btn> 
    <Avatar size="small" src={image} alt={FirstName}>{initials(`${FirstName} ${LastName}`)}</Avatar>
   </Flex>
   </Layout>
 );
}
UserMenu.defaultProps = {};
export default UserMenu;
