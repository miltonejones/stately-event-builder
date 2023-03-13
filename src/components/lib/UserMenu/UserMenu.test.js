import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import UserMenu from './UserMenu';
 
afterEach(() => cleanup());
 
describe('<UserMenu/>', () => {
 it('UserMenu mounts without failing', () => {
   render(<UserMenu />);
   expect(screen.getAllByTestId("test-for-UserMenu").length).toBeGreaterThan(0);
 });
});

