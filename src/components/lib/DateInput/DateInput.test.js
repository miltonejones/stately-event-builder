import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DateInput from './DateInput';
 
afterEach(() => cleanup());
 
describe('<DateInput/>', () => {
 it('DateInput mounts without failing', () => {
   render(<DateInput />);
   expect(screen.getAllByTestId("test-for-DateInput").length).toBeGreaterThan(0);
 });
});

