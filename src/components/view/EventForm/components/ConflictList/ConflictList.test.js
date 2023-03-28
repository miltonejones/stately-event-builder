import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ConflictList from './ConflictList';
 
afterEach(() => cleanup());
 
describe('<ConflictList/>', () => {
 it('ConflictList mounts without failing', () => {
   render(<ConflictList />);
   expect(screen.getAllByTestId("test-for-ConflictList").length).toBeGreaterThan(0);
 });
});

