import React from 'react';
import { styled, Stack, Collapse, Autocomplete, TextField, Box } from '@mui/material';
import { Flex, Columns,  Spacer, IconTextField, TinyButton, Pill,  Nowrap } from '../../../../../styled';
import { htmlColors, opposite } from '../../../../../colors';
// import { Unsaved } from '../../../..';

 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2),
 width: 400
}));
 
const Categories = ({ handler, children }) => { 
  const handleChange = (event, value) => {
    handler.send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }
 return (
   <Layout data-testid="test-for-Categories">
    {/* {JSON.stringify(handler.state.value)} */}
    <Collapse in={handler.state.matches('idle')}> 
    <Box>
      <Columns columns="20px 200px 1fr" sx={{ m: 1 }}>
        <Spacer />
        <Nowrap bold>Name</Nowrap>
        <Nowrap bold>Color</Nowrap>
      </Columns>
    {handler.items.map(item => <Columns columns="20px 200px 1fr" sx={{ m: 1 }} key={item.ID} >
      <TinyButton icon="Delete" />
      <Nowrap  hover onClick={() => {
        handler.send({
          type: 'EDIT',
          ID: item.ID,
          title: item.title
        })
      }}>{item.title}</Nowrap>
      {!!item.color && <Nowrap
        sx={{
          backgroundColor: item.color,
          color: opposite(item.color),
          p: t => t.spacing(0, 1),
        }}
      >{item.color}</Nowrap>}
    </Columns>)}
    </Box>
    </Collapse>
{/* 
    <Collapse in={handler.state.matches('confirm_close')}> 
      <Unsaved handler={handler} save="UPDATE" />
    </Collapse> */}

    <Collapse in={handler.state.matches('editing')}> 
    {!!handler.item &&  <Stack spacing={1}>
        
        <Nowrap>Title</Nowrap>
          <IconTextField 
          size="small"
                startIcon={<Pill color={handler.item.color}>{handler.item.title}</Pill>}
          fullWidth
            value={handler.item.title}
            name="title"
            onChange={handleChange}
            
            />
            
          <Nowrap>Color</Nowrap>
          <Autocomplete
              options={htmlColors}
              value={handler.item.color}
              name="color"
              onChange={(_, value) => {
                handler.send({
                  type: 'CHANGE',
                  key: 'color',
                  value
                })
              }}
              renderOption={(props, option) => (
                <ColorOption props={props} option={option} />
              )}
              renderInput={(params) => (
                <TextField {...params} 
                fullWidth size="small" label="Colors" />
              )}
            />
            
          {/* <Flex sx={{mt: 2}} spacing={1}>
           
            <Spacer />
            <Btn onClick={() => handler.send('EXIT')}>Cancel</Btn>
            <Btn onClick={() => handler.send('UPDATE')} variant="contained" disabled={!handler.dirty}>Save</Btn>
          </Flex> */}
        </Stack>}
      {/* {JSON.stringify(handler.item)} */}
    </Collapse>


    <Box sx={{mt: 2}}> 
    {children}
    </Box>
   </Layout>
 );
}



const ColorOption = ({ props, option }) => {
  return (
    <Flex {...props} spacing={1}>
      <Box
        sx={{
          width: 70,
          height: 20,
          backgroundColor: option,
        }}
      ></Box>
      <Nowrap>{option}</Nowrap>
    </Flex>
  );
};




Categories.defaultProps = {};
export default Categories;
