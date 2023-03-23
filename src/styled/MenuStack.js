
import React from 'react';
import { MenuItem, Stack, ListItemIcon } from '@mui/material';
import TextIcon from './TextIcon';
import Nowrap from './Nowrap';

const MenuStack = ({icon, children, caption, bold, error, ...props}) => {
  return (<MenuItem {...props}>
  <ListItemIcon color={error?"error":"inherit"}>
    <TextIcon icon={icon} />
  </ListItemIcon>

  <Stack>
    <Nowrap bold={bold} color={error?"error":"inherit"}>{children}</Nowrap>
   {!!caption && <Nowrap muted color={error?"error":"inherit"} small>
       {caption}
    </Nowrap>}
  </Stack>
</MenuItem>)
}

export default MenuStack;
