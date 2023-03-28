import React from "react";
import {
  styled,
  // Autocomplete,
  // Menu,
  // MenuItem,
  // Avatar,
  // // TextField,
  // Stack,
  Box,
} from "@mui/material";
import throttle from "lodash/throttle";
import { 
  // Nowrap, 
  // Flex, 
  TextIcon, 
  TinyButton,
  IconTextField, 
  // Spacer 
} from "../../../styled";
// import { initials } from "../../../util/initials";
// import { searchEvents } from "../../../connector";
// import { useEventSearch } from "../../../machines";

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const EventSearch = (props) => {
  const ref = React.useRef(null);
  const { 
    // onValueSelected, 
    settings,
    handler } = props;
  // const [value] = React.useState(props.value);
  const [inputValue, setInputValue] = React.useState("");
  const searching = handler.state.matches('searching')
  // const [options, setOptions] = React.useState([]);

  // const [autocompleteOptions, setAutocompleteOptions] = React.useState([]);

  // React.useEffect(() => {
  //   setAutocompleteOptions(handler.options);
  // }, [handler.options]);

  const onValueChanged = React.useCallback(
    async ({ value }) => {
      handler.send({
        type: "FIND",
        param: value,
      });
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
      // setOptions(options); 4/1/2023
    },
    [handler]
  );

  // const renderOption = (option) => {
  //   const user = handler.users?.find((u) => u.ID === option?.CreateLogin);

  //   return (
  //     <MenuItem value={option.ID}>
  //       <Flex spacing={1} sx={{ width: "100%" }}>
  //         {!!option.icon && (
  //           <Avatar>
  //             <TextIcon icon={option.icon} />
  //           </Avatar>
  //         )}
  //         {!!option.FullName && !option.icon && (
  //           <Avatar src={user?.image} alt={option.FullName}>
  //             {initials(option.FullName)}
  //           </Avatar>
  //         )}
  //         <Stack>
  //           <Box>{option.EventName}</Box>
  //           {!!option.RoomNames && (
  //             <Box>
  //               <Nowrap small>{option.RoomNames}</Nowrap>
  //             </Box>
  //           )}
  //         </Stack>
  //         <Spacer />
  //         {!!option.CustomDate && (
  //           <Box>
  //             <Nowrap small>{option.CustomDate}</Nowrap>
  //           </Box>
  //         )}
  //       </Flex>
  //     </MenuItem>
  //   );
  // };

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

    if (isNaN (inputValue)  && 
      inputValue.length < 2) return;

    // if (inputValue.length < 3) return;
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

  // if (handler.auto) {
  //   return (
  //       <Layout data-testid="test-for-EventSearch">
  //         <Autocomplete
  //             sx={{
  //               color: 'white',
  //               '& .MuiAutocomplete-root': {
  //                 color: 'white'
  //               }
  //             }}
  //             renderOption={renderOption}
  //             getOptionLabel={(option) => option.EventName || option}
  //             options={handler.options}
  //             value={handler.param}
  //             open={true}
  //             onOpen={console.log}
  //             onChange={(event, newValue) => {
  //               onValueSelected && onValueSelected(newValue);
  //             }}
  //             onInputChange={(event, newInputValue) => {
  //               setInputValue(newInputValue);
  //             }}
  //             renderInput={(params) => (
  //               <TextField
  //                 placeholder="Start typing an event name"
  //                 {...params}
  //                 size={"small"}
  //                 InputProps={{
  //                   ...params.InputProps,
  //                   style: { backgroundColor: "white" } // set input text color to white
  //                 }}
  //               />
  //             )}
  //           />??
  //       </Layout>
  //   )
  // } 4/1/2023
  //  console.table(handler.options)

  return (
    <Layout>
      {/* [{handler.options.length}] */}
      <IconTextField
        autoFocus
        startIcon={<TextIcon className={searching ? "App-logo" : ""} icon={searching ? "Sync" : "Search"} />}
        endIcon={(<>
        <TinyButton
          onClick={settings.handleClick}
          icon={"PhonelinkSetup"} />
        {!inputValue ? null : <TinyButton
          onClick={() => {
            handler.send('EXIT');
            setInputValue("")
          }}
          icon={"Close"} />}
        </>)}
        ref={ref} 
        size="small"
        fullWidth
        value={inputValue}
 
        placeholder="Start typing an event name or date"
        onChange={(e) => setInputValue(e.target.value)}
    
     /> 
    </Layout>
  );

  //  return (
  //    <Layout data-testid="test-for-EventSearch">
  //    {/* [{handler.options.length}] */}
  //      <Autocomplete
  //         sx={{
  //           color: 'white',
  //           '& .MuiAutocomplete-root': {
  //             color: 'white'
  //           }
  //         }}
  //         open={handler.auto || handler.options.length}
  //         onOpen={console.log}
  //         renderOption={renderOption}
  //         getOptionLabel={(option) => option.EventName || option}
  //         options={autocompleteOptions}
  //         value={handler.param}
  //         onBlur={() => handler.send('EXIT')}
  //         onChange={(event, newValue) => {
  //           onValueSelected && onValueSelected(newValue);
  //         }}
  //         onInputChange={(event, newInputValue) => {
  //           setInputValue(newInputValue);
  //         }}
  //         renderInput={(params) => (
  //           <TextField
  //             placeholder="Start typing an event name or date"
  //             {...params}
  //             size={"small"}
  //             InputProps={{
  //               ...params.InputProps,
  //               style: { backgroundColor: "white" } // set input text color to white
  //             }}
  //           />
  //         )}
  //       />
  //    </Layout>
  //  );
};
EventSearch.defaultProps = {};
export default EventSearch;
