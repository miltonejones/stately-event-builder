/**
 * A circular button with a customizable size
 *
 * @typedef {Object} CircleProps
 * @property {boolean} [big=false] - if true, button is larger than default size
 */

import { styled, Fab } from '@mui/material';

/**
 * A circular button with a customizable size
 * @param {CircleProps} props - Component props
 * @returns {JSX.Element}
 */
const Circle = styled(Fab)(({ theme, big = false }) => ({
  position: 'absolute',
  bottom: big ? 'calc(50vh - 50px)' : theme.spacing(5),
  right: big ? 'calc(50vw - 50px)' : theme.spacing(5),
  width: big ? 100 : 56,
  height: big ? 100 : 56
}));

export default Circle;
 