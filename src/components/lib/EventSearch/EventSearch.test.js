import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import EventSearch from './EventSearch';
 
afterEach(() => cleanup());
 
describe('<EventSearch/>', () => {
 it('EventSearch mounts without failing', () => {
   render(<EventSearch />);
   expect(screen.getAllByTestId("test-for-EventSearch").length).toBeGreaterThan(0);
 });
});

