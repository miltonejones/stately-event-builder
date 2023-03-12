import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DemoStepper from './DemoStepper';
 
afterEach(() => cleanup());
 
describe('<DemoStepper/>', () => {
 it('DemoStepper mounts without failing', () => {
   render(<DemoStepper />);
   expect(screen.getAllByTestId("test-for-DemoStepper").length).toBeGreaterThan(0);
 });
});

