import React from 'react';
import { Popover, Stack, Box, Collapse, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useMenu } from '../machines';
import Flex from './Flex';
import Spacer from './Spacer';
import Nowrap from './Nowrap';
import TinyButton from './TinyButton';
import Btn from './Btn';

const TextPopover = ({
  button,
  children,
  value,
  description,
  onChange,
  okayText = 'Okay',
  ...props
}) => {
  const menu = useMenu((val) => {
    !!val && onChange({ name: props.name, target: { value: val } });
  });

  const handleChange = (event) => {
    menu.send({
      type: 'change',
      key: event.target.name,
      value: event.target.value,
    });
  };
  const error = menu.state.matches('opened.confirm');
  return (
    <>
      <Box onClick={(e) => menu.handleClick(e, { [props.name]: value })}>
        {button}
      </Box>

      <Popover
        anchorEl={menu.anchorEl}
        onClose={menu.handleClose()}
        open={Boolean(menu.anchorEl)}
      >
        <Stack sx={{ backgroundColor: 'white' }}>
          <Stack sx={{ p: 2, minWidth: 400 }} spacing={2}>
            <Flex sx={{ mb: 0 }} spacing={1}>
              <Nowrap small muted>
                {props.label}
              </Nowrap>
              <Spacer />
              {!!menu.data && (
                <TinyButton
                  disabled={!menu.dirty}
                  color="primary"
                  icon="Save"
                  onClick={menu.handleClose(menu.data[props.name])}
                />
              )}
              <TinyButton icon="Close" onClick={menu.handleClose()} />
            </Flex>

            <Nowrap variant="body1">{description}</Nowrap>

            {!!menu.data && (
              <TextField
                autoFocus
                onKeyUp={(e) =>
                  e.keyCode === 13 && menu.handleClose(menu.data[props.name])(e)
                }
                error={error}
                disabled={error}
                helperText={
                  error
                    ? 'If you close now you will lose your unsaved changes!'
                    : ''
                }
                size="small"
                autoComplete="off"
                value={menu.data[props.name]}
                onChange={handleChange}
                {...props}
              />
            )}
          </Stack>
          <Flex
            sx={{
              p: 2,
              backgroundColor: (t) => t.palette.grey[200],
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Spacer />
            <Collapse orientation="horizontal" in={error}>
              <Flex spacing={1}>
                <Btn onClick={() => menu.send('cancel')} variant="contained">
                  cancel
                </Btn>
                <Btn
                  onClick={() => menu.send('ok')}
                  variant="contained"
                  color="error"
                >
                  close anyway
                </Btn>
              </Flex>
            </Collapse>

            <Collapse orientation="horizontal" in={!error}>
              <Flex spacing={1}>
                <Btn onClick={menu.handleClose()}>cancel</Btn>
                {!!menu.data && (
                  <Btn
                    disabled={!menu.dirty}
                    onClick={menu.handleClose(menu.data[props.name])}
                    variant="contained"
                  >
                    {okayText}
                  </Btn>
                )}
              </Flex>
            </Collapse>
          </Flex>
        </Stack>
      </Popover>
    </>
  );
};

const IconTextField = ({ endIcon, startIcon, prompt, ...props }) => {
  if (prompt) {
    return <TextPopover {...props} />;
  }
  const startAdornment = !!startIcon ? (
    <InputAdornment position="start">{startIcon}</InputAdornment>
  ) : null;

  const endAdornment = !!endIcon ? (
    <InputAdornment sx={{ cursor: 'pointer' }} position="end">
      {endIcon}
    </InputAdornment>
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
