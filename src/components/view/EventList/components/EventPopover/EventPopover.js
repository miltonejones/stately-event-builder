import React from 'react';
import { styled, Avatar, Popover, Switch, Stack, TextField, LinearProgress, Box } from '@mui/material';
import { Flex, Spacer, Btn, TextIcon, Tooltag, TinyButton, Nowrap } from '../../../../../styled';
import { RoomSelect, DateInput } from '../../../..';
import { timeToNum } from '../../../../../util/timeToNum';
import { recurseText } from '../../../../../util/recurseText';
import { useClipboard } from '../../../../../util/useClipboard';
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

  const event = menu.data;
  const creator = menu.users?.find(f => f.ID === event?.CreateLogin);

  const { copy } = useClipboard();

  const isEditMode = menu.state.matches('opened.editing');
  


 
 return (
  <Popover anchorEl={menu.anchorEl}
  onClose={menu.handleClose()}  
  open={Boolean(menu.anchorEl) }
   >
    {/* {JSON.stringify(creator)} */}
    {!menu.state.matches('opened') && <Layout><LinearProgress />Loading event details...</Layout>}
   {menu.state.matches('opened') && <Layout on={isEditMode}>
    <Box sx={{ p: 2}}>


      <Flex spacing={1}> 
        <Nowrap muted variant="body2">Event Detail</Nowrap>
      {/* [  {JSON.stringify(eventDesc)}] */}
        <Spacer />


        {!!isEditMode && <Tooltag component={TinyButton} title="Save event" 
          caption="Save the event details you entered"
           icon="Save" />}

        <Tooltag component={TinyButton}  title={isEditMode ? "Close edit mode" : "Edit event"}  
          onClick={() => menu.send(isEditMode ? "cancel" : "edit")}
          icon={isEditMode ? "Close" : "BorderColor"} />


        <Tooltag component={TinyButton} title="Edit event details"  
          caption="Open event form for detailed editing"
          onClick={openEvent} icon="OpenInFull" />
      </Flex>

      <Stack spacing={isEditMode ? 1 : 0} sx={{ pt: isEditMode ? 2 : 0}}>
        <Flex sx={{ mt: 1 }}> 
          <TextInput 
            label="Event Name"
            bold={!!menu.data.RecurseEndDate}
            variant="h6" 
            editing={isEditMode}
            fullWidth
            value={menu.data.EventName} 
            onChange={console.log}/> 
        </Flex>


        <Flex> 
          <TextInput 
            variant="body1" 
            editing={isEditMode}
            
            room
            roomList={menu.rooms}
            eventfk={menu.data.ID}

            fullWidth
            value={ isEditMode ? menu.data.rooms : menu.data.rooms?.map(f => getRoomName(f.roomfk)).join(", ")} 
            onChange={console.log}/> 
        </Flex>


        <Flex spacing={1}> 
          <TextInput 
            muted  
            date
            editing={isEditMode}
            type="date"
            sx={{ maxWidth: 220 }}
            variant="body2"
            label="Event Date"
            value={isEditMode ? menu.data.CustomDate : moment(new Date(menu.data.CustomDate)).format('dddd MMM Do, YYYY')} 
          /> 

          <TextInput
            label="Start Time"
          sx={{mt: isEditMode ? 1 : 0}} muted variant="body2" value={isEditMode ? menu.data.EventStartTime : timeof(menu.data.EventStartTime)} 
            type="time"  editing={isEditMode}/>
          <Box>to</Box>

          <TextInput
            label="End Time"
          sx={{mt: isEditMode ? 1 : 0}} muted variant="body2" value={isEditMode ? menu.data.EventEndTime : timeof(menu.data.EventEndTime)} 
            type="time"  editing={isEditMode}/>
                
        </Flex>

        <Flex>
          <RecurseDesc event={menu.data} />
        </Flex>

      {!!isEditMode && <Flex spacing={1}> 
        <Switch checked />  
        <Nowrap variant="body2">Allow 30 minutes setup and breakdown time</Nowrap> 
      </Flex>}
     

    </Stack>
   
{/* 
      <Flex sx={{ mt: 3 }} spacing={1}>


        <Btn 
          endIcon={<TextIcon  icon={isEditMode ? "Close" : "Edit"}   />}
          variant={isEditMode ? "outlined" : "contained"}  
          onClick={() => {
            menu.send({
              type: 'prop',
              key: 'editing',
              value: !isEditMode
            })
          }}>
          {isEditMode ? "Cancel" : "Edit event"}
        </Btn>


      {!!isEditMode && <Btn onClick={menu.handleClose()} 
        endIcon={<TextIcon icon="Save" />}
        variant="contained">
        Save changes
      </Btn>}


      </Flex> */}
    </Box>

    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, backgroundColor: t => isEditMode ? t.palette.grey[100] : 'white'}}>
      <Flex spacing={1}  > 
        {/* <TextIcon icon="Person" />  */}
        <Avatar src={creator?.image} alt={event.FullName} />
        <Stack>
        <Nowrap>{menu.data.FullName}</Nowrap>
        <Nowrap variant="caption">Creator</Nowrap>
        </Stack>
      </Flex>
    </Box>
 
    <Flex sx={{p: 2, backgroundColor: t => isEditMode ? t.palette.grey[100] : 'white'}} spacing={1}> 
        <TextIcon icon="Email" /> 
     
        
        <Nowrap hover><a rel="noreferrer" target="_blank" href={`mailto:${creator?.Email}`}>{creator?.Email}</a></Nowrap> 
        <Spacer />
        <TinyButton icon="CopyAll" onClick={() => copy(creator?.Email)} />
      </Flex>
   </Layout>}
 </Popover>


 );
}
EventPopover.defaultProps = {};
export default EventPopover;
