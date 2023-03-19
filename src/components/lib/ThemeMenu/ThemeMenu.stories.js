import React from 'react';
import ThemeMenu from './ThemeMenu';
 
export default {
 title: 'ThemeMenu',
 component: ThemeMenu
};
 
const Template = (args) => <ThemeMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
