import React from 'react';
import Amenities from './Amenities';
 
export default {
 title: 'Amenities',
 component: Amenities
};
 
const Template = (args) => <Amenities {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
