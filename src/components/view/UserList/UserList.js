import React from 'react';
import { styled, Grid, Drawer, IconButton, Avatar, LinearProgress, TextField, Box } from '@mui/material';
import { 
  Flex,
  Nowrap,
  Columns,
  SectionHead,
  IconTextField,
  TextIcon,
  TinyButton,
  Spacer,
  Btn ,
  JsonCollapse
} from "../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  height: '60vh',
  overflow: 'hidden'
}));
 
const UserList = ({ handler, disabled }) => {
  const items = handler.userList;
  const hidden = <em> not set</em>
  const handleEdit = ID => {
    handler.send({
      type: 'EDIT',
      ID
    })
  };
  const handleProp= (key, value) => {
    handler.send({
      type: 'PROP',
      key, value
    })
  };
  const handleChange = (key, value) => {
    handler.send({
      type: 'CHANGE',
      key, value
    })
  };
 return (

  <Drawer anchor="bottom" open={handler.open}>
   <Layout data-testid="test-for-UserList">
   <SectionHead spacing={1} sx={{ p: t => t.spacing(1, 1)}}>Users 
      <Spacer />
      <IconTextField 
        size="small" 
        label="filter"
        value={handler.filter}
        onChange={e => handleProp('filter', e.target.value)}
        endIcon={<TextIcon icon="Search" />}
      />
      <Btn variant="contained" onClick={() => handler.send('CLOSE')}
        endIcon={<TextIcon icon="Close" />}> 
        close  
      </Btn>
      {handler.state.matches('opened.editing') && <IconButton onClick={e => handleProp('debug', !handler.debug)}>
        <TextIcon icon="Code" />
      </IconButton>}
    </SectionHead>
    {handler.busy && <LinearProgress variant="indeterminate" />}

    <Columns sx={{ alignItems: 'flex-start' }} columns={handler.state.matches('opened.editing') ? "65% 1fr" : "100% 0"}>

      {!!items && <Columns spacing={0} columns="32px 80px 200px 300px 300px 1fr" sx={{m: 2}}>


        <Box>{" "}</Box>
        <Nowrap variant="subtitle2" border>Salutation</Nowrap>
        <Nowrap variant="subtitle2" border hover>Name</Nowrap> 
        <Nowrap variant="subtitle2" border >Title</Nowrap> 
        <Nowrap variant="subtitle2" border >EMail</Nowrap> 
        <Nowrap variant="subtitle2" border >UserID</Nowrap> 


      {items.map((item, i) => (
        <>
        <Nowrap selected={handler.ID === item.ID} border><TinyButton icon="Delete" /></Nowrap>
        <Nowrap selected={handler.ID === item.ID} border>{item.Salutation || hidden}</Nowrap>
        <Nowrap selected={handler.ID === item.ID} border onClick={() => handleEdit(item.ID)} hover>{item.FirstName} {item.LastName}</Nowrap> 
        <Nowrap selected={handler.ID === item.ID} border >{item.Title || hidden}</Nowrap> 
        <Nowrap selected={handler.ID === item.ID} border >{item.Email || hidden}</Nowrap> 
        <Nowrap selected={handler.ID === item.ID} border >{item.UserID}</Nowrap> 
        </>
      ))}
      </Columns>}
 

      <Box sx={{p:2}}>
        {!!handler.user && <JsonCollapse object={handler.user} open={handler.debug}><Grid  sx={{maxWidth: '100%'}} container spacing={2}>


          {config.map(conf => (
            <Grid item xs={conf.xs || 12} key={conf.field}
            ><UserField label={conf.label || conf.field} type={conf.type} 
              onChange={e => handleChange(conf.field, e.target.value)}
              fullWidth size="small" value={handler.user[conf.field]} /></Grid>
          ))}
          </Grid></JsonCollapse>}
          {/* {config.length}
        <pre>
          {JSON.stringify(handler.user,0,2)}
        </pre> */}
        <Flex sx={{pt: 2}} spacing={1}>
          <Spacer />
          <Btn onClick={() => handler.send('CLOSE')}>Cancel</Btn>
          <Btn disabled={disabled || !handler.dirty} onClick={() => handler.send('SAVE')} variant="contained">Save</Btn>
        </Flex>
      </Box>

    </Columns>

    {/* <pre>
      {JSON.stringify(handler.userList,0,2)}
    </pre> */}
   </Layout>
   </Drawer>
 );
}
UserList.defaultProps = {};
export default UserList;

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