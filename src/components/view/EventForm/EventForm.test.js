import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventForm from './EventForm';
 
afterEach(() => cleanup());
 
describe('<EventForm/>', () => {
 it('EventForm mounts without failing', () => {
   render(<EventForm />);
   expect(screen.getAllByTestId("test-for-EventForm").length).toBeGreaterThan(0);
 });
});

