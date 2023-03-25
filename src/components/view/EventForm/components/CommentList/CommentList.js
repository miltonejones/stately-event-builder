import React from 'react';
import { styled, Card, Collapse, TextField, Paper, Avatar, Stack } from '@mui/material';
import { Flex, Spacer,IconTextField, TinyButton, Btn, GridFormHeader, Nowrap } from "../../../../../styled";
import { uniqueId } from "../../../../../util/uniqueId";
import moment from 'moment';

const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
  padding: theme.spacing(2)
}));

const CommentLine = ({ comment, users }) => {
  const user = users.find (f => f.ID === comment.UserID);

  return <Paper elevation={0} sx={{pb: 1, mb: 1, pr: 1, width: '100%' }}>
    
    <Flex spacing={2} sx={{ width: '100%' }}>
      <Avatar src={user?.image} alt={user?.FirstName}></Avatar>
    <Stack key={comment.id} spacing={1} sx={{ width: '100%' }}>
       <Nowrap>{comment.CommentText}</Nowrap>
       <Flex sx={{ width: '100%' }}>
       <Nowrap small muted>{ <b>{user?.FirstName} {user?.LastName}</b>}</Nowrap> 
       <Spacer  />
       <Nowrap small muted>{moment(comment.CommentDate).format('MMM Do, hh:mm a')}</Nowrap> 
       </Flex>
</Stack></Flex></Paper>
}
 
const CommentList = ({ handler, value, whois, handleChange }) => {
  const [text, setText] = React.useState("");
  const { users } = handler;

  const onChange = () => {
    const comment = {
      id: uniqueId(),
      CommentText: text,
      CommentDate: new Date(), // moment(new Date()).format('YYYY-MM-DDTHH:MM:SS.000Z'),
      Eventfk: handler.eventProp.ID,
      UserID: whois.user.ID
    };
    setText("");
      
    handleChange('comments', value.concat(comment));
  }

 return (
   
  <Layout>
    <GridFormHeader  sx={{ mb: 3 }} title="Comments" icon="Comment" >
      <IconTextField
      prompt
      description={`Add a comment for "${handler.eventProp.EventName}" `}
      label="Add comment"
      button={<TinyButton icon="Add" />}
    
      />
    </GridFormHeader>

    {value.map(comment => <CommentLine key={comment.id} comment={comment} users={users} />)}

    <Flex spacing={1} sx={{ m: 1}}>
      <TextField 
        multiline
        placeholder="Type here to add a new comment"
        size="small"
        value={text}
        onChange={e => setText(e.target.value)}
        fullWidth
      />
    </Flex>

    <Collapse in={!!text}>
      <Flex spacing={1}>
        <Btn onClick={() => setText("")}>cancel</Btn>
        <Btn variant="contained" onClick={() => onChange()}>save</Btn>
      </Flex>
    </Collapse>
     
    {/* <Btn onClick={() => onChange()} variant="contained">add comment</Btn> */}
  </Layout>
 );
}
CommentList.defaultProps = {};
export default CommentList;
