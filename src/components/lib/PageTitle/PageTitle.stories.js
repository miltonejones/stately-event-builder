import React from 'react';
import PageTitle from './PageTitle';
 
export default {
 title: 'PageTitle',
 component: PageTitle
};
 
const Template = (args) => <PageTitle {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
