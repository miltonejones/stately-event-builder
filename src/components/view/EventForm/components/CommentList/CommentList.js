import React from 'react';
import { styled, Card, TextField, Paper, Stack } from '@mui/material';
import { Flex, Spacer, Banner, Nowrap, Btn } from "../../../../../styled";
import { uniqueId } from "../../../../../util/uniqueId";
import moment from 'moment';

const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
}));
 
const CommentList = ({ handler, value, handleChange }) => {
  const [text, setText] = React.useState("");

  const onChange = (id) => {
    const comment = {
      id: uniqueId(),
      CommentText: text,
      CommentDate: moment(new Date()).format('MM-DD-YYYY'),
      Eventfk: handler.eventProp.ID,
      UserID: handler.eventProp.CreateLogin
    };
    setText("");
      
    handleChange('comments', value.concat(comment));
  }

 return (
   
  <Layout>
    <Banner>
      Comments
    </Banner>

    {value.map(comment => <Paper elevation={0} sx={{p: 1, m: 1}}><Stack key={comment.id} spacing={1} >
      <pre>{comment.CommentText}</pre>
      <Flex>
        <Spacer />
        <Nowrap small muted spacing={1}>
          <em>{comment.CommentDate}</em>{" "}
          <b>{handler.eventProp.FullName}</b>
        </Nowrap>
      </Flex>
     
    </Stack></Paper>)}

    <Flex spacing={1} sx={{ m: 1}}>
    <TextField 
      multiline
      placeholder="Enter a comment"
      size="small"
      value={text}
      onChange={e => setText(e.target.value)}
      fullWidth
    />
    <Btn onClick={() => onChange()} variant="contained">add comment</Btn>
    </Flex>
  </Layout>
 );
}
CommentList.defaultProps = {};
export default CommentList;
