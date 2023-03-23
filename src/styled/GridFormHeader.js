
import React from 'react'; 
import Nowrap from './Nowrap';
import Flex from './Flex';
import Spacer from './Spacer';
import TinyButton from './TinyButton';

const GridFormHeader = ({ icon, title, handleClose, handleSave, handleUndo, dirty, error }) => {
  return (
    <Flex spacing={1} sx={{ mb: 2 }}>
    {!!icon && <TinyButton icon={icon} />}
    <Nowrap bold={dirty}>{title}</Nowrap>{!!dirty && <>*</>}
    <Spacer />
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
      <TinyButton  color={error ? "error" : "inherit"} onClick={handleClose} icon={error ? "Error" : dirty ? 'Circle' : 'Close'} />
    )}
  </Flex>
  )
}

export default GridFormHeader;
