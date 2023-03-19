import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ThemeMenu from './ThemeMenu';
 
afterEach(() => cleanup());
 
describe('<ThemeMenu/>', () => {
 it('ThemeMenu mounts without failing', () => {
   render(<ThemeMenu />);
   expect(screen.getAllByTestId("test-for-ThemeMenu").length).toBeGreaterThan(0);
 });
});

