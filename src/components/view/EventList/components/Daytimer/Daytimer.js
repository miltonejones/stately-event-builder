import React from 'react';
import { styled, Box, Stack } from '@mui/material';
import { Columns, Spacer, Flex, Btn,   TinyButton, TextIcon, Tooltag, Nowrap } from '../../../../../styled';
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

const thirtyOf = num => Math.floor(num / 30);
 
const blockIsNow = (day1, halfs, date) =>
  date === moment(new Date()).format('MM-DD-YYYY') && 
  moment.utc(day1).format('HH')  === moment(new Date()).format('HH') && 
    (!halfs || (thirtyOf( moment.utc(day1).format('mm'))  === thirtyOf(moment(new Date()).format('mm') )));
const blockIsBetween = (day1, start, end) =>
  day1 > eventTime(start) && day1 < eventTime(end);
const blockMatches = (day1, end) => day1 === eventTime(end);

const DayRow = ({ time, date, factor, events, onChange, handler }) => {
  const thirty = factor * 1000;

  const divideInHalf = factor === 3600;



  const firstBlock = events.find((f) => blockMatches(time, f.EventStartTime) || 
    (divideInHalf && blockMatches(time - 1800, f.EventStartTime)));
 
  const duringBlocks = events.filter((f) =>
    blockIsBetween(time, f.EventStartTime, f.EventEndTime)
  );

  const duringBlock = duringBlocks[0]
  const nowBlock = blockIsNow(time + thirty, factor === 1800, date);
  const secondBlock = events.find((f) => blockMatches(time - thirty, f.EventStartTime));
  const lastBlock = events.some((f) => blockMatches(time + thirty, f.EventEndTime));


  const nextBlock = events.some((f) => blockMatches(time + thirty, f.EventStartTime));

  const even = (time / 1000) % 3600 !== 0;
  const borderBottomStyle = even || nowBlock || divideInHalf ? 'solid' : 'dotted';

  const conflict = !!firstBlock && duringBlocks.find(f => f.ID !== firstBlock?.ID)

  const hideBorder = !(lastBlock || nextBlock) && (firstBlock || duringBlock);

  const hoverBlock = firstBlock || secondBlock || duringBlock;
  const defaultBgColor = 'aliceblue'

  const hoveredBackgroundColor = handler.props.hover === hoverBlock?.ID ? '#ffffcc' : defaultBgColor;

  const backcolor = hoverBlock ? hoveredBackgroundColor : 'white';
  const forecolor = secondBlock ? "#777" :  firstBlock ? 'primary.dark' : duringBlock ? hoveredBackgroundColor : 'white';

  const borderWidth = nowBlock ? "3px" : "1px"; 


  const setHover = id => {
    !divideInHalf && handler.send({
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
        position: 'relative',
        backgroundColor: backcolor,
        color: conflict ? "error.main" : forecolor,
        pl: divideInHalf ? 0 : 0.4,
        pt: 0.5,
        pb: 0.5, 
        overflow: "hidden",
        borderBottom: (t) =>
          `${borderBottomStyle} ${borderWidth} ${hideBorder && !nowBlock ? hoveredBackgroundColor : t.palette[nowBlock ? "secondary" : "primary"].light}`,
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
        ? !hoverBlock
          ? <Flex sx={{zIndex: 0}}><TinyButton icon="Add" color="inherit" /> create event</Flex>
          : JSON.stringify(lastBlock)
        : hoverBlock.EventName}</>}

      {!(hoverBlock || duringBlock) && divideInHalf && <Box sx={{
        position: 'absolute',
        top: '50%',
        width: '100%',
        backgroundColor: 'white',
        borderTop: t => 'dotted 1px ' + t.palette.primary.light,
        zIndex: 1
      }}>
        {firstBlock?.EventName}
        </Box> } 
    </Nowrap> 
  );
};

const Daytimer = ({ handler }) => {

  const { eventList, params } = handler;
  const collated = eventList.reduce((out, ev) => {
    if (!out[ev.CustomDate]) {
      out[ev.CustomDate] = [];
    }
    out[ev.CustomDate].push(ev);
    return out;
  }, {}); 

  const factor = Object.keys(collated).length > 1 
    ? 3600
    : 1800
 
  const sunday = moment().startOf('week').format('YYYY-MM-DD');
  const monday = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
  const friday = moment().startOf('week').add(5, 'days').format('YYYY-MM-DD');
  const saturday = moment().startOf('week').add(6, 'days').format('YYYY-MM-DD');
  const buttons = {
    today: {
      icon: "Today",
      params: {
        start_date: moment().format('YYYY-MM-DD')
      }
    },
    weekdays: {
      icon: "DateRange",
      params: { 
        start_date: monday,
        end_date: friday
      }
    },
    week: {
      icon: "ViewWeek",
      params: {
        start_date: sunday,
        end_date: saturday
      }
    }
  }

  return (
    <>
    
 
      {Object.keys(collated).map((key, i) => (<Box key={key}>
        <Flex>
        <Nowrap sx={{m: 1}}> {moment(new Date(key)).format('dddd MMM Do, YYYY')}</Nowrap>
        <Spacer />
        {i === 0 && <Flex sx={{m: 1}} spacing={1}>
            {Object.keys(buttons).map(btn => <Btn key={btn}
              startIcon={<TextIcon icon={buttons[btn].icon} />}
              size="small"
              variant={(params.start_date === buttons[btn].params.start_date && params.end_date === buttons[btn].params.end_date) || 
                (!params.start_date && !buttons[btn].params.end_date) ? "contained" : "outlined"}
              onClick={() => {
                handler.send({
                  type: 'FIND',
                  params:  buttons[btn].params
                })
              }}
              >{btn}</Btn>)}
          </Flex>}
        </Flex>
        <DaytimerDay date={key} handler={handler} factor={factor} eventList={collated[key]}  />
      </Box>))}
    </>
  )

}

const DaytimerDay = ({ handler, date, factor, eventList }) => {

  // const { eventList } = handler;
  const menu = useEventPop(() => {
    handler.send({
      type: 'FIND',
      params: handler.params
    })
  }); 
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
  for (var s = 5 * 3600; s <= 21 * 3600; s += factor) {
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
            borderBottom: t => `solid 1px ${t.palette.primary.light} `
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
              date={date}
              factor={factor}
              onChange={(e, ID, date) => {
                menu.handleClick(e, ID, date)
              }}
              handler={handler} time={n} />
            ))}
          </Stack>
        ))}
      </Columns>

      <EventPopover menu={menu} />
 
    </Layout>
  );
};
Daytimer.defaultProps = {};
export default Daytimer;
