import React from 'react';
import { styled, Popover, Divider, Box } from '@mui/material';
import { 
  TextIcon, 
  Columns,
  Nowrap
} from '../../../styled';
import { useMenu } from "../../../machines";
import { themeTypes } from '../../../colors';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2)
}));
 
const themeNames = {
  primary: 'Default theme',
  secondary: "Purple Sage",
  error: "Roll Tide",
  warning: "Orange Crush",
  info: "Rain",
  success: "Forest"
}

const ThemeMenu = ({ handler }) => {

  const menu = useMenu(val => handler.send({
    type: 'CHANGE',
    key: 'theme',
    value: val
  }));


 return (
<>
<TextIcon 
  icon="Palette"
  onClick={menu.handleClick}
      />

<Popover
  
  onClose={menu.handleClose()} 
  anchorEl={menu.anchorEl}
  open={Boolean(menu.anchorEl)}
  >
   <Layout data-testid="test-for-ThemeMenu">
    <Nowrap>Choose theme:</Nowrap>
    
    <Divider sx={{ m: t => t.spacing(1, 0)}} />

    {Object.keys(themeNames).map(f => <Columns
    
      sx={{ mb: 1 }} spacing={0} columns="160px 48px 48px 48px 48px" key={f}>
      <Nowrap hover onClick={menu.handleClose(f)}>{themeNames[f]}</Nowrap>
      {Object.keys(themeTypes[f]).map(k => <Box
        sx={{
          backgroundColor: themeTypes[f][k],
          width: 48,
          height: 24,
          overflow: 'hidden'
        }}
      ></Box>)} 
    </Columns> )}
   </Layout>
  </Popover>
  
</>

 );
}
ThemeMenu.defaultProps = {};
export default ThemeMenu;
