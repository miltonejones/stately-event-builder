import React from 'react';
import AuthForm from './AuthForm';
 
export default {
 title: 'AuthForm',
 component: AuthForm
};
 
const Template = (args) => <AuthForm {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
