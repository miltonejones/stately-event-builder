import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DateBox from './DateBox';
 
afterEach(() => cleanup());
 
describe('<DateBox/>', () => {
 it('DateBox mounts without failing', () => {
   render(<DateBox />);
   expect(screen.getAllByTestId("test-for-DateBox").length).toBeGreaterThan(0);
 });
});

