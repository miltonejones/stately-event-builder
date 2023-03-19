import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Reports from './Reports';
 
afterEach(() => cleanup());
 
describe('<Reports/>', () => {
 it('Reports mounts without failing', () => {
   render(<Reports />);
   expect(screen.getAllByTestId("test-for-Reports").length).toBeGreaterThan(0);
 });
});

