import React from 'react';
import AppsMenu from './AppsMenu';
 
export default {
 title: 'AppsMenu',
 component: AppsMenu
};
 
const Template = (args) => <AppsMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
