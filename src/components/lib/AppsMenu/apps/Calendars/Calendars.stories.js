import React from 'react';
import Calendars from './Calendars';
 
export default {
 title: 'Calendars',
 component: Calendars
};
 
const Template = (args) => <Calendars {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
