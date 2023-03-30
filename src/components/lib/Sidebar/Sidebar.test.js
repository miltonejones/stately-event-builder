import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Sidebar from './Sidebar';
 
afterEach(() => cleanup());
 
describe('<Sidebar/>', () => {
 it('Sidebar mounts without failing', () => {
   render(<Sidebar />);
   expect(screen.getAllByTestId("test-for-Sidebar").length).toBeGreaterThan(0);
 });
});

