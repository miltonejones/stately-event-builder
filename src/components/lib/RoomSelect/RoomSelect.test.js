import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import RoomSelect from './RoomSelect';
 
afterEach(() => cleanup());
 
describe('<RoomSelect/>', () => {
 it('RoomSelect mounts without failing', () => {
   render(<RoomSelect />);
   expect(screen.getAllByTestId("test-for-RoomSelect").length).toBeGreaterThan(0);
 });
});

