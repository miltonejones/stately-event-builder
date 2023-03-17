import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventPopover from './EventPopover';
 
afterEach(() => cleanup());
 
describe('<EventPopover/>', () => {
 it('EventPopover mounts without failing', () => {
   render(<EventPopover />);
   expect(screen.getAllByTestId("test-for-EventPopover").length).toBeGreaterThan(0);
 });
});

