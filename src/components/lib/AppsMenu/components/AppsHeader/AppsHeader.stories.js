import React from 'react';
import AppsHeader from './AppsHeader';
 
export default {
 title: 'AppsHeader',
 component: AppsHeader
};
 
const Template = (args) => <AppsHeader {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
