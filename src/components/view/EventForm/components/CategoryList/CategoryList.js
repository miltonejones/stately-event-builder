import React from 'react';
import { styled, Switch, Card, Collapse, Box } from '@mui/material';
import { Flex, Btn, GridFormHeader, TinyButton, Nowrap } from "../../../../../styled";
import { VIEW } from '../../../../../machines'; 

const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
  padding: theme.spacing(3, 2, 2, 2)
}));
 
const CategoryList = ({ handler, value, handleChange }) => {

  const onChange = (folderfk) => {
    const category = {
      folderfk,
      eventfk: handler.eventProp.ID
    };

    const updatedProp = value.find(f => f.folderfk === folderfk)
      ? value.filter(f => f.folderfk !== folderfk)
      : value.concat(category);
      
    handleChange('categories', updatedProp);
  }

  const expanded = handler.view & VIEW.OPTION_CATEGORY;
  const populated = !!value.length;

  const handleCollapse = () => {
    if (populated) {
      return handler.setProp('dropcat', true);
    }
    handler.setView(VIEW.OPTION_CATEGORY) 
  }


  return (
  <Layout>
    <GridFormHeader 
      title="Categories"
      icon="Class"
      sx={{ mb: expanded || populated ? 2 : 0 }}
    >
      <TinyButton 
      icon={populated ? "Delete" : "KeyboardArrowDown"} 
      deg={expanded && !populated ? 180 : 0}
      onClick={handleCollapse}   />
    </GridFormHeader>
    
    <Collapse in={handler.props.dropcat}>
        <Box >
         Remove all categories from this event?
         <Btn
          onClick={() =>  handler.setProp('dropcat', false)}
         >No</Btn>
        </Box>
    </Collapse>

    <Collapse in={(expanded || populated) && !handler.props.dropcat}>
        <Box>
        {handler.categories.map(cat => (
          <Flex onClick={() => onChange(cat.ID)} key={cat.ID}>
            <Switch checked={value.find(f => f.folderfk === cat.ID)} /> 
            <Nowrap muted small>{cat.title}</Nowrap>
          </Flex>
        ))} 
        </Box>
    </Collapse>

    {/* {JSON.stringify(value)} */}
  </Layout>
  );
}
CategoryList.defaultProps = {};
export default CategoryList;
