import React from 'react';
import { styled, Box } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { apiDate } from '../../../util/apiDate';
import { TinyButton, Spacer, Flex } from '../../../styled';
import { 
  useNavigate, 
} from "react-router-dom";
 
const Layout = styled(Box)(({ theme, hide }) => ({
 margin: theme.spacing( hide ? 0 : 1), 
 width: hide ? 124 : 300
}));
 
const CalendarInput = ({ handler, hidden, onClose }) => {
  const navigate = useNavigate() 
  const { params, logo } = handler;
  const handleDateChange = date => {
    const start_date = apiDate(new Date(date)) 
    navigate(`/find/start_date/${start_date}`); 
  }
  return (
    <Layout data-testid="test-for-CalendarInput" hide={hidden}> 
      <Flex>
        {!hidden && <>
          <img src={logo} alt="eb" />
          <Spacer />       
        </>}
        {!!onClose && <TinyButton deg={hidden ? 180 : 0} icon={hidden ? "KeyboardArrowLeft" : "Close"} onClick={onClose} />}
      </Flex>
      {!hidden && <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar  value={dayjs(params.start_date)} onChange={handleDateChange} />
      </LocalizationProvider>}
    </Layout>
  );
}
CalendarInput.defaultProps = {};
export default CalendarInput;
