import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Daytimer from './Daytimer';
 
afterEach(() => cleanup());
 
describe('<Daytimer/>', () => {
 it('Daytimer mounts without failing', () => {
   render(<Daytimer />);
   expect(screen.getAllByTestId("test-for-Daytimer").length).toBeGreaterThan(0);
 });
});

