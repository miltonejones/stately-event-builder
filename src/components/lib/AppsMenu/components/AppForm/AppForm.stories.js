import React from 'react';
import AppForm from './AppForm';
 
export default {
 title: 'AppForm',
 component: AppForm
};
 
const Template = (args) => <AppForm {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
