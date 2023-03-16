import React from 'react';
import CommentList from './CommentList';
 
export default {
 title: 'CommentList',
 component: CommentList
};
 
const Template = (args) => <CommentList {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
