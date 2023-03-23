import React from 'react';
import { styled, Box } from '@mui/material';
import { Columns, TinyButton, Nowrap } from '../../../../../styled';
import AppForm from '../../components/AppForm/AppForm';

 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1),
 height: '60vh'
}));
 
const Users = ({ handler, groups }) => {
  const { items } = handler;
  const hidden = <em> not set</em>
  const handleEdit = (ID, title) => {
    handler.send({
      type: 'EDIT',
      ID,
      title
    })
  };
 


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
    caption: "This is the username the user will use to sign in.",
  },
  {
    field: "UserID", 
    icon: "Lock",
    xs: 6
  },
  { 
    field: "Title", 
    xs: 6
  },
  {
    caption: "Control user access by specifying a group name.",
    label: "Security Group" , 
  },
  { 
    field: "group" ,
    icon: "Lock",
    options: handler.subitems?.map(f => ({
      value: f.GroupName,
      label: f.GroupName
    }))
  },
  {
    caption: "The email address is required for authentication.",
    label: "Contact information" , 
  },
  {
    field: "Email", 
    icon: "Email",
    xs: 6
  },
  // {
  //   caption: "Primary contact phone is optional.",
  //   label: "Phone" , 
  // },
  {
    field: "Phone", 
    icon: "Phone",
    xs: 6
  },
  // {
  //   field: "image", 
  //   label: "User Avatar", 
  // },
]


 return (
   <Layout data-testid="test-for-Users">


<Columns sx={{ pt: 0, alignItems: 'flex-start' }} columns={handler.is(['editing', 'confirm_close']) ? "65% 1fr" : "100% 0"}>
    <Box>

    {items?.map((item, i) => (
          <Columns spacing={0} columns="32px 80px 200px 300px 300px 1fr"  >
          <Nowrap selected={handler.ID === item.ID} border><TinyButton icon="Delete" /></Nowrap>
          {/* <Avatar sx={{ w: 24, h: 24 }}>a</Avatar> */}
          <Nowrap selected={handler.ID === item.ID} border>{item.Salutation || hidden}</Nowrap>
          <Nowrap selected={handler.ID === item.ID} border onClick={() => handleEdit(item.ID, `${item.FirstName} ${item.LastName}`)} hover>{item.FirstName} {item.LastName}</Nowrap> 
          <Nowrap selected={handler.ID === item.ID} border >{item.Title || hidden}</Nowrap> 
          <Nowrap selected={handler.ID === item.ID} border >{item.Email || hidden}</Nowrap> 
          <Nowrap selected={handler.ID === item.ID} border >{item.UserID}</Nowrap> 
          </Columns>
        ))}
    </Box>
    <Box>

      <AppForm  handler={handler}  icon="Person"  
      title="Edit user details" fields={config} 

      />
  
{/* {JSON.stringify(handler.subitems)} */}
    </Box>

</Columns>


     {/* <pre>
      {JSON.stringify(groups)}
     </pre> */}
   </Layout>
 );
}
Users.defaultProps = {};
export default Users;
 