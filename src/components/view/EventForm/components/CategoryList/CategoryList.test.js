import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CategoryList from './CategoryList';
 
afterEach(() => cleanup());
 
describe('<CategoryList/>', () => {
 it('CategoryList mounts without failing', () => {
   render(<CategoryList />);
   expect(screen.getAllByTestId("test-for-CategoryList").length).toBeGreaterThan(0);
 });
});

