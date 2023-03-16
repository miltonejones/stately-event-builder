import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import FormHeader from './FormHeader';
 
afterEach(() => cleanup());
 
describe('<FormHeader/>', () => {
 it('FormHeader mounts without failing', () => {
   render(<FormHeader />);
   expect(screen.getAllByTestId("test-for-FormHeader").length).toBeGreaterThan(0);
 });
});

