import React from 'react';
import Amenities from './Amenities';
import { APPTYPE, useSimpleList } from '../../../../../machines';
import { Btn } from '../../../../../styled';
 
export default {
 title: 'Amenities',
 component: Amenities
};
 
const Template = (args) =>{

  const appslist = useSimpleList(APPTYPE.AMENITY);
  return <>
  <Btn onClick={ () => appslist.send({
        type: 'LOAD',
        choice: APPTYPE.AMENITY
      })}>open</Btn>
  <Amenities handler={appslist} {...args} />
  </>
};
export const DefaultView = Template.bind({});
DefaultView.args = {};
