import React from 'react';
import { styled, Switch, Card, TextField, Box } from '@mui/material';
import { Flex, Banner, TinyButton, Spacer, Nowrap } from '../../../../../styled';
import { VIEW } from '../../../../../machines'; 

const Layout = styled(Card)(({ theme }) => ({
  border: 'solid 1px ' + theme.palette.divider,
}));

const EventOptions = ({ handler }) => {
  const opened = Boolean(handler.view & VIEW.FORM_OPTIONBAR);
  if (!opened) return <Box sx={{ p: 1 }}>
    <TinyButton icon="KeyboardArrowLeft" onClick={() => {
    handler.send({
      type: 'VIEW',
      bit: VIEW.FORM_OPTIONBAR
    })
  }} />
  </Box>
  return (
    <Layout>
      <Banner disabled>
        <Nowrap small bold>
          <b>Options</b>
        </Nowrap>
        <Spacer />

        <TinyButton icon="Close" onClick={() => {
            handler.send({
              type: 'VIEW',
              bit: VIEW.FORM_OPTIONBAR
            })
          }} />
      </Banner>

      <Box sx={{ m: 1 }}>
        <Flex>
          <Switch checked={!!handler.eventProp.ApproveLogin} />
          <Nowrap muted small>
            Approved by <b>{handler.eventProp.FullName}</b>
          </Nowrap>
        </Flex>
        <Flex>
          <Switch checked={!!handler.eventProp.Featured} />
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
      </Box>
    </Layout>
  );
};
EventOptions.defaultProps = {};
export default EventOptions;
