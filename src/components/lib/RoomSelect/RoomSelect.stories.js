import React from 'react';
import RoomSelect from './RoomSelect';
 
export default {
 title: 'RoomSelect',
 component: RoomSelect
};
 
const Template = (args) => <RoomSelect {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
