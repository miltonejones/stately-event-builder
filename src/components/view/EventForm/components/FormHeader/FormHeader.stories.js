import React from 'react';
import FormHeader from './FormHeader';
 
export default {
 title: 'FormHeader',
 component: FormHeader
};
 
const Template = (args) => <FormHeader {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
