import React from 'react';
import {
  styled, 
  Box,
} from '@mui/material';
import throttle from 'lodash/throttle';
import { 
  TextIcon,
  TinyButton,
  IconTextField, 
} from '../../../styled'; 

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const EventSearch = (props) => {
  const ref = React.useRef(null);
  const { 
    settings,
    handler,
  } = props; 
  const [inputValue, setInputValue] = React.useState('');
  const searching = handler.state.matches('searching');  

  const onValueChanged = React.useCallback(
    async ({ value }) => {
      handler.send({
        type: 'FIND',
        param: value,
      }); 
    },
    [handler]
  );
 
  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        onValueChanged && onValueChanged(request);
      }, 300),
    [onValueChanged]
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      // setOptions( []);
      return undefined;
    }

    if (isNaN(inputValue) && inputValue.length < 2) return; 
    if (inputValue === handler.param) return;

    if (active) {
      fetch({ value: inputValue }, (results) => { 
      });
    }

    return () => {
      active = false;
    };
  }, [inputValue, fetch, handler.param]);
 
  return (
    <Layout>  
      <IconTextField
        thin
        autoFocus
        startIcon={
          <TextIcon
            className={searching ? 'App-logo' : ''}
            icon={searching ? 'Sync' : 'Search'}
          />
        }
        endIcon={
          <>
            <TinyButton
              onClick={settings.handleClick}
              icon={'PhonelinkSetup'}
            />
            {!inputValue ? null : (
              <TinyButton
                onClick={() => {
                  handler.send('EXIT');
                  setInputValue('');
                }}
                icon={'Close'}
              />
            )}
          </>
        }
        ref={ref}
        size="small"
        fullWidth
        value={inputValue}
        placeholder="Start typing an event name or date (use commas to search by multiple values)"
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Layout>
  );
 
};
EventSearch.defaultProps = {};
export default EventSearch;
