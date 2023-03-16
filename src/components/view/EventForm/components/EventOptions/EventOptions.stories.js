import React from 'react';
import EventOptions from './EventOptions';
 
export default {
 title: 'EventOptions',
 component: EventOptions
};
 
const Template = (args) => <EventOptions {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
