import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppsFooter from './AppsFooter';
 
afterEach(() => cleanup());
 
describe('<AppsFooter/>', () => {
 it('AppsFooter mounts without failing', () => {
   render(<AppsFooter />);
   expect(screen.getAllByTestId("test-for-AppsFooter").length).toBeGreaterThan(0);
 });
});

