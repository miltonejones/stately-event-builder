
import React from 'react'; 
import TinyButton from './TinyButton';

const Check = ({ on, ...props })  => <TinyButton {...props} icon={on ? "CheckCircle" : "CheckCircleOutline"}/>

export default Check;
