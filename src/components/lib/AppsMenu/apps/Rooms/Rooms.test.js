import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Rooms from './Rooms';
 
afterEach(() => cleanup());
 
describe('<Rooms/>', () => {
 it('Rooms mounts without failing', () => {
   render(<Rooms />);
   expect(screen.getAllByTestId("test-for-Rooms").length).toBeGreaterThan(0);
 });
});

