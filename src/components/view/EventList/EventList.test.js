import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventList from './EventList';
 
afterEach(() => cleanup());
 
describe('<EventList/>', () => {
 it('EventList mounts without failing', () => {
   render(<EventList />);
   expect(screen.getAllByTestId("test-for-EventList").length).toBeGreaterThan(0);
 });
});

