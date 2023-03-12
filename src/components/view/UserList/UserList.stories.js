import React from 'react';
import UserList from './UserList';
 
export default {
 title: 'UserList',
 component: UserList
};
 
const Template = (args) => <UserList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
