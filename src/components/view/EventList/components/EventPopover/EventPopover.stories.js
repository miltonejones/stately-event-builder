import React from 'react';
import EventPopover from './EventPopover';
 
export default {
 title: 'EventPopover',
 component: EventPopover
};
 
const Template = (args) => <EventPopover {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
