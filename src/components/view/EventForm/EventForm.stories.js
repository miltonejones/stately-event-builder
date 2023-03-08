import React from 'react';
import EventForm from './EventForm';
 
export default {
 title: 'EventForm',
 component: EventForm
};
 
const Template = (args) => <EventForm {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
