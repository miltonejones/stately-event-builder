import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DiagnosticsMenu from './DiagnosticsMenu';
 
afterEach(() => cleanup());
 
describe('<DiagnosticsMenu/>', () => {
 it('DiagnosticsMenu mounts without failing', () => {
   render(<DiagnosticsMenu />);
   expect(screen.getAllByTestId("test-for-DiagnosticsMenu").length).toBeGreaterThan(0);
 });
});

