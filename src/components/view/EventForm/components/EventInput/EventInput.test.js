import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventInput from './EventInput';
 
afterEach(() => cleanup());
 
describe('<EventInput/>', () => {
 it('EventInput mounts without failing', () => {
   render(<EventInput />);
   expect(screen.getAllByTestId("test-for-EventInput").length).toBeGreaterThan(0);
 });
});

