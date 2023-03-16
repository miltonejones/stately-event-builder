import React from 'react';
import { MenuItem, Divider } from '@mui/material';
import { DateInput, RoomSelect } from '../../../..';
import {
  Flex, 
  IconTextField, 
  TinyButton, 
} from '../../../../../styled';
import { apiDate } from '../../../../../util/apiDate';

import DateRange from  '../DateRange/DateRange';

 
 

const EventInput = (props) => {
  const {
    rows,
    handler,
    auto,
    prefix,
    types,
    type = 'text',
    handleChange,
    field,
    label,
    none,
    icon = 'AccessTime',
  } = props;

  if (['range'].find((f) => f === type) && !!handler.eventProp.RecurseEndDate) {
    return <DateRange {...props} />;
  }

  if (['date'].find((f) => f === type)) {
    return (
      <DateInput
        label={label}
        disabled={handler.busy || handler.saving}
        setValue={(e) => handleChange(field, apiDate(new Date(e)))}
        value={handler.eventProp[field]}
      />
    );
  }

  if (['text', 'time'].find((f) => f === type)) {
    return (
      <>
        {/* {type === 'time' && <>{eventTime( handler.eventProp[field]) }--{handler.eventProp[field]}</>} */}
        <IconTextField
          sx={{ mt: 1 }}
          fullWidth
          type={type}
          startIcon={
            !prefix ? null : (
              <Flex
                sx={{
                  fontSize: '0.8rem',
                  borderRadius: 1,
                  p: (t) => t.spacing(0, 0.5),
                  backgroundColor: 'divider',
                }}
              >
                <TinyButton icon={icon} /> {prefix}
              </Flex>
            )
          }
          autoFocus={auto}
          multiline={!!rows}
          disabled={handler.busy || handler.saving}
          select={!!types}
          rows={rows}
          size="small"
          label={label}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: '12:00',
            max: '01:00',
            step: 900, // 5 min
          }}
          onChange={(e) => handleChange(field, e.target.value)}
          value={
            !!handler.eventProp[field] || handler.eventProp[field] === 0
              ? handler.eventProp[field]
              : -1
          }
        >
          {!!none && <MenuItem value={-1}>{none}</MenuItem>}
          {types?.map((type, i) => (
            <MenuItem key={i} value={i}>
              {typeof type === 'string' ? (
                type
              ) : (
                <Divider sx={{ width: '100%' }} />
              )}
            </MenuItem>
          ))}
        </IconTextField>
      </>
    );
  }

  if (type === 'rooms' && handler.roomList) {
    return (
      <RoomSelect
        rooms={handler.roomList}
        eventfk={handler.eventProp.ID}
        onChange={(e) => handleChange(field, e)}
        value={handler.eventProp[field]}
      />
    );
  }

  return <i />;
};

EventInput.defaultProps = {};
export default EventInput;
