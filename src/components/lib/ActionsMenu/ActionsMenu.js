import React from 'react';
import { Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { useMenu } from '../../../machines';
import { Btn, Nowrap, MenuStack, TextIcon } from '../../../styled';
import { APPTYPE } from '../../../machines';

const ActionsMenu = ({ handler, appslist, reports }) => {
  const handleReport = (ID) => {
    appslist.send({
      type: 'LOAD',
      choice: APPTYPE.REPORT,
      ID,
    });
  };

  const { editmode, excluded = [] } = handler.props;

  const actions = {
    edit: () => handler.setProp('editmode', !editmode),
  };
  const menu = useMenu((val) => {
    if (!val) return;
    const action = actions[val];
    if (action) {
      return action();
    }
    handleReport(val);
  });

  const opened =  menu.state.matches("opened") ;

  return (
    <>
      <Btn
        onClick={menu.handleClick}
        variant={opened ? "outlined" : "contained"}
        endIcon={<TextIcon className={
          opened
          ? "rotate up"
          : "rotate down"
        } icon="KeyboardArrowDown" />}
      >
        Actions
      </Btn>

      <Menu
        onClose={menu.handleClose()} 
        anchorEl={menu.anchorEl}
        open={menu.state.matches('opened')}
      >
        {handler.props.format === 1 && (
          <MenuStack 
            icon={editmode ? 'CheckCircle' : 'CheckCircleOutline'} 
            onClick={menu.handleClose('edit')}
            caption= {!!editmode
              ? 'Return to event edit mode.'
              : 'Choose multiple events at once.'}
            >
          {!!editmode ? 'Exit' : 'Enter'} select mode 
          </MenuStack>
        )}
        
        <MenuStack 
          icon={'BorderColor'} 
          onClick={menu.handleClose('report')}
          caption={"Add to or edit your custom report library."}
        >
         Edit reports...
        </MenuStack>
     
     
        
        {!!excluded.length && editmode && (
          <MenuStack 
            bold
            error
            icon={'Delete'} 
            onClick={menu.handleClose('report')}
            caption={"This action cannot be undone."}
          >
              Delete {excluded.length} events
          </MenuStack>
        )}

        <Divider textAlign="left">
          <Nowrap small muted>
            Open Report
          </Nowrap>
        </Divider>
        
        {reports?.map((report) => (
          <MenuItem onClick={menu.handleClose(report.ID)}>
            <ListItemIcon>
              <TextIcon icon="Summarize" />
            </ListItemIcon>

            <Nowrap hover>{report.title}</Nowrap>
          </MenuItem>
        ))}
 
      </Menu>
    </>
  );
};
ActionsMenu.defaultProps = {};
export default ActionsMenu;
