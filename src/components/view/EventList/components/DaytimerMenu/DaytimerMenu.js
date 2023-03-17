import React from 'react';
import { styled, Box, Switch, Divider, Drawer } from '@mui/material';
import { useMenu } from "../../../../../machines";
import { TinyButton, Tooltag, Spacer, Nowrap, Flex } from "../../../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const DaytimerMenu = ({ onChange, handler, rooms }) => {
  const { excluded = []} = handler.props;
  const roomKeys = Object.keys(rooms) 
  const handleCheck = rm => {
    const updated = excluded.find(d => d === rm)
      ? excluded.filter(d => d !== rm)
      : excluded.concat(rm);

    handler.send({
      type: 'CHANGE',
      key: 'excluded',
      value: updated
    })
  }
 
  const menu = useMenu(onChange); 
 return (
  <>

      <Tooltag component={TinyButton} title="Open setting menu" 
        caption="Customize menu columns and settings"
        icon="Settings" onClick={menu.handleClick}/>
      <Drawer onClose={menu.handleClose()} 
        anchor="bottom"
        open={Boolean(menu.anchorEl) || handler.props.daytimerOpen}
      >
        <Layout>
          <Flex>
            <Nowrap variant="subtitle2">Select calendar rooms</Nowrap>
            <Spacer />
            <TinyButton icon="Close"  onClick={menu.handleClose()} />
          </Flex>
          <Divider />
         {roomKeys.map(rm => <Flex onClick={() => handleCheck(rm)} key={rm}
         >
          <Switch checked={!excluded.some(f => f === rm)} />
          {rm}</Flex>)}
        </Layout>

      </Drawer>

  </>
 );
}
DaytimerMenu.defaultProps = {};
export default DaytimerMenu;
