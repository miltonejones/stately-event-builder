import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import UserList from './UserList';
 
afterEach(() => cleanup());
 
describe('<UserList/>', () => {
 it('UserList mounts without failing', () => {
   render(<UserList />);
   expect(screen.getAllByTestId("test-for-UserList").length).toBeGreaterThan(0);
 });
});

