import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ActionsMenu from './ActionsMenu';
 
afterEach(() => cleanup());
 
describe('<ActionsMenu/>', () => {
 it('ActionsMenu mounts without failing', () => {
   render(<ActionsMenu />);
   expect(screen.getAllByTestId("test-for-ActionsMenu").length).toBeGreaterThan(0);
 });
});

