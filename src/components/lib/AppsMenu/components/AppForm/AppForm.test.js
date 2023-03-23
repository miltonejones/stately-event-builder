import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppForm from './AppForm';
 
afterEach(() => cleanup());
 
describe('<AppForm/>', () => {
 it('AppForm mounts without failing', () => {
   render(<AppForm />);
   expect(screen.getAllByTestId("test-for-AppForm").length).toBeGreaterThan(0);
 });
});

