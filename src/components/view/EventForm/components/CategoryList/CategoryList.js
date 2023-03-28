import React from 'react';
import { styled, Stack, Card, Collapse } from '@mui/material';
import { Flex, Check, ConfirmPop, GridFormHeader, TinyButton, Nowrap } from "../../../../../styled";
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
      {!!populated && <ConfirmPop 
        message="Remove all categories from this event?"
        onChange={(ok) =>  {
          if (!ok) return;
          handleChange('categories', []);
          handler.setProp('dropcat', false);
        }}>
        <TinyButton icon="Delete" />
      </ConfirmPop>}


      {!populated && <TinyButton 
        icon={populated ? "Delete" : "KeyboardArrowDown"} 
        deg={expanded && !populated ? 180 : 0}
        onClick={handleCollapse}   />}
    </GridFormHeader>
   
    <Collapse in={expanded || populated}>
        <Stack spacing={1}>
        {handler.categories.map(cat => (
          <Flex spacing={1} onClick={() => onChange(cat.ID)} key={cat.ID}>
            <Check on={value.find(f => f.folderfk === cat.ID)} /> 
            <Nowrap bold={value.find(f => f.folderfk === cat.ID)}  hover muted small>{cat.title}</Nowrap>
          </Flex>
        ))} 
        </Stack>
    </Collapse>

    {/* {JSON.stringify(value)} */}
  </Layout>
  );
}
CategoryList.defaultProps = {};
export default CategoryList;
