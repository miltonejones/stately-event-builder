import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import DomainManager from './DomainManager';
 
afterEach(() => cleanup());
 
describe('<DomainManager/>', () => {
 it('DomainManager mounts without failing', () => {
   render(<DomainManager />);
   expect(screen.getAllByTestId("test-for-DomainManager").length).toBeGreaterThan(0);
 });
});

