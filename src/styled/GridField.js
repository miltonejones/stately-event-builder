
import React from 'react';
import { MenuItem, Autocomplete, TextField, Avatar } from '@mui/material';
import IconTextField from './IconTextField';
import TextIcon from './TextIcon';
import Flex from './Flex';

const GridField = ({type, options,...props}) => { 

  if (type === 'auto') {

    return <>
    <Autocomplete
    options={options} 
    {...props} 
    name={props.name}
    onChange={(_, value) => {
      props.onChange({ target: { name: props.name, value }})
    }}
    renderOption={props.renderOption}
    renderInput={(params) => (
      <TextField {...params} 
      fullWidth size="small" label={props.label} />
    )}

  />  
    </>
  }

  return <IconTextField 
    select={!!options}
    prompt={type === 'avatar'} 
    button={ 
      <Avatar src={props.value} alt="user avatar" 
      size="small" sx={{ cursor: 'pointer', width: 32, height: 32 }}
      ><TextIcon icon="Person" /></Avatar>
      } 
      description={<Flex sx={{mb: 1}} spacing={1}>
        <Avatar src={props.value} alt="value" />
        Edit the image that is displayed in the user profile.</Flex>}
      placeholder={`Type or paste the URL to a JPG or PNG image`}
      okayText={`Save image`}


    {...props} 
     >

      {options?.map(opt => <MenuItem value={opt.value}>{opt.label}</MenuItem>)}
     </IconTextField>
}

export default GridField;
