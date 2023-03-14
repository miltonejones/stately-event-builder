import React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { styled, TextField, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const TimeInput = ({  label, value, setValue, disabled  }) => {
 return (
   <Layout data-testid="test-for-TimeInput">
       <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={[  'DesktopTimePicker']}> 
        <DesktopTimePicker 
          disabled={disabled}
          size="small"
          label={label}
          minutesStep={15}
          value={dayjs(value)}
          renderInput={(params) => <TextField {...params} size="small" />}
          onChange={(v) => setValue(v)}
        />
      </DemoContainer>
    </LocalizationProvider>
   </Layout>
 );
}
TimeInput.defaultProps = {};
export default TimeInput;
