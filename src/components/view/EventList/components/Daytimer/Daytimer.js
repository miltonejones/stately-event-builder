import React from 'react';
import { styled, Box, Stack, IconButton } from '@mui/material';
import { Columns, Spacer, Flex, Btn, TinyButton, TextIcon, Tooltag, Nowrap } from '../../../../../styled';
// import { useEventPop } from '../../../../../machines';
import { daytimerOptions } from '../../../../../util/daytimerOptions';  
import DaytimerMenu from '../DaytimerMenu/DaytimerMenu';
// import EventPopover from '../EventPopover/EventPopover';
import { 
  useNavigate
} from "react-router-dom";


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
 
// true when the block matches the current time
const blockIsNow = (day1, halfs, date) =>
  date === moment(new Date()).format('MM-DD-YYYY') && 
  moment.utc(day1).format('HH')  === moment(new Date()).format('HH') && 
    (!halfs || (thirtyOf( moment.utc(day1).format('mm'))  === thirtyOf(moment(new Date()).format('mm') )));

// true when block is between event start and end time
const blockIsBetween = (day1, start, end) =>
  day1 > eventTime(start) && day1 < eventTime(end);

// selected time matches the selected block
const blockMatches = (day1, time) => day1 === eventTime(time);

const DayRow = ({ time, date, factor, events, onChange, handler }) => {
  const thirty = factor * 1000;

  // no 30 minute markers in sidebar
  const divideInHalf = factor === 3600;

  // find any events whose start time matches the selected time
  const firstBlock = events.find((f) => blockMatches(time, f.EventStartTime) );

  // find any events whose start time is 30 minutes ahead of the selected time
  const bottomHalfBlock = events.find((f) => divideInHalf && blockMatches(time + (1800 * 1000), f.EventStartTime));
 
  // find any events whose end time is 30 minutes ahead of the selected time
  const topHalfBlock = events.find((f) => divideInHalf && blockMatches(time + (1800 * 1000), f.EventEndTime));
 
  // find any events for which this time is between their start and end time
  const duringBlocks = events.filter((f) =>
    blockIsBetween(time, f.EventStartTime, f.EventEndTime)
  );

  const duringBlock = duringBlocks[0];

  // true when this block matches the current time
  const nowBlock = blockIsNow(time + thirty, factor === 1800, date);


  // block is second in a group when the start time matches the time of the previous block
  const secondBlock = events.find((f) => duringBlocks.find(e => e.ID === f.ID) && blockMatches(time - thirty, f.EventStartTime));
  
  // block is last in a group when the end time matches the time of the following block
  const lastBlock = !firstBlock && events.some((f) => blockMatches(time + thirty, f.EventEndTime));


  const nextBlock = events.some((f) => blockMatches(time + thirty, f.EventStartTime));

  // hour markers at any block evenly divisible by 3600
  const even = (time / 1000) % 3600 !== 0;


  const borderBottomStyle = even || nowBlock || divideInHalf 
    ? 'solid' 
    // dotted lines for 1/2 hour markers
    : 'dotted';

  // event is in conflict if any other events occur during this block
  const conflict = (!!firstBlock && duringBlocks.find(f => f.ID !== firstBlock?.ID)) ;
  
  const bottomConflict =  (!!bottomHalfBlock && duringBlocks.find(f => f.ID !== bottomHalfBlock?.ID))

  
  // no border for any blocks during the event 
  const hideBorder = !(lastBlock || nextBlock) && (firstBlock || duringBlock);

  const hoverBlock = firstBlock || secondBlock || duringBlock;

  const defaultBgColor = 'aliceblue'

  const hoveredBackgroundColor = handler.props.hover === hoverBlock?.ID ? '#ffffcc' : defaultBgColor;

  const backcolor = hoverBlock ? hoveredBackgroundColor : 'white';
  const forecolor = secondBlock ? "#777" :  firstBlock ? 'primary.dark' : duringBlock ? hoveredBackgroundColor : 'white';

  const borderWidth = nowBlock ? "2px" : "1px"; 


  const setHover = id => {
    // if(divideInHalf) return;
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
        transition: 'all 0.2s linear',
        position: 'relative',
        backgroundColor: backcolor,
        color: conflict ? "error.main" : forecolor,
        pl: divideInHalf && !hoverBlock ? 0 : 0.4,
        pt: 0.5,
        pb: 0.5, 
        overflow: "hidden",
        borderBottom: (t) =>
          `${borderBottomStyle} ${borderWidth} ${
            ((hideBorder && !nowBlock) || 
             bottomHalfBlock ) && 
             !topHalfBlock
              ? hoveredBackgroundColor 
              : t.palette[nowBlock ? "secondary" : "primary"].light }`,
        '&:hover': {
          backgroundColor: t => (divideInHalf || firstBlock || duringBlock) ? backcolor : t.palette.primary.dark
        }
      }}
    >
      {!!conflict && <Tooltag component={TinyButton} 
      title={<>Event conflicts with <b>{conflict.EventName}</b></>}
      color="error" icon="ErrorOutlined" />}

      {!!secondBlock && <>{secondBlock.FullName}</>}


      {!secondBlock && <Tooltag component={Box} title={hoverBlock?.EventName || "Create new event"}>{!firstBlock 
        ? !hoverBlock && !divideInHalf
          ? <Flex sx={{zIndex: 0}}><TinyButton icon="Add" color="inherit" /> create event</Flex>
          : `${JSON.stringify(Boolean(bottomHalfBlock))}/${JSON.stringify(Boolean(topHalfBlock))}`
        : <>{hoverBlock.EventName}</>}</Tooltag>}



      {(topHalfBlock || bottomHalfBlock || !(hoverBlock || duringBlock)) && divideInHalf && <Box sx={{
        position: 'absolute',
        top: !!handler.props.hover && handler.props.hover === bottomHalfBlock?.ID 
          ? 0 
          : !!handler.props.hover && handler.props.hover === topHalfBlock?.ID 
            ? '100%' 
            : '50%',
        width: '100%',
        height: '100%',
        pl: 0.4,
        color: bottomConflict ? "error.main" : bottomHalfBlock ? 'primary.dark' : "white",
        backgroundColor: !!handler.props.hover && handler.props.hover === bottomHalfBlock?.ID 
            ? "#ffffcc" 
            : bottomHalfBlock 
              ? "aliceblue" 
              : 'white',
        borderTop: t => 'dotted 1px ' + t.palette.primary.light,
        transition: 'top 0.2s linear', 
        '&:hover': {
          top: topHalfBlock ? '100%' : bottomHalfBlock ? 0 : '50%'
        }
      }}>
        {bottomHalfBlock?.EventName}{" "}
        </Box> } 
    </Nowrap> 
  );
};

const Daytimer = ({ handler, popMenu }) => {

  const navigate = useNavigate();
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
 
  // const sunday = moment().startOf('week').format('YYYY-MM-DD');

  // const monday = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
  // const friday = moment().startOf('week').add(5, 'days').format('YYYY-MM-DD');
  // const saturday = moment().startOf('week').add(6, 'days').format('YYYY-MM-DD');


  const goto = params => {
    const pieces = Object.keys(params).reduce((out, key) => {
      return out.concat(key, params[key])
    }, []).join('/');
    navigate(`/find/${pieces}`);
  }

  const buttons = daytimerOptions(params);
  const activeOption = Object.keys(buttons).find(btn => buttons[btn].active);

  // const yesterday = moment(new Date(params.start_date || null)).format('YYYY-MM-DD');
  // const tomorrow = moment(new Date(params.start_date || null)).add(2, 'days').format('YYYY-MM-DD');

  // const buttons = {
  //   today: {
  //     icon: "Today",
  //     params: {
  //       start_date: moment().format('YYYY-MM-DD')
  //     }
  //   },
  //   weekdays: {
  //     icon: "DateRange",
  //     params: { 
  //       start_date: monday,
  //       end_date: friday
  //     }
  //   },
  //   week: {
  //     icon: "ViewWeek",
  //     params: {
  //       start_date: sunday,
  //       end_date: saturday
  //     }
  //   }
  // }

  return (
    <>
    {/* {!!buttons[activeOption] && <pre>{JSON.stringify(buttons[activeOption],0,2)}</pre>} */}
 {/* {JSON.stringify(buttons.weekdays)}/
/

 [ {JSON.stringify(params.start_date)}]/
[ {JSON.stringify(params.end_date)}]/
[ {moment(params.start_date).format('MM-DD-YYYY')}] */}

      {Object.keys(collated).map((key, i) => (<Box key={key}>
        <Flex>


        {i === 0 && !!buttons[activeOption] && (
        <IconButton onClick={() =>goto(buttons[activeOption].yesterday)}> 
          <TextIcon icon="KeyboardArrowLeft" />
        </IconButton>)}
 
        <Nowrap hover onClick={() => goto({
                start_date: moment(new Date(key)).format('YYYY-MM-DD')
              })} sx={{m: 1}}> {moment(new Date(key)).format('dddd MMM Do, YYYY')}</Nowrap>


        {i === 0 && (
        <IconButton onClick={() =>goto(buttons[activeOption].tomorrow)}> 

          <TextIcon icon="KeyboardArrowRight" />
        </IconButton>)}
 
        <Spacer />
        {i === 0 && <Flex sx={{m: 1}} spacing={1}>
            {Object.keys(buttons).map(btn => <Btn key={btn}
              startIcon={<TextIcon icon={buttons[btn].icon} />}
              size="small"
              variant={
                buttons[btn].active
                  ? "contained" 
                  : "outlined"
                }
              onClick={() => goto(buttons[btn].params)}
              >{btn}</Btn>)}
          </Flex>}


        </Flex>
        <DaytimerDay date={key} popMenu={popMenu} handler={handler} factor={factor} eventList={collated[key]}  />
      </Box>))}
    </>
  )

}

const DaytimerDay = ({ handler, popMenu, date, factor, eventList }) => {

 
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
                popMenu.handleClick(e, ID, date)
              }}
              handler={handler} time={n} />
            ))}
          </Stack>
        ))}
      </Columns>

      {/* <EventPopover menu={popMenu} /> */}
 
    </Layout>
  );
};
Daytimer.defaultProps = {};
export default Daytimer;
