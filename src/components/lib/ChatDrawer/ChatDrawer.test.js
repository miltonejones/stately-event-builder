import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ChatDrawer from './ChatDrawer';
 
afterEach(() => cleanup());
 
describe('<ChatDrawer/>', () => {
 it('ChatDrawer mounts without failing', () => {
   render(<ChatDrawer />);
   expect(screen.getAllByTestId("test-for-ChatDrawer").length).toBeGreaterThan(0);
 });
});

