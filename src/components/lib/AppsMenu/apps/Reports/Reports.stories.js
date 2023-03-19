import React from 'react';
import Reports from './Reports';
 
export default {
 title: 'Reports',
 component: Reports
};
 
const Template = (args) => <Reports {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
