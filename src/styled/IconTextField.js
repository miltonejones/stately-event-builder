import React from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

const IconTextField = ({ endIcon, startIcon, pill, ...props }) => {
  if (pill) {
    return <>pill</>
  }
  const startAdornment = !!startIcon ? (
    <InputAdornment position="start">{startIcon}</InputAdornment>
  ) : null;

  const endAdornment = !!endIcon ? (
    <InputAdornment sx={{ cursor: 'pointer' }} position="end">{endIcon}</InputAdornment>
  ) : null;

  return (
    <TextField
      size="small"
      autoComplete="off"
      InputProps={{ startAdornment, endAdornment, ...props.InputProps }}
      {...props}
    />
  );
};

export default IconTextField;
