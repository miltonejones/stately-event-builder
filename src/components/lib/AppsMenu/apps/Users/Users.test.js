import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Users from './Users';
 
afterEach(() => cleanup());
 
describe('<Users/>', () => {
 it('Users mounts without failing', () => {
   render(<Users />);
   expect(screen.getAllByTestId("test-for-Users").length).toBeGreaterThan(0);
 });
});

