import { timeToNum } from './timeToNum';
import moment from 'moment';

export const timeToTime = (f) => { 
  return moment.utc(timeToNum(f)).format('hh:mm a');
};