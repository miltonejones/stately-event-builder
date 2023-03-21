import React from 'react';
import Rooms from './Rooms';
 
export default {
 title: 'Rooms',
 component: Rooms
};
 
const Template = (args) => <Rooms {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
