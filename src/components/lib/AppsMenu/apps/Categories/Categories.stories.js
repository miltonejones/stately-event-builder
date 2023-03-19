import React from 'react';
import Categories from './Categories';
 
export default {
 title: 'Categories',
 component: Categories
};
 
const Template = (args) => <Categories {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
