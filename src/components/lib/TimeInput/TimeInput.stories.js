import React from 'react';
import TimeInput from './TimeInput';
 
export default {
 title: 'TimeInput',
 component: TimeInput
};
 
const Template = (args) => <TimeInput {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
