import React from 'react'; 
import { styled, Stack, Collapse, Box } from '@mui/material';
import { TextIcon, Columns, IconTextField, ConfirmPop, TinyButton, Nowrap } from '../../../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1),
 width: 480
}));
 
const Calendars = ({ handler, children }) => {
  const { handleChange, handleDrop, handleEdit } = handler;
 return (
   <Layout data-testid="test-for-Calendars">
      <Collapse in={handler.is('idle')}>
    {handler.items.map(item => <Columns columns="20px 200px 1fr" sx={{ m: 1 }} key={item.ID}>
    <ConfirmPop 
        label="Confirm delete"
        message={<>Are you sure you want to delete calendar <b>{item.calendar_name}</b>?</>} onChange={ok => {
         !!ok && handleDrop(item.ID)
      }}><TinyButton icon="Delete" /></ConfirmPop>

      <Nowrap  hover onClick={() => handleEdit( item.ID, item.calendar_name)}>{item.calendar_name}</Nowrap>
     
    </Columns>)}
    </Collapse>
 

    <Collapse in={handler.is('editing')}> 
    {!!handler.item &&  <Stack spacing={1}>
        
        <Nowrap>Calendar Name</Nowrap>
          <IconTextField  
            fullWidth
            startIcon={<TextIcon icon="CalendarMonth" />}
            value={handler.item.calendar_name}
            name="calendar_name"
            onChange={handleChange} 
            />
      
        </Stack>} 
    </Collapse>


    <Box sx={{mt: 2}}> 
    {children}
    </Box>

   </Layout>
 );
}
Calendars.defaultProps = {};
export default Calendars;
