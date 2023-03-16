import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CommentList from './CommentList';
 
afterEach(() => cleanup());
 
describe('<CommentList/>', () => {
 it('CommentList mounts without failing', () => {
   render(<CommentList />);
   expect(screen.getAllByTestId("test-for-CommentList").length).toBeGreaterThan(0);
 });
});

