import React from 'react';
import Markdown from './Markdown';
 
export default {
 title: 'Markdown',
 component: Markdown
};
 
const Template = (args) => <Markdown {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
