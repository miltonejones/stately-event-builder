import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Unsaved from './Unsaved';
 
afterEach(() => cleanup());
 
describe('<Unsaved/>', () => {
 it('Unsaved mounts without failing', () => {
   render(<Unsaved />);
   expect(screen.getAllByTestId("test-for-Unsaved").length).toBeGreaterThan(0);
 });
});

