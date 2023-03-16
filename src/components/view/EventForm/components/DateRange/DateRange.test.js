import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DateRange from './DateRange';
 
afterEach(() => cleanup());
 
describe('<DateRange/>', () => {
 it('DateRange mounts without failing', () => {
   render(<DateRange />);
   expect(screen.getAllByTestId("test-for-DateRange").length).toBeGreaterThan(0);
 });
});

