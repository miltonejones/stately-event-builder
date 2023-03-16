import React from 'react';
import DateRange from './DateRange';
 
export default {
 title: 'DateRange',
 component: DateRange
};
 
const Template = (args) => <DateRange {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
