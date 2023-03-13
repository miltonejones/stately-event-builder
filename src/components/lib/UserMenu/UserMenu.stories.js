import React from 'react';
import UserMenu from './UserMenu';
 
export default {
 title: 'UserMenu',
 component: UserMenu
};
 
const Template = (args) => <UserMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
