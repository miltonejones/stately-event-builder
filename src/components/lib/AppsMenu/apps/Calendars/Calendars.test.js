import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Calendars from './Calendars';
 
afterEach(() => cleanup());
 
describe('<Calendars/>', () => {
 it('Calendars mounts without failing', () => {
   render(<Calendars />);
   expect(screen.getAllByTestId("test-for-Calendars").length).toBeGreaterThan(0);
 });
});

