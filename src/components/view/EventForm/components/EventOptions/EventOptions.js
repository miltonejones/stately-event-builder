import React from 'react';
import { styled, Card, Stack, TextField, Box } from '@mui/material';
import { Flex, GridFormHeader, Check, TinyButton, Nowrap } from '../../../../../styled';
import { VIEW } from '../../../../../machines'; 

const Layout = styled(Card)(({ theme }) => ({
  border: 'solid 1px ' + theme.palette.divider,
  padding: theme.spacing(3, 2)
}));

const EventOptions = ({ handler }) => {
  const opened = Boolean(handler.view & VIEW.FORM_OPTIONBAR);
  if (!opened) return <Box sx={{ p: 1 }}>
    <TinyButton icon="KeyboardArrowLeft" onClick={() => handler.setView(VIEW.FORM_OPTIONBAR) } />
  </Box>
  return (
    <Layout>
      <GridFormHeader 
        title="Options"
        icon="Settings"
        handleClose={() => handler.setView(VIEW.FORM_OPTIONBAR) }  
      /> 

      <Stack spacing={1} sx={{ m: t => t.spacing (1, 0) }}>
        <Flex spacing={1}>
          <Check on={!!handler.eventProp.ApproveLogin} />
          <Nowrap muted small>
            Approved by <b>{handler.eventProp.FullName}</b>
          </Nowrap>
        </Flex>
        <Flex spacing={1}>
          <Check on={!!handler.eventProp.Featured} />
          <Nowrap small>Featured</Nowrap>
        </Flex>
        <Flex spacing={1}>
          <Nowrap small>Event has</Nowrap>
          <TextField
            sx={{ maxWidth: 60 }}
            size="small"
            value={handler.eventProp.Attendees}
          />
          <Nowrap small>attendees</Nowrap>
        </Flex>
      </Stack>
    </Layout>
  );
};
EventOptions.defaultProps = {};
export default EventOptions;
