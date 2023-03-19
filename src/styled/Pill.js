
 
import { styled, Card } from '@mui/material';
import {  opposite } from '../colors';

const Pill = styled(Card)(({ color, thin, theme }) => ({
  backgroundColor: color,
  color: opposite(color),
  fontSize: '0.75rem',
  padding: thin ? 0 : theme.spacing(0.4, 1),

}))

export default Pill;
