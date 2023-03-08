import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CalendarInput from './CalendarInput';
 
afterEach(() => cleanup());
 
describe('<CalendarInput/>', () => {
 it('CalendarInput mounts without failing', () => {
   render(<CalendarInput />);
   expect(screen.getAllByTestId("test-for-CalendarInput").length).toBeGreaterThan(0);
 });
});

