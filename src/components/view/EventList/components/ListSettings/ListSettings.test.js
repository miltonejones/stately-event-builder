import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ListSettings from './ListSettings';
 
afterEach(() => cleanup());
 
describe('<ListSettings/>', () => {
 it('ListSettings mounts without failing', () => {
   render(<ListSettings />);
   expect(screen.getAllByTestId("test-for-ListSettings").length).toBeGreaterThan(0);
 });
});

