import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Categories from './Categories';
 
afterEach(() => cleanup());
 
describe('<Categories/>', () => {
 it('Categories mounts without failing', () => {
   render(<Categories />);
   expect(screen.getAllByTestId("test-for-Categories").length).toBeGreaterThan(0);
 });
});

