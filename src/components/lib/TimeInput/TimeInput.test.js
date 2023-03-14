import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TimeInput from './TimeInput';
 
afterEach(() => cleanup());
 
describe('<TimeInput/>', () => {
 it('TimeInput mounts without failing', () => {
   render(<TimeInput />);
   expect(screen.getAllByTestId("test-for-TimeInput").length).toBeGreaterThan(0);
 });
});

