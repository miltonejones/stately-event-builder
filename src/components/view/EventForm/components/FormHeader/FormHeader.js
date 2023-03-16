import React from 'react';
import { IconButton, MenuItem, TextField } from '@mui/material';
import { Spacer, TextIcon, Banner, Nowrap } from '../../../../../styled';

const FormHeader = ({ handler, handleIndex }) => {
  const index = handler.eventList
    .map((f) => f.ID)
    .indexOf(handler.eventProp.ID);

  return (
    <Banner disabled={handler.busy || handler.saving}>
      Edit{' '}

      {/* event title */}
      <Nowrap small bold>
        {handler.eventProp.EventName}
      </Nowrap>
      
      <Spacer />

      {/* left navigation arrow */}
      <IconButton disabled={index < 1} onClick={() => handleIndex(index - 1)}>
        <TextIcon icon="KeyboardArrowLeft" />
      </IconButton>

      {/* free form navigation text box */}
      <TextField
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
      </TextField>


      of {handler.eventList.length}

      {/* right navigation arrow */}
      <IconButton
        disabled={!handler.eventList[index + 1]}
        onClick={() => handleIndex(index + 1)}
      >
        <TextIcon icon="KeyboardArrowRight" />
      </IconButton>
    </Banner>
  );
};
FormHeader.defaultProps = {};
export default FormHeader;
