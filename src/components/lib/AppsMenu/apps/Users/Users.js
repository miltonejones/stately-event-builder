import React from 'react';
import { styled, Grid, Avatar, TextField, Box } from '@mui/material';
import {   Columns, TextIcon, TinyButton, Nowrap } from '../../../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1),
 height: '50vh'
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

  const handleChange = (event) => {
    handler.send({
      type: 'CHANGE',
      key: event.target.name, 
      value: event.target.value
    })
  };

 return (
   <Layout data-testid="test-for-Users">


<Columns sx={{ pt: 2, alignItems: 'flex-start' }} columns={handler.state.matches('editing') ? "65% 1fr" : "100% 0"}>
    <Box>

    {items?.map((item, i) => (
          <Columns spacing={0} columns="32px 80px 200px 300px 300px 1fr"  >
          <Nowrap selected={handler.ID === item.ID} border><TinyButton icon="Delete" /></Nowrap>
          <Nowrap selected={handler.ID === item.ID} border>{item.Salutation || hidden}</Nowrap>
          <Nowrap selected={handler.ID === item.ID} border onClick={() => handleEdit(item.ID, `${item.FirstName} ${item.LastName}`)} hover>{item.FirstName} {item.LastName}</Nowrap> 
          <Nowrap selected={handler.ID === item.ID} border >{item.Title || hidden}</Nowrap> 
          <Nowrap selected={handler.ID === item.ID} border >{item.Email || hidden}</Nowrap> 
          <Nowrap selected={handler.ID === item.ID} border >{item.UserID}</Nowrap> 
          </Columns>
        ))}
    </Box>
    <Box>
     {handler.is('editing') && <>
     
     <Grid  sx={{maxWidth: '100%'}} container spacing={2}>


          {config.map(conf => (
            <Grid item xs={conf.xs || 12} key={conf.field}
            ><UserField label={conf.label || conf.field} name={conf.field} type={conf.type} 
              onChange={handleChange}
              fullWidth size="small" value={handler.item[conf.field]} /></Grid>
          ))}

      </Grid>
     
     </>}
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

const UserField = ({type, ...props}) => {
  if (type === 'avatar') {
    return <Avatar src={props.value} alt="user avatar" size="small" sx={{ width: 32, height: 32 }}
      onClick={() => {
        const value = window.prompt("Enter a path to the user image", props.value);
        !!value && props.onChange({ target: { value, name: props.name }}); 
      }}
    ><TextIcon icon="Person" /></Avatar>
  } 
  return <TextField {...props}  />
}

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
    field: "Email", 
    label: "EMail address" , 
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
  {
    field: "UserID", 
    label: "Username", 
  },
  // {
  //   field: "image", 
  //   label: "User Avatar", 
  // },
]