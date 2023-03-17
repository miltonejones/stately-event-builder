import React from 'react';
import DaytimerMenu from './DaytimerMenu';
 
export default {
 title: 'DaytimerMenu',
 component: DaytimerMenu
};
 
const Template = (args) => <DaytimerMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
