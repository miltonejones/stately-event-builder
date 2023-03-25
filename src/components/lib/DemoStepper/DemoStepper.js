import React from 'react';
import { styled, Typography, Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Flex, Btn,  BacklessDrawer } from "../../../styled";


const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1)
}));
 
const DemoStepper = ({ handler }) => {
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
  <BacklessDrawer anchor="bottom" open={handler.drawer}>
    <Box sx={{ p: 2 }}>
      <Layout data-testid="test-for-DemoStepper">
      <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
      </Layout>
      <Flex spacing={1}>
        <Typography variant="body1">{handler.text}</Typography>
        <Typography color="error" variant="subtitle2">
          {handler.paused ? 'PAUSED' : <>in {handler.ticks} secs.</>}
        </Typography>
        <Btn
          size="small"
          variant="contained"
          onClick={() => handler.send(handler.paused ? 'RESUME' : 'PAUSE')}
        >
          {handler.paused ? 'Resume' : 'Pause'}
        </Btn>
        <Btn
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handler.send('QUIT')}
        >
          quit
        </Btn>
      </Flex>
  </Box>
  </BacklessDrawer>


 );
}
DemoStepper.defaultProps = {};
export default DemoStepper;
