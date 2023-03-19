import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppsMenu from './AppsMenu';
 
afterEach(() => cleanup());
 
describe('<AppsMenu/>', () => {
 it('AppsMenu mounts without failing', () => {
   render(<AppsMenu />);
   expect(screen.getAllByTestId("test-for-AppsMenu").length).toBeGreaterThan(0);
 });
});

