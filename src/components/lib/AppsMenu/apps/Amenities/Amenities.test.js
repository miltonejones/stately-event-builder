import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Amenities from './Amenities';
 
afterEach(() => cleanup());
 
describe('<Amenities/>', () => {
 it('Amenities mounts without failing', () => {
   render(<Amenities />);
   expect(screen.getAllByTestId("test-for-Amenities").length).toBeGreaterThan(0);
 });
});

