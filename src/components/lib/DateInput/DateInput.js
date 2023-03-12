import React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { styled, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0),
 '& .MuiStack-root': {
  // paddingTop: '0 !important'
 }
}));
 
const DateInput = ({ label, value, setValue, disabled }) => {
 return (
   <Layout data-testid="test-for-DateInput">
       <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={[  'DateField']}> 
        <DateField 
          disabled={disabled}
          size="small"
          label={label}
          value={dayjs(value)}
          onChange={(v) => setValue(v)}
        />
      </DemoContainer>
    </LocalizationProvider>
   </Layout>
 );
}
DateInput.defaultProps = {};
export default DateInput;
