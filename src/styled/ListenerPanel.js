/**
 * A panel used for listening events
 * @typedef ListenerPanel
 * @extends Box
 */
// import React from 'react';
import { styled, Box } from '@mui/material';

/**
 * Styled component for creating a ListenerPanel
 * @function
 * @param {object} theme - theme object from MUI
 * @returns {ListenerPanel}
 */
const ListenerPanel = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));

export default ListenerPanel;

// Critiques: 

// The only critique I have of this code is that it seems efficient and legible already, and it is properly using JSDoc comments 
// to document the code. Great job!