import React from 'react';
import EventSearch from './EventSearch';
 
export default {
 title: 'EventSearch',
 component: EventSearch
};
 
const Template = (args) => <EventSearch {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
