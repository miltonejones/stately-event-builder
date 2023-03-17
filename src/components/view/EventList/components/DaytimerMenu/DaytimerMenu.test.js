import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DaytimerMenu from './DaytimerMenu';
 
afterEach(() => cleanup());
 
describe('<DaytimerMenu/>', () => {
 it('DaytimerMenu mounts without failing', () => {
   render(<DaytimerMenu />);
   expect(screen.getAllByTestId("test-for-DaytimerMenu").length).toBeGreaterThan(0);
 });
});

