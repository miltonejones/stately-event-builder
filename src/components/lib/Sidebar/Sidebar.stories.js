import React from 'react';
import Sidebar from './Sidebar';
 
export default {
 title: 'Sidebar',
 component: Sidebar
};
 
const Template = (args) => <Sidebar {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
