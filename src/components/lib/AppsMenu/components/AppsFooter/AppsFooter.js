import React from 'react';
import { Stack, Collapse } from '@mui/material';
import { 
  Flex, 
  Spacer, 
  IconTextField, 
  Nowrap, 
  TinyButton, 
  Btn 
} from '../../../../../styled';

const AppsFooter = ({ handler, anchor }) => {
  if (!handler) return <i />;

  return (
    <>
      <Collapse
        in={handler.is('idle')}
        orientation={anchor === 'bottom' ? 'horizontal' : 'vertical'}
        autoComplete="off"
      >
        <Flex wrap="nowrap" spacing={1}>
          <IconTextField
            prompt={anchor !== 'bottom'}
            endIcon={<TinyButton
              onClick={e => handler.send({
                type: 'PROP', 
                key: "filter",
                value: "",
              })}
              icon={!!handler.filter ? "Close" : "FilterAlt"} />}
            size="small"  
            placeholder={`Filter items`} 
            value={handler.filter}
            name="filter"
            onChange={e => handler.send({
              type: 'PROP', 
              key: e.target.name,
              value: e.target.value,
            })}
            label="Filter" />
        </Flex>
      </Collapse>

      <Collapse
        in={handler.is('confirm_close')}
        orientation={anchor === 'bottom' ? 'horizontal' : 'vertical'}
      >
        <Stack direction={anchor === 'bottom' ? 'row' : 'column'} spacing={1}>
          <Nowrap>You have unsaved changes</Nowrap>
          <Flex spacing={1}>
            <Btn variant="contained" onClick={() => handler.send('UPDATE')}>
              save
            </Btn>
            {anchor !== 'bottom' && <Spacer />}
            <Btn variant="outlined" onClick={() => handler.send('CANCEL')}>cancel</Btn>
            <Btn
              variant="contained"
              color="error"
              onClick={() => handler.send('OK')}
            >
              Don't save
            </Btn>
          </Flex>
        </Stack>
      </Collapse>

      <Collapse
        in={handler.is('editing.edit')}
        orientation={anchor === 'bottom' ? 'horizontal' : 'vertical'}
      >
        <Flex wrap="nowrap" spacing={1}>
          <Btn
            variant="contained"
            color="error"
            onClick={() => handler.send('DELETE')}
          >
            delete
          </Btn>
          {anchor !== 'bottom' && <Spacer />}
          <Btn onClick={() => handler.send('EXIT')}>cancel</Btn>
          <Btn
            disabled={!handler.dirty}
            variant="contained"
            onClick={() => handler.send('UPDATE')}
          >
            save
          </Btn>
        </Flex>
      </Collapse>
    </>
  );
};
AppsFooter.defaultProps = {};
export default AppsFooter;
