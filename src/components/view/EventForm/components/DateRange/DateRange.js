import React from 'react';
import {
  styled,
  Typography,
  // IconButton,
  Drawer,
  TextField,
  Card,
  Box,
} from '@mui/material';
import { Flex, TinyButton, RotateButton, TextIcon } from '../../../../../styled';
import { DateInput } from '../../../..';
import { recurseText } from '../../../../../util/recurseText';
import moment from 'moment';

const RangeCard = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(1),
  // border: 'solid 1px ' + theme.palette.divider
}));

const DateRange = (props) => {
  const { handler } = props;
  const { eventProp } = handler;
  const caption = recurseText(eventProp);
  return (
    <>
      <RangeCard>
        <Flex spacing={1}>
          <Typography variant="body2">Every</Typography>
          <TextField
            size="small"
            sx={{ maxWidth: 50 }}
            value={eventProp.RecurseUnit}
          />

          <Typography variant="body2">
            <b>{caption.label}</b> {caption.middle} <b>{caption.suffix}</b>{' '}
            until <b>{caption.until}</b>
          </Typography>
          <RotateButton
          deg={handler.props.showRange ? 90 : 270}
            onClick={() => {
              handler.send({
                type: 'CHANGE',
                key: 'showRange',
                value: !handler.props.showRange,
              });
            }}
          >
            <TextIcon
              icon="KeyboardArrowDown"
            />
          </RotateButton>
        </Flex>
      </RangeCard>
      {/* {JSON.stringify(recurseText(eventProp))} */}
      <Drawer anchor="right" onClose={() => handler.setProp('showRange', false)} open={handler.props.showRange}>
        <Flex sx={{ p: 1 }}>
          <DateInput label="End Date" value={eventProp.RecurseEndDate} />
        </Flex>
        <Card sx={{ p: 2 }} elevation={1}>
          <Box
            sx={{
              position: 'relative',
              p: 2,
              border: 1,
              borderRadius: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ position: 'absolute', top: -8, background: 'white' }}>
              Selected dates
            </Box>
            <Box sx={{ maxHeight: 'calc(100vh - 140px)', minWidth: 300, overflow: 'auto' }}>
              {eventProp.dates.map((f) => (
                <Flex
                  spacing={1}
                  sx={{ p: 0.5, borderBottom: 1, borderColor: 'divider' }}
                >
                  <TinyButton icon="Delete" />
                  <Typography variant="body2">
                    {moment(new Date(f.CustomDate)).format('dddd, MMM Do YYYY')}{' '}
                  </Typography>
                </Flex>
              ))}
            </Box>
          </Box>
        </Card>
      </Drawer>
    </>
  );
};

DateRange.defaultProps = {};
export default DateRange;
