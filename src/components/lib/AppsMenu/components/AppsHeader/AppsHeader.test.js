import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppsHeader from './AppsHeader';
 
afterEach(() => cleanup());
 
describe('<AppsHeader/>', () => {
 it('AppsHeader mounts without failing', () => {
   render(<AppsHeader />);
   expect(screen.getAllByTestId("test-for-AppsHeader").length).toBeGreaterThan(0);
 });
});

