import React from 'react';
import DomainManager from './DomainManager';
 
export default {
 title: 'DomainManager',
 component: DomainManager
};
 
const Template = (args) => <DomainManager {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
