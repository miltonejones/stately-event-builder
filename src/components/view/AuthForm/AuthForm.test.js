import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AuthForm from './AuthForm';
 
afterEach(() => cleanup());
 
describe('<AuthForm/>', () => {
 it('AuthForm mounts without failing', () => {
   render(<AuthForm />);
   expect(screen.getAllByTestId("test-for-AuthForm").length).toBeGreaterThan(0);
 });
});

