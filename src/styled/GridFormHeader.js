import React from 'react';
import Nowrap from './Nowrap';
import Flex from './Flex';
import Spacer from './Spacer';
import TinyButton from './TinyButton';

const GridFormHeader = ({
  icon,
  title,
  error,
  handleClose,
  handleSave,
  handleUndo,
  dirty,
  children, 
  ...props
}) => {
  return (
    <Flex spacing={1} {...props} sx={{ mb: 0, ...props.sx }} >
      {!!icon && <TinyButton color={error ? "error" : "inherit"} icon={icon} />}
      <Nowrap color={error ? "error" : "inherit"} bold={error || dirty}>{title}</Nowrap>
      {!!dirty && <>*</>}
      <Spacer />
      {children}
      {!!handleUndo && (
        <TinyButton
          onClick={handleUndo}
          disabled={!dirty || error}
          icon={'Undo'}
        />
      )}
      {!!handleSave && (
        <TinyButton
          onClick={handleSave}
          disabled={!dirty || error}
          icon={'Save'}
        />
      )}
      {!!handleClose && (
        <TinyButton
          color={error ? 'error' : 'inherit'}
          onClick={handleClose}
          icon={error ? 'Error' : dirty ? 'Circle' : 'Close'}
        />
      )}
    </Flex>
  );
};

export default GridFormHeader;
