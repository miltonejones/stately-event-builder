import React from 'react';
import { styled, Box, Stack, Badge, Autocomplete, TextField , Collapse, MenuItem} from '@mui/material';
import {
  Flex,
  Nowrap,
  // Btn,
  // reportItem,
  IconTextField,
  Spacer,
  TinyButton,
  ConfirmPop,
  // GridForm,
  // TextIcon,
  Columns,
} from '../../../../../styled'; 
import { uniqueId } from '../../../../../util/uniqueId';
import AppForm from '../../components/AppForm/AppForm';

const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2),
 maxWidth: 640
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
        value={item.items.slice(0, 2)}
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
  const columns = "22px 150px 120px 300px";
  const fields = [
    {
      label: 'Name',
      caption: "The label that appears in the event form and reports.",
      field: 'property_name'
    },
    {
        label: 'Type',
        caption: "Select the type of input to display.",
        field: 'property_type',
        xs: 8,
        options: handler.subitems?.map(f => ({
          value: f.id,
          label: f.type_name
        }))
    },
    {
      label: 'Each',
      caption: "Price of each item, if applicable.",
      field: 'property_each',
      xs: 4
    },
  ]

  const handleDrop=( id) => { 
    handler.send({
      type: 'CHANGE',
      key: 'items',
      value: handler.item.items.filter(it => it.id !== id)
    })

  }

  const handleAdd = (event) => {
    handler.send({
      type: 'CHANGE',
      key: 'items',
      value: handler.item.items.concat({
        id: uniqueId(),
        display_text: event.target.value,
        display_value: event.target.value
      })
    })
  }

  const handleChange=(event, id) => {
    handler.send({
      type: 'CHANGE',
      key: 'items',
      value:  handler.item.items.map(it => it.id === id 
        ? ({
          ...it,
          [event.target.name]: event.target.value
        })
        : it)
    })

  }

 return (
   <Layout data-testid="test-for-Amenities">
    <Collapse in={handler.is('idle')}>
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

    <Collapse in={handler.is(['editing', 'confirm_close'])}>
      
    <AppForm sx={{ width: 640 }} handler={handler}  icon="Tune"  
      title="Edit amenity details" fields={fields} /> 


      <Stack sx={{ width: 640, p: 1, pr: 2 }}  spacing={0}>

      <Nowrap bold variant="body2">
         Specimen
        </Nowrap>

        <Nowrap small muted sx={{mb: 1}}>
          This is an example of what this amenity will look like on a form
        </Nowrap>

      {!!handler.item && <Specimen 
        size="small"
        label={handler.item.property_name}
        fullWidth
        item={handler.item}
        value={handler.item.property_each}
        select={['dropdown', 'list'].some(f => handler.item.type_name === f)}
        >
          {handler.item.items?.map(e => <MenuItem value={e.display_value}>{e.display_text}</MenuItem>)}
        </Specimen>}


      </Stack>


      {['list','dropdown'].some(f => handler.item?.type_name === f) && <>
      
      <Stack sx={{ mb: 2, ml: 1, m: t => t.spacing(1, 3, 3, 2) }}>

        <Flex spacing={1} sx={{ mt: 2 }}>
          <TinyButton icon="Settings" />
          <Badge badgeContent={handler.item?.items?.length} color="success"><Nowrap hover
            onClick={() => {
              handler.send({
                type: 'PROP',
                key: "expanded",
                value: !handler.expanded
              })
            }}
          bold>Amenity options  <TinyButton deg={handler.expanded ? 180 : 0} icon="KeyboardArrowDown" /></Nowrap></Badge>
          <Spacer />

          <IconTextField 
            prompt 
            button={<TinyButton icon="Add" />}
            icon="Tune"
            onChange={handleAdd}
            label={`Add new option`}
            name="option"
            description={`Enter a new  option label.`}
            placeholder={`Option label`}
            okayText={`Add`}
        />




          
        </Flex>


        <Nowrap small muted>
          Specify the options that appear in this {handler.item.type_name}.
        </Nowrap>
      </Stack>
            <Collapse in={handler.expanded}>
      
          <Columns sx={{ mb: 2 }} spacing={1} 
            columns="24px 232px 232px 100px"
          
          >
            <Box />
            <Nowrap bold>Text</Nowrap>
            <Nowrap bold>Value</Nowrap>
            <Nowrap bold>Each</Nowrap>
          </Columns>
          
          {!!handler.item && handler.item.items?.map(col => <Columns 
            columns="24px 232px 232px 100px"
            sx={{ mb: 1 }} spacing={1} key={col.display_value}>

        <ConfirmPop 
            label="Confirm delete"
            message={<>Are you sure you want to delete option <b>{col.display_text}</b>?</>} onChange={ok => {
            !!ok && handleDrop(col.id)
          }}><TinyButton icon="Delete" /></ConfirmPop>

            


            <TextField   
              size="small"
              name="display_text"
              value={col.display_text}
              onChange={e => handleChange(e, col.id)}
              />
            <TextField   
              size="small"
              name="display_value"
              value={col.display_value}
              onChange={e => handleChange(e, col.id)}
              />
            <TextField   
              size="small"
              name="item_each"
              value={col.item_each}
              onChange={e => handleChange(e, col.item_each)}
              />
          </Columns>)}

          

            </Collapse>
         
      </>}


      <Flex sx={{mt: 3}} spacing={1}>
        {children} 
      </Flex>

    </Collapse>


     {/* <pre>
      {JSON.stringify(handler.item,0,2)}
     </pre> */}
   </Layout>
 );
}
Amenities.defaultProps = {};
export default Amenities;
