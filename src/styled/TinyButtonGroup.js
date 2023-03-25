
import React from 'react';
import { styled, Box } from '@mui/material';
import TinyButton from './TinyButton';
  
const TinyBox = styled(Box)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.common.white : theme.palette.primary.dark,
  padding: theme.spacing(0, 0.5),
  color: !active ? theme.palette.common.white : theme.palette.primary.dark,
  border: 'solid 1px ' + theme.palette.common.white,
  '&:last-child': {
    borderRadius: theme.spacing(0, .5, .5, 0)
  },
  '&:first-child': {
    borderRadius: theme.spacing(.5, 0, 0, .5)
  }
}))


const TinyButtonGroup = ({ buttons, value, values = [], onChange, ...props }) => {
  const sx = {
    display: "grid",
    gridTemplateColumns: buttons.map(f => '1fr').join(" ")
  }

  return <Box {...props} sx={{...props.sx, ...sx}}>
    {buttons.map((button, i) => <TinyBox first={i === 0} active={values[i] === value}
    onClick={e => onChange(e, values[i])} > 
      <TinyButton color="inherit" key={button} icon={button} />
    </TinyBox>)}
  </Box>
}

export default TinyButtonGroup;
