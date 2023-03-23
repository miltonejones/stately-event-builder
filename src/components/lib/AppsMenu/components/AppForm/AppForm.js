import React from 'react';
import { Box } from '@mui/material';
import { GridForm } from '../../../../../styled';
  
 
const AppForm = ({ handler, title, icon, fields, ...props}) => {
 return (
  <Box {...props}>
  {handler.is(['editing', 'confirm_close']) && <GridForm 

    icon={icon}
    title={title}
    config={fields} 


    handleClose={() => handler.send('EXIT')}
    handleSave={() => handler.send('UPDATE')}
    handleUndo={() => handler.send('UNDO')}
    dirty={handler.dirty}
    error={handler.is('confirm_close')} 
    values={handler.item} 
    handleChange={handler.handleChange}
    
    />}
</Box>
 );
}
AppForm.defaultProps = {};
export default AppForm;
