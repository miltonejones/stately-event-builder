import React from 'react';
import { styled, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { apiDate } from '../../../util/apiDate';
import { 
  useNavigate, 
} from "react-router-dom";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const CalendarInput = ({ handler }) => {
  const navigate = useNavigate() 
  const { params, logo } = handler;
  const handleDateChange = date => {
    const start_date = apiDate(new Date(date)) 
    navigate(`/find/start_date/${start_date}`); 
  }
  return (
    <Layout data-testid="test-for-CalendarInput">
      <img src={logo} alt="eb" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar  value={dayjs(params.start_date)} onChange={handleDateChange} />
      </LocalizationProvider>
    </Layout>
  );
}
CalendarInput.defaultProps = {};
export default CalendarInput;
