/**
 * Renders a chat drawer component with a microphone button that opens a drawer for audio input.
 * @param {Function} onChange - function to handle audio input change
 * @returns JSX.Element
 */
import React from 'react'; 
import {  Box, Drawer, } from '@mui/material'; 
import { 
  // Btn,
  TextIcon, 
  Circle,
  CircleWrap,
  ListenerPanel
} from '../../../styled';    
import { 
  useTranscriber, 
} from '../../../machines';     
  

const ChatDrawer = ({ onChange }) => { 
  // Initialize transcriber and its state
  const transcriber = useTranscriber(onChange); 
  const isIdle = transcriber.state.matches('idle');
  const isBusy = transcriber.state.matches('request.init');
  // const isDone = transcriber.state.matches('request.curate');

  // Open and close the chat drawer
  const handleDrawerOpen = () => {
    transcriber.send('TALK');
  };

  const handleDrawerClose = () => {
    transcriber.send('STOP');
  };

  // Render the chat drawer component
  return (
    <>
      <Circle
        color="primary"
        aria-label="open drawer" 
        onClick={handleDrawerOpen}
      >
      <TextIcon icon="Mic"  />
      </Circle>
      <Drawer 
        variant="temporary"
        anchor="bottom"
        open={!isIdle}
        onClose={handleDrawerClose}
        classes={{
          paper:" classes.drawerPaper"
        }}
      >
        <ListenerPanel >
          {!!isBusy && <CircleWrap size={108} />}
          <Circle
            big
            disabled={isBusy}
            color="success" 
            onClick={handleDrawerClose}
          >
            <TextIcon icon="MicOff" />
          </Circle>
          <Box sx={{
            position: 'fixed',
            right: 20,
            bottom: 20
          }}> 




      [  {JSON.stringify(transcriber.state.value)}]
   {!!transcriber.content &&  <pre>
     [  {JSON.stringify(JSON.parse(transcriber.content), 0,2)}]
     </pre>} 
          </Box>
        </ListenerPanel>
      </Drawer>
    </>
  );
};

export default ChatDrawer;

// Critique: 
// It would be more efficient to extract the transcriber's state values to their own constants instead of calling them as methods each time they are needed. 
// Also, the function names can be more descriptive, such as changing "handleDrawerOpen" to "openChatDrawer" and "handleDrawerClose" to "closeChatDrawer".