
import React from 'react';
import { styled, Box } from '@mui/material';
import TinyButton from './TinyButton';
import Spacer from './Spacer';
import Nowrap from './Nowrap';

const Area = styled(Box)(({ filled, severity, theme }) => ({
  display: 'flex',
  alignItems: 'center', 
  backgroundColor: filled ? theme.palette[severity].dark : theme.palette.common.white,
  border: filled ? "" : 'solid 1px ' + theme.palette[severity].dark,
  color: filled ? theme.palette.common.white : theme.palette[severity].dark,
  width: '100%',
  padding: theme.spacing(0.3, 1),
  borderRadius: theme.spacing(0.5),
  gap: 1
}))
 
const Warn = ({severity = "info", filled, children, onDismiss, ...props})  => {
  const icons = {
    info: "Info",
    warning: "WarningAmber",
    error: "Error",
    success: "CheckCircle"
  }
  return <Area filled={filled} severity={severity} {...props}>
    <TinyButton color="inherit" icon={icons[severity]} />
    <Nowrap variant="body2">{children}</Nowrap>
    <Spacer />
    {!!onDismiss && <TinyButton color="inherit" onClick={onDismiss} icon={"Close"} />}
  </Area>
}


export default Warn;
