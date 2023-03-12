import React from 'react';
import DemoStepper from './DemoStepper';
 
export default {
 title: 'DemoStepper',
 component: DemoStepper
};
 
const Template = (args) => <DemoStepper {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
