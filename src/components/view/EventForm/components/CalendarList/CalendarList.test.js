import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CalendarList from './CalendarList';
 
afterEach(() => cleanup());
 
describe('<CalendarList/>', () => {
 it('CalendarList mounts without failing', () => {
   render(<CalendarList />);
   expect(screen.getAllByTestId("test-for-CalendarList").length).toBeGreaterThan(0);
 });
});

