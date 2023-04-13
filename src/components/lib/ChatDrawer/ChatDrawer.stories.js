import React from 'react';
import ChatDrawer from './ChatDrawer';
 
export default {
 title: 'ChatDrawer',
 component: ChatDrawer
};
 
const Template = (args) => <ChatDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
