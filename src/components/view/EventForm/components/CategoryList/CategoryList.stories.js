import React from 'react';
import CategoryList from './CategoryList';
 
export default {
 title: 'CategoryList',
 component: CategoryList
};
 
const Template = (args) => <CategoryList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
