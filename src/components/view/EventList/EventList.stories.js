import React from 'react';
import EventList from './EventList';
 
export default {
 title: 'EventList',
 component: EventList
};
 
const Template = (args) => <EventList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
