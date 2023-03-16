import React from 'react';
import EventInput from './EventInput';
 
export default {
 title: 'EventInput',
 component: EventInput
};
 
const Template = (args) => <EventInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
