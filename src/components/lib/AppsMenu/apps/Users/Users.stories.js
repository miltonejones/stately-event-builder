import React from 'react';
import Users from './Users';
 
export default {
 title: 'Users',
 component: Users
};
 
const Template = (args) => <Users {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
