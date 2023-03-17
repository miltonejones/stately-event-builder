import React from 'react';
import Daytimer from './Daytimer';
 
export default {
 title: 'Daytimer',
 component: Daytimer
};
 
const Template = (args) => <Daytimer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
