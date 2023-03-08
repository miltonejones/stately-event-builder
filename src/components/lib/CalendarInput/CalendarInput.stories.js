import React from 'react';
import CalendarInput from './CalendarInput';
 
export default {
 title: 'CalendarInput',
 component: CalendarInput
};
 
const Template = (args) => <CalendarInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
