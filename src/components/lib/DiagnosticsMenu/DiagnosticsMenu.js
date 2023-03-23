import React from "react";
import { Drawer, Box, Typography } from "@mui/material";
import Diagnostics from "../Diagnostics/Diagnostics";
// import { useMenu } from "../../../machines";
import { Flex, Nowrap } from "../../../styled";
 
 
const DiagnosticsMenu = ({ machines = [],  menu, value, handler }) => {
 

  return (
    <>



{/* <TextIcon icon="Settings"  onClick={menu.handleClick}/> */}

 

      <Drawer
        anchor="right"
        open={menu.state.matches("opened")}
        onClose={menu.handleClose()}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Select a state machine to view its status {value}.</Typography>

          {machines.map((mac) => (
            <Flex
              key={mac.diagnosticProps.id}
              onClick={menu.handleClose(mac.diagnosticProps.id)}
              sx={{ width: 300, p: 1 }}
            >
              <Nowrap sx={{textTransform: 'capitalize'}} bold={value === mac.diagnosticProps.id}> {mac.diagnosticProps.id.replace('_', ' ')} </Nowrap>
            </Flex>
          ))}
        </Box>
      </Drawer>
      <Diagnostics handler={handler} {...menu.diagnosticProps} />
    </>
  );
}
DiagnosticsMenu.defaultProps = {};
export default DiagnosticsMenu;
