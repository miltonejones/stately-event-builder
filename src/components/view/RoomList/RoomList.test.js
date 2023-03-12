import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import RoomList from './RoomList';
 
afterEach(() => cleanup());
 
describe('<RoomList/>', () => {
 it('RoomList mounts without failing', () => {
   render(<RoomList />);
   expect(screen.getAllByTestId("test-for-RoomList").length).toBeGreaterThan(0);
 });
});

