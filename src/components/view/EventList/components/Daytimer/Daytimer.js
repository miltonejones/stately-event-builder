import React from 'react';
import { styled, Box, Stack } from '@mui/material';
import { Columns, TinyButton, Tooltag, Nowrap } from '../../../../../styled';
import { useEventPop } from '../../../../../machines';
import DaytimerMenu from '../DaytimerMenu/DaytimerMenu';
import EventPopover from '../EventPopover/EventPopover';

import moment from 'moment';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const eventTime = (f) => {
  const [hh, mm] = f.split(':');
  const num = (hh * 3600 + mm * 60) * 1000;
  return num;
};
 
const blockIsBetween = (day1, start, end) =>
  day1 > eventTime(start) && day1 < eventTime(end);
const blockMatches = (day1, end) => day1 === eventTime(end);

const DayRow = ({ time, events, onChange, handler }) => {
  const thirty = 1800 * 1000;



  const firstBlock = events.find((f) => blockMatches(time, f.EventStartTime));
 
  const duringBlocks = events.filter((f) =>
    blockIsBetween(time, f.EventStartTime, f.EventEndTime)
  );

  const duringBlock = duringBlocks[0]
  const secondBlock = events.find((f) => blockMatches(time - thirty, f.EventStartTime));
  const lastBlock = events.some((f) => blockMatches(time + thirty, f.EventEndTime));


  const nextBlock = events.some((f) => blockMatches(time + thirty, f.EventStartTime));

  const even = (time / 1000) % 3600 !== 0;
  const borderBottomStyle = even ? 'solid' : 'dotted';

  const conflict = !!firstBlock && duringBlocks.find(f => f.ID !== firstBlock?.ID)

  const hideBorder = !(lastBlock || nextBlock) && (firstBlock || duringBlock);

  const hoverBlock = firstBlock || secondBlock || duringBlock;
  const defaultBgColor = 'aliceblue'

  const hoveredBackgroundColor = handler.props.hover === hoverBlock?.ID ? '#ffffcc' : defaultBgColor;

  const backcolor = hoverBlock ? hoveredBackgroundColor : 'white';
  const forecolor = secondBlock ? "#777" :  firstBlock ? 'primary.dark' : duringBlock ? hoveredBackgroundColor : 'white';



  const setHover = id => {
    handler.send({
      type: "CHANGE",
      key: 'hover',
      value: id
    })
  }

 

  return (
     <Nowrap
      onMouseEnter={() => setHover(hoverBlock?.ID)}
      onMouseLeave={() => setHover(null)}
      onClick={(e) => !!hoverBlock && onChange(e, hoverBlock.ID, hoverBlock.CustomDate)}
      small
      bold={!!firstBlock?.RecurseEndDate}

      sx={{
        backgroundColor: backcolor,
        color: conflict ? "error.main" : forecolor,
        pl: 0.4,
        pt: 0.5,
        pb: 0.5, 
        borderBottom: (t) =>
          `${borderBottomStyle} 1px ${
            hideBorder ? hoveredBackgroundColor : t.palette.primary.light
          }`,
        '&:hover': {
          backgroundColor: t => (firstBlock || duringBlock) ? backcolor : t.palette.primary.dark
        }
      }}
    >
      {!!conflict && <Tooltag component={TinyButton} 
      title={<>Event conflicts with <b>{conflict.EventName}</b></>}
      color="error" icon="ErrorOutlined" />}
      {!!secondBlock && <>{secondBlock.FullName}</>}
      {!secondBlock && <>{!firstBlock
        ? !duringBlock
          ? <><TinyButton icon="Add" color="inherit" /> create event</>
          : JSON.stringify(lastBlock)
        : hoverBlock.EventName}</>}
    </Nowrap> 
  );
};

const Daytimer = ({ handler }) => {
  const { eventList } = handler;
  const menu = useEventPop(); 
  const roomsList = eventList.reduce((out, ev) => {
    if (!out[ev.RoomNames]) {
      out[ev.RoomNames] = [];
    }
    out[ev.RoomNames].push(ev);
    return out;
  }, {});

  const fullKeys = Object.keys(roomsList).sort();

  const roomKeys = !handler.props.excluded?.length
    ? fullKeys
    : fullKeys.filter((f) => !handler.props.excluded.some((e) => e === f));

  const columns = roomKeys
    .map((f) => (f === handler.props.selectedCol ? '25vw' : '1fr'))
    .join(' ');

  const timeStamps = [];
  for (var s = 5 * 3600; s <= 21 * 3600; s += 1800) {
    timeStamps.push(s * 1000);
  }

  const handleSelect = (col) => {
    handler.send({
      type: 'CHANGE',
      key: 'selectedCol',
      value: col,
    });
  };

  return (
    <Layout data-testid="test-for-Daytimer">
    {/* [  {JSON.stringify(handler.props.hover)}] */}
      <Columns
        sx={{ alignItems: 'flex-start', borderRight: 1, borderColor: 'primary.light' }}
        spacing={0}
        columns={`32px ${columns}`}
      >
        <Stack
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderLeft: 1,
            borderColor: 'primary.light',
          }}
        >
          <Nowrap small
            sx={{
              pt: 0.5,
              pb: 0.5,
              textAlign: 'right',
              pr: .5,
              borderTop: 1,
              borderBottom: 4,
              borderColor: 'primary.light',
              color: 'white'
            }}
          >
            <DaytimerMenu handler={handler} rooms={roomsList} /> 
          </Nowrap>

          {timeStamps.map((n) => (
            <Nowrap
              muted
              small
              bold
              sx={{
                borderBottom: (t) =>
                  ` ${(n / 1000) % 3600 !== 0 ? 'solid' : 'dotted'} 1px ${
                    (n / 1000) % 3600 === 0 ? t.palette.common.white : t.palette.primary.light
                  }`,
                textAlign: 'right',
                pt: 0.5,
                pb: 0.5,
                pr: 1,
                color: (n / 1000) % 3600 !== 0 ? "white" : "text.secondary"
              }}
            >
              {moment.utc(n).format('h')}
            </Nowrap>
          ))}
        </Stack>

        {roomKeys.map((rm) => (
          <Stack
            sx={{
              width: '100%',
              overflow: 'hidden',
              borderLeft: 1,
              borderColor: 'primary.light',
            }}
          >
            <Nowrap
              onClick={() =>
                handleSelect(rm === handler.props.selectedCol ? '' : rm)
              }
              hover
              sx={{
                pl: 0.4,
                pt: 0.5,
                pb: 0.5,
                borderBottom: 4,
                borderTop: 1,
                color: 'primary.dark',
                borderColor: 'primary.light',
              }}
              bold={rm === handler.props.selectedCol} 
              small
              key={rm}
            >
              {rm}
            </Nowrap>

            {timeStamps.map((n) => (
              <DayRow events={roomsList[rm]}
              onChange={(e, ID, date) => {
                menu.handleClick(e, ID, date)
              }}
              handler={handler} time={n} />
            ))}
          </Stack>
        ))}
      </Columns>

      <EventPopover menu={menu} />
      {/* <pre>{JSON.stringify(Object.keys(roomsList), 0, 2)}</pre>
      <pre>{JSON.stringify(roomsList, 0, 2)}</pre> */}
    </Layout>
  );
};
Daytimer.defaultProps = {};
export default Daytimer;
