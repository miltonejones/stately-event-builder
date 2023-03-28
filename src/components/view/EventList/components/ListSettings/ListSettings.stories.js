import React from 'react';
import ListSettings from './ListSettings';
 
export default {
 title: 'ListSettings',
 component: ListSettings
};
 
const Template = (args) => <ListSettings {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
