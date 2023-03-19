import React from 'react';
import Unsaved from './Unsaved';
 
export default {
 title: 'Unsaved',
 component: Unsaved
};
 
const Template = (args) => <Unsaved {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
