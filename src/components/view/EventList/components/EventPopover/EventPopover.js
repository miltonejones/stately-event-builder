import React from 'react';
import { styled, Popover, Switch, Stack, TextField, LinearProgress, Box } from '@mui/material';
import { Flex, Spacer, Btn, TextIcon, Tooltag, TinyButton, Nowrap } from '../../../../../styled';
import { RoomSelect, DateInput } from '../../../..';
import { timeToNum } from '../../../../../util/timeToNum';
import { recurseText } from '../../../../../util/recurseText';
// import dayjs from 'dayjs';
import moment from 'moment';
import { 
  useNavigate
} from "react-router-dom";


 
const Layout = styled(Box)(({ theme, on }) => ({
 margin: theme.spacing(0),
 backgroundColor: on ? theme.palette.common.white : theme.palette.grey[100]
 , minWidth: 500, maxWidth: 640
}));

const timeof = str => moment.utc(timeToNum(str)).format('h:mm A');

const TextInput = ({ date, room, eventfk, roomList, value, variant, type="text", editing, ...props }) => {
  if (!editing) {
    return <Nowrap variant={variant} {...props}>{value}</Nowrap>
  }
  if (room) {
    return  <Box sx={{ mt: 1, width: '100%', border: 1, borderColor: 'divider' }}>
       <RoomSelect
        rooms={roomList}
        eventfk={eventfk}
        onChange={console.log}
        value={value}
      />
    </Box>
  }
  const Component = date ? DateInput : TextField;
  return <Component 
        size="small"
        type={type}
        value={value}
        {...props}
    />
}

const Warn = ({severity = "info", children, ...props})  => {
  const icons = {
    info: "Info",
    warning: "WarningAmber",
    error: "Error",
    success: "CheckCircle"
  }
  return <Box sx={{
    display: 'flex',
    border: 1,
    borderColor: t => t.palette[severity].dark,
    color: t => t.palette[severity].dark,
    width: '100%',
    p: t  => t.spacing(0.5, 1),
    borderRadius: 1,
    gap: 1
  }}>
    <TinyButton color="inherit" icon={icons[severity]} />
    {children}
  </Box>
}

const RecurseDesc = ( { event }) => {
  if (!event?.RecurseEndDate) return <i />
  const caption = recurseText(event);

  return  <Warn severity="info"><Nowrap variant="body2"> Occurs every {event.RecurseUnit === 1 ? "" : event.RecurseUnit}{" "}
  <b>{caption.label}</b> {caption.middle} <b>{caption.suffix}</b>{' '}
  until <b>{caption.until}</b>
</Nowrap></Warn>

}
 
const EventPopover = ({ menu }) => {
  const navigate = useNavigate()
  // if (!menu.data) return <i />
  const openEvent = () => {
    menu.handleClose()()
    navigate(`/edit/${menu.data.ID}`);
  }

  const getRoomName = id => {
    const room = menu.rooms?.find(f => f.ID === id)
    return room?.RoomName
  }
 
 return (
  <Popover anchorEl={menu.anchorEl}
  onClose={menu.handleClose()}  
  open={Boolean(menu.anchorEl) }
   >
    {!menu.state.matches('opened') && <Layout><LinearProgress />Loading event details...</Layout>}
   {menu.state.matches('opened') && <Layout on={menu.editing}>
    <Box sx={{ p: 2}}>


      <Flex spacing={1}> 
        <Nowrap muted variant="body2">Event Detail</Nowrap>
      {/* [  {JSON.stringify(eventDesc)}] */}
        <Spacer />
        <Tooltag component={TinyButton} title="Edit event" 
          caption="Open event form for detailed editing"
          onClick={openEvent} icon="OpenInFull" />
        <TinyButton onClick={menu.handleClose()} icon="Close" />
      </Flex>

      <Stack spacing={menu.editing ? 1 : 0} sx={{ pt: menu.editing ? 2 : 0}}>
        <Flex sx={{ mt: 1 }}> 
          <TextInput 
            label="Event Name"
            bold={!!menu.data.RecurseEndDate}
            variant="h6" 
            editing={menu.editing}
            fullWidth
            value={menu.data.EventName} 
            onChange={console.log}/> 
        </Flex>


        <Flex> 
          <TextInput 
            variant="body1" 
            editing={menu.editing}
            
            room
            roomList={menu.rooms}
            eventfk={menu.data.ID}

            fullWidth
            value={ menu.editing ? menu.data.rooms : menu.data.rooms?.map(f => getRoomName(f.roomfk)).join(", ")} 
            onChange={console.log}/> 
        </Flex>


        <Flex spacing={1}> 
          <TextInput 
            muted  
            date
            editing={menu.editing}
            type="date"
            sx={{ maxWidth: 220 }}
            variant="body2"
            label="Event Date"
            value={menu.editing ? menu.data.CustomDate : moment(new Date(menu.data.CustomDate)).format('dddd MMM Do, YYYY')} 
          /> 

          <TextInput
            label="Start Time"
          sx={{mt: menu.editing ? 1 : 0}} muted variant="body2" value={menu.editing ? menu.data.EventStartTime : timeof(menu.data.EventStartTime)} 
            type="time"  editing={menu.editing}/>
          <Box>to</Box>

          <TextInput
            label="End Time"
          sx={{mt: menu.editing ? 1 : 0}} muted variant="body2" value={menu.editing ? menu.data.EventEndTime : timeof(menu.data.EventEndTime)} 
            type="time"  editing={menu.editing}/>
                
        </Flex>

        <Flex>
          <RecurseDesc event={menu.data} />
        </Flex>

      {!!menu.editing && <Flex spacing={1}> 
        <Switch checked />  
        <Nowrap variant="body2">Allow 30 minutes setup and breakdown time</Nowrap> 
      </Flex>}
     

    </Stack>
   

      <Flex sx={{ mt: 3 }} spacing={1}>
        <Btn 
          endIcon={<TextIcon  icon={menu.editing ? "Close" : "Edit"}   />}
          variant={menu.editing ? "outlined" : "contained"}  
          onClick={() => {
            menu.send({
              type: 'prop',
              key: 'editing',
              value: !menu.editing
            })
          }}>
          {menu.editing ? "Cancel" : "Edit event"}
        </Btn>
      {!!menu.editing && <Btn onClick={menu.handleClose()} 
        endIcon={<TextIcon icon="Save" />}
        variant="contained">
        Save changes
      </Btn>}
      </Flex>
    </Box>

    <Box sx={{ p: 2, backgroundColor: t => menu.editing ? t.palette.grey[100] : 'white'}}>
    <Flex spacing={1}> 
        <TextIcon icon="Person" /> 
        <Stack>
        <Nowrap>{menu.data.FullName}</Nowrap>
        <Nowrap variant="caption">Creator</Nowrap>
        </Stack>
      </Flex>
    </Box>
 
   </Layout>}
 </Popover>


 );
}
EventPopover.defaultProps = {};
export default EventPopover;
