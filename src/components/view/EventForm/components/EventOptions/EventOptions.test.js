import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventOptions from './EventOptions';
 
afterEach(() => cleanup());
 
describe('<EventOptions/>', () => {
 it('EventOptions mounts without failing', () => {
   render(<EventOptions />);
   expect(screen.getAllByTestId("test-for-EventOptions").length).toBeGreaterThan(0);
 });
});

