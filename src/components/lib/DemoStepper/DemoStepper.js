import React from 'react';
import { styled, Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const DemoStepper = ({ handler}) => {
  const { step, messages } = handler;
  const steps = [
    messages.step1,
    messages.step2,
    messages.step3,
    messages.step4,
    messages.step5,
    messages.step6,
    messages.step7, 
  ]
 return (
   <Layout data-testid="test-for-DemoStepper">
   <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
   </Layout>
 );
}
DemoStepper.defaultProps = {};
export default DemoStepper;
