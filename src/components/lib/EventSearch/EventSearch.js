import React from "react";
import { styled, Autocomplete, Avatar, TextField, Stack, Box } from "@mui/material";
import throttle from "lodash/throttle";
import { Nowrap, Flex, Spacer } from "../../../styled";
import { initials } from "../../../util/initials";
// import { searchEvents } from "../../../connector";
// import { useEventSearch } from "../../../machines";
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const EventSearch = (props) => { 
  const { onValueSelected, handler } = props;
  // const [value] = React.useState(props.value);
  const [inputValue, setInputValue] = React.useState("");
  // const [options, setOptions] = React.useState([]);

  const onValueChanged = React.useCallback(async ({ value }) => {
    handler.send({
      type: 'FIND',
      param: value
    })
    // if (!value?.length) return;
    // const opts = await searchEvents({
    //   title: value,
    //   order: "ID DESC"
    // }); 
    // const options = [
    //   {
    //     EventName: `Create new event named "${value}"`, 
    //     value,
    //     create: 1,
    //   },
    //   {
    //     EventName: `Show all ${opts.length} results`,
    //     RoomNames: "This is the footer",
    //     value,
    //     show: 1,
    //   },
    //   ...opts?.slice(0, 6)
    // ] ;
    // console.log ({ options })
    // setOptions(options); 
  }, [handler]);

  const renderOption = (props, option) => {
    const user = handler.users?.find(u => u.ID === option?.CreateLogin)
   
    return <>
    <Flex {...props} sx={{textAlign: 'left'}} spacing={1}>
      {!!option.FullName && <Avatar src={user?.image} alt={option.FullName}>{initials(option.FullName)}</Avatar>}
      <Stack>
      <Box>{option.EventName}</Box>
    {!!option.RoomNames && <Box><Nowrap variant="caption">{option.RoomNames}</Nowrap></Box>}
      </Stack>
      <Spacer />
    {!!option.CustomDate && <Box><Nowrap variant="caption">{option.CustomDate}</Nowrap></Box>}
    </Flex>

    </>;
  };

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        onValueChanged && onValueChanged(request);
      }, 300),
    [onValueChanged]
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      // setOptions( []);
      return undefined;
    }

    if  (inputValue.length < 2) return;
    if (inputValue === handler.param) return;

    if (active) {
      fetch({ value: inputValue }, (results) => {
        // if (active) {
        //   let newOptions = [];
  
        //   if (value) {
        //     newOptions = [value];
        //   }
  
        //   if (results) {
        //     newOptions = [...newOptions, ...results];
        //   }
  
        //   setOptions(newOptions);
        // }
      });
    }

    return () => {
      active = false;
    };
  }, [inputValue, fetch, handler.param]);

  // const open = handler.auto ? { open: true } : {};
 

 return (
   <Layout data-testid="test-for-EventSearch">
   {/* {JSON.stringify(handler.state.value)}--
   {JSON.stringify(handler.auto)} */}
     <Autocomplete
            sx={{
              color: 'white', 
              '& .MuiAutocomplete-root': {
                color: 'white'
              }
            }}
        renderOption={renderOption}
        getOptionLabel={(option) => option.EventName || option}
        options={handler.options}
        value={handler.param}
        open={handler.auto || handler.options.length}
        onOpen={console.log}
        onChange={(event, newValue) => {
          onValueSelected && onValueSelected(newValue); 
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField  
            placeholder="Start typing an event name"
            {...params}
            size={"small"} 
            InputProps={{
              ...params.InputProps,
              style: { backgroundColor: "white" } // set input text color to white
            }}
          />
        )}
      />
   </Layout>
 );
}
EventSearch.defaultProps = {};
export default EventSearch;
