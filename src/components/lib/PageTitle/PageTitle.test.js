import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import PageTitle from './PageTitle';
 
afterEach(() => cleanup());
 
describe('<PageTitle/>', () => {
 it('PageTitle mounts without failing', () => {
   render(<PageTitle />);
   expect(screen.getAllByTestId("test-for-PageTitle").length).toBeGreaterThan(0);
 });
});

