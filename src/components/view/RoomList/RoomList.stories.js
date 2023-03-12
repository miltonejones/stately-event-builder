import React from 'react';
import RoomList from './RoomList';
 
export default {
 title: 'RoomList',
 component: RoomList
};
 
const Template = (args) => <RoomList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
