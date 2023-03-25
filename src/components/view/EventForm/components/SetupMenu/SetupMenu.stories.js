import React from 'react';
import SetupMenu from './SetupMenu';
 
export default {
 title: 'SetupMenu',
 component: SetupMenu
};
 
const Template = (args) => <SetupMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
