import React from 'react';
import { styled, Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const DemoStepper = ({ step }) => {
  const steps = [
    "Welcome",
    "Using the home page",
    "Finding events",
    "Working with rooms",
    "Editing events",
    "Returning home",
    "Conclusion"
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
