import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Markdown from './Markdown';
 
afterEach(() => cleanup());
 
describe('<Markdown/>', () => {
 it('Markdown mounts without failing', () => {
   render(<Markdown />);
   expect(screen.getAllByTestId("test-for-Markdown").length).toBeGreaterThan(0);
 });
});

