import React from 'react';
import CalendarList from './CalendarList';
 
export default {
 title: 'CalendarList',
 component: CalendarList
};
 
const Template = (args) => <CalendarList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
