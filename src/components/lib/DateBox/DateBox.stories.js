import React from 'react';
import DateBox from './DateBox';
 
export default {
 title: 'DateBox',
 component: DateBox
};
 
const Template = (args) => <DateBox {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
