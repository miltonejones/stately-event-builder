import React from 'react';
import { styled, Dialog,  Box } from '@mui/material';
import { 
  // TextIcon, 
  Columns,
  Nowrap,
  GridFormHeader,
  Flex,
  Spacer,
  Btn
} from '../../../styled';
// import { useMenu } from "../../../machines";
import { themeTypes } from '../../../colors';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0, 2),
 width: 500
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
 

 return (
<>
{/* <TextIcon 
  icon="Palette"
  onClick={handler.handleClick}
      /> */}

<Dialog
  maxWidth="md"
  onClose={handler.handleClose()}  
  open={handler.state.matches('opened')}
  >
    <Box sx={{p: 1}}>

    <GridFormHeader 
      icon="Palette"
      title="Choose theme"
      handleClose={handler.handleClose()}  
    />
    </Box>
   <Layout data-testid="test-for-ThemeMenu"> 

    {Object.keys(themeNames).map(f => <Columns
    
      sx={{ mb: 1 }} spacing={0} columns="160px 48px 48px 48px 48px" key={f}>
      <Nowrap hover onClick={handler.handleClose(f)}>{themeNames[f]}</Nowrap>
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
   <Flex sx={{p: 2, borderTop: 1, borderColor: 'divider', mt:  2, backgroundColor: t => t.palette.grey[200]}}>
    <Spacer />
    <Btn
  onClick={handler.handleClose()}  >Close</Btn>
   </Flex>
  </Dialog>
  
</>

 );
}
ThemeMenu.defaultProps = {};
export default ThemeMenu;
