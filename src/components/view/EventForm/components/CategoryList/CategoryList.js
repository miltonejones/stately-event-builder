import React from 'react';
import { styled, Switch, Card, Box } from '@mui/material';
import { Flex, Banner, Nowrap } from "../../../../../styled";

const Layout = styled(Card)(({ theme }) => ({
  border: "solid 1px " + theme.palette.divider,
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
  return (
  <Layout>
    <Banner disabled><Nowrap small bold><b>Categories</b></Nowrap></Banner>
    <Box sx={{ m: 1 }}>
    {handler.categories.map(cat => (
      <Flex onClick={() => onChange(cat.ID)} key={cat.ID}>
        <Switch checked={value.find(f => f.folderfk === cat.ID)} /> 
        <Nowrap muted small>{cat.title}</Nowrap>
      </Flex>
    ))} 
    </Box>
    {/* {JSON.stringify(value)} */}
  </Layout>
  );
}
CategoryList.defaultProps = {};
export default CategoryList;
