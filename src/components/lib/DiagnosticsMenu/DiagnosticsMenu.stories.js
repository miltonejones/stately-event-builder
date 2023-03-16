import React from 'react';
import DiagnosticsMenu from './DiagnosticsMenu';
 
export default {
 title: 'DiagnosticsMenu',
 component: DiagnosticsMenu
};
 
const Template = (args) => <DiagnosticsMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
