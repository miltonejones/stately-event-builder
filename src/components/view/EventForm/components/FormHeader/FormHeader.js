import React from 'react';
import { IconButton, MenuItem } from '@mui/material';
import { TextIcon, GridFormHeader, IconTextField } from '../../../../../styled';


const EventNav = ({ handler, handleIndex}) => {
  const index = handler.eventList
    .map((f) => f.ID)
    .indexOf(handler.eventProp.ID);
  return <>
  
      <IconButton color="inherit" disabled={index < 1} onClick={() => handleIndex(index - 1)}>
        <TextIcon icon="KeyboardArrowLeft" />
      </IconButton>
 
      <IconTextField
        select
        size="small"
        onChange={(e) => handleIndex(e.target.value)}
        value={index}
      >
        {Array.from(Array(handler.eventList.length).keys()).map((key) => (
          <MenuItem key={key} value={key}>
            {key + 1}
          </MenuItem>
        ))}
      </IconTextField>


      of {handler.eventList.length}
 
      <IconButton  color="inherit"
        disabled={!handler.eventList[index + 1]}
        onClick={() => handleIndex(index + 1)}
      >
        <TextIcon icon="KeyboardArrowRight" />
      </IconButton>

  </>
}

const FormHeader = (props) => {
  const { handler } = props;
  // const index = handler.eventList
  //   .map((f) => f.ID)
  //   .indexOf(handler.eventProp.ID);

  return (
    <>
    <GridFormHeader
      dirty={handler.dirty}
      handleSave={() => handler.send('SAVE')}
      handleClose={() => handler.send('LIST')}
      handleUndo={() => handler.send('UNDO')}
      title={`Edit ${handler.eventProp.EventName}`}
      icon="Bolt"
      ><EventNav {...props} /></GridFormHeader>

      
    {/* <Banner disabled={handler.busy || handler.saving}>
      Edit{' '}
 
      <Nowrap small bold>
        {handler.eventProp.EventName}
      </Nowrap>
      
      <Spacer />
 

    </Banner> */}
    
    </>
  );
};
FormHeader.defaultProps = {};
export default FormHeader;
