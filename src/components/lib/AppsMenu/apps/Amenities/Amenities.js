import React from 'react';
import { styled, Box, Autocomplete, TextField , Collapse, MenuItem} from '@mui/material';
import {
  // Flex,
  Nowrap,
  // Btn,
  // reportItem,
  // Spacer,
  TinyButton,
  // TextIcon,
  Columns,
} from '../../../../../styled';
import { shuffle } from '../../../../../util/shuffle';

const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));


const Specimen = ({ item, children, ...props }) => {
  
  const renderOption = (props, option) => { 
    return <Box {...props} >
      {option.display_text}  
    </Box>;
  };

  if (item.type_name === 'list') {

    return (
      <Autocomplete 
        options={item.items}
        multiple
        value={shuffle(item.items).slice(0, 3)}
        getOptionLabel={(option) => option.display_text}
        renderOption={renderOption} 
        renderInput={(params) => <TextField {...params} fullWidth size="small"  label={item.property_name} />} 
    />
    )
  }


  return <TextField {...props}>
 {children}   
  </TextField>
}


 
const Amenities = ({ handler, children }) => {
  const columns = "22px 150px 150px 360px";
  const fields = [
    {
      label: 'Name',
      field: 'property_name'
    },
    {
      label: 'Type',
      field: 'type_name'
    },
    {
      label: 'Ea.',
      field: 'property_each'
    },
  ]
 return (
   <Layout data-testid="test-for-Amenities">
    <Collapse in={handler.state.matches('idle')}>
      <Columns sx={{ mb: 2 }} spacing={1} columns={columns}>
        <Box />
        <Nowrap bold>Name</Nowrap>
        <Nowrap bold>Type</Nowrap>
        <Nowrap bold>Specimen</Nowrap>
      </Columns>
      {handler.items.map(item => <Columns sx={{ mb: 1 }} spacing={1} columns={columns}>
        <TinyButton icon="Delete" />
          <Nowrap hover onClick={() => handler.send({
            type: 'EDIT',
            ID: item.ID,
            title: item.property_name
          })}>{item.property_name}</Nowrap>
          <Box>{item.type_name}</Box>
          <Box>
            <Specimen 
              size="small"
              label={item.property_name}
              fullWidth
              item={item}
              value={item.property_each}
              select={['dropdown', 'list'].some(f => item.type_name === f)}
              >
                {item.items?.map(e => <MenuItem value={e.display_value}>{e.display_text}</MenuItem>)}
              </Specimen>
          </Box>
          {/* <Box>{item.property_each}</Box> */}
      </Columns>)}
    </Collapse>

    <Collapse in={handler.state.matches('editing')}>
      
    {!!handler.item && <Columns sx={{ mb: 2 }} spacing={1} columns="260px 200px 140px">
        {fields.map(col => <TextField 
          key={col.field}
          label={col.label}
          size="small"
          value={handler.item[col.field]}
          />)} 
      </Columns>}

      <Columns sx={{ mb: 2 }} spacing={1} columns="24px 276px 300px">
        <Box />
        <Nowrap bold>Text</Nowrap>
        <Nowrap bold>Value</Nowrap>
      </Columns>
      
      {!!handler.item && handler.item.items?.map(col => <Columns 
        columns="24px 276px 300px"
        sx={{ mb: 1 }} spacing={1} key={col.display_value}>
          <TinyButton icon="Delete" />
        <TextField   
          size="small"
          value={col.display_text}
          />
        <TextField   
          size="small"
          value={col.display_value}
          />
      </Columns>)}

{/* 
      <Flex sx={{mt: 2}} spacing={1}>
         
        <Spacer />
        <Btn onClick={() => handler.send('EXIT')}>Cancel</Btn>
        <Btn onClick={() => handler.send('UPDATE')} variant="contained" disabled={!handler.dirty}>Save</Btn>
      </Flex> */}

    </Collapse>

    {children}

     {/* <pre>
      {JSON.stringify(handler.items,0,2)}
     </pre> */}
   </Layout>
 );
}
Amenities.defaultProps = {};
export default Amenities;
