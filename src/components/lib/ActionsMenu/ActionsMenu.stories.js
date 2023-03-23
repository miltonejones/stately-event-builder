import React from 'react';
import ActionsMenu from './ActionsMenu';
 
export default {
 title: 'ActionsMenu',
 component: ActionsMenu
};
 
const Template = (args) => <ActionsMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
