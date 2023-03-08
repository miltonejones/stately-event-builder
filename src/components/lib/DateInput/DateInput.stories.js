import React from 'react';
import DateInput from './DateInput';
 
export default {
 title: 'DateInput',
 component: DateInput
};
 
const Template = (args) => <DateInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
