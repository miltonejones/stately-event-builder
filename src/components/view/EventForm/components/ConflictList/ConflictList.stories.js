import React from 'react';
import ConflictList from './ConflictList';
 
export default {
 title: 'ConflictList',
 component: ConflictList
};
 
const Template = (args) => <ConflictList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
