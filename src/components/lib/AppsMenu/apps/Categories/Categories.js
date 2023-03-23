import React from 'react';
import { styled, Collapse, Box } from '@mui/material';
import { Flex, Columns,  Spacer,  ConfirmPop, TinyButton, Pill,  Nowrap } from '../../../../../styled';
import { htmlColors, opposite } from '../../../../../colors';
import AppForm from '../../components/AppForm/AppForm';
// import { Unsaved } from '../../../..';

 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2),
 width: 400
}));
 
const Categories = ({ handler, children }) => { 
  const {  handleDrop } = handler;

  const fields = [
    {
      label: "Label",
      caption: " This is the text that will appear in the category tag.",
      field: 'title',
      startIcon: <Pill color={handler.item?.color}>{handler.item?.title}</Pill>
    },
    {
      label: "Color",
      field: 'color',
      type: 'auto',
      options: htmlColors,
      caption: "Select a color for this category.",
      renderOption: (props, option) => (
        <ColorOption props={props} option={option} />
      )
    },
  ]
  
 return (
   <Layout data-testid="test-for-Categories">
    {/* {JSON.stringify(handler.state.value)} */}
    <Collapse in={handler.is('idle')}> 
    <Box>
      <Columns columns="20px 200px 1fr" sx={{ m: 1 }}>
        <Spacer />
        <Nowrap bold>Name</Nowrap>
        <Nowrap bold>Color</Nowrap>
      </Columns>
    {handler.items.map(item => <Columns columns="20px 200px 1fr" sx={{ m: 1 }} key={item.ID} >
      
      <ConfirmPop 
        label="Confirm delete"
        message={<>Are you sure you want to delete category <b>{item.title}</b>?</>} onChange={ok => {
         !!ok && handleDrop(item.ID)
      }}><TinyButton icon="Delete" /></ConfirmPop>

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
 
    <Collapse in={handler.is(['editing', 'confirm_close'])}>  

      <AppForm  handler={handler}  icon="Class"  
        title="Edit category details" fields={fields} /> 
      
 
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
