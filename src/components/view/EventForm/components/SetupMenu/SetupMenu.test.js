import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SetupMenu from './SetupMenu';
 
afterEach(() => cleanup());
 
describe('<SetupMenu/>', () => {
 it('SetupMenu mounts without failing', () => {
   render(<SetupMenu />);
   expect(screen.getAllByTestId("test-for-SetupMenu").length).toBeGreaterThan(0);
 });
});

