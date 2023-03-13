import React from "react";
import {
  styled,
  TextField,
  Typography,
  MenuItem,
  Card,
  Box,
  Grid,
  Collapse,
  IconButton,
  Divider,
  Switch, Stack
} from "@mui/material";
import moment from 'moment';
import { Flex, Btn, Spacer, IconTextField, TextIcon, TinyButton, Columns, Banner, Nowrap } from "../../../styled";
import { DateInput,  RoomSelect } from "../..";
import { formProps } from "./config";
import { useNavigate } from "react-router-dom";
import { apiDate } from "../../../util/apiDate"; 
import { recurseText } from "../../../util/recurseText";

// const eventTime = f => {
//   const [hh,mm] = f.split(":");;
//   const num = (((hh % 12) * 3600) + (mm * 60)) * 1000;
//   return moment.utc(num).format('HH:mm') ;
// }

const Layout = styled(Card)(({ theme }) => ({
  // margin: theme.spacing(2),
  // padding: theme.spacing(2),
  border: "solid 1px " + theme.palette.divider,
}));

const RangeCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  // padding: theme.spacing(2),
  // backgroundColor: theme.palette.primary.light,
  // color: theme.palette.common.white,
}));

const Range = (props) => {
  const { handler } = props;
  const { eventProp } = handler;
  const caption = recurseText(eventProp);
  return (
    <>
      <RangeCard >
        <Flex spacing={1}>

        <Typography variant="body2">
          Every 
        </Typography>
        <TextField
            size="small"
            sx={{maxWidth: 50}}
            value={eventProp.RecurseUnit}
            /> 
            
        <Typography variant="body2" >
        <b>{caption.label}</b> {caption.middle} <b>{caption.suffix}</b> until{" "}
          <b>{caption.until}</b> 
        </Typography>
          <IconButton
              onClick={() => {
                handler.send({
                  type: "CHANGE",
                  key: "showRange",
                  value: !handler.props.showRange,
                });
              }}
        >
          <TextIcon
            icon={
              handler.props.showRange
                ? "KeyboardArrowUp"
                : "KeyboardArrowDown"
            }
          />

        </IconButton>
        </Flex>
      </RangeCard>
      {/* {JSON.stringify(recurseText(eventProp))} */}
      <Collapse in={handler.props.showRange}>
        <Flex sx={{p: 1}}>

          <DateInput
            label="End Date" 
            value={eventProp.RecurseEndDate}
          />

        </Flex>
        <Card sx={{p: 2, }} elevation={1}>
          <Box sx={{position: 'relative',  p:  2, border: 1, borderRadius: 1, borderColor: 'divider' }}>

            <Box sx={{  position: 'absolute', top: -8, background: 'white' }}>Selected dates</Box>
            <Box sx={{ maxHeight: 400, overflow: 'auto'}}>
              {eventProp.dates.map((f) => (
                <Flex spacing={1} sx={{p: 0.5, borderBottom:1, borderColor: 'divider'}}>
                  <TinyButton icon="Delete" />
                  <Typography variant="body2">
                {moment(new Date(f.CustomDate)).format('dddd, MMM Do YYYY')}{" "}
                  </Typography>
                </Flex>
              ))}
            </Box>
          </Box>
        </Card>
      </Collapse>
    </>
  );
};

const Input = (props) => {
  const {
    rows,
    handler,
    auto, 
    prefix,
    types,
    type = "text",
    handleChange,
    field,
    label,
    none,
    icon = "AccessTime"
  } = props;

  if (["range"].find((f) => f === type) && !!handler.eventProp.RecurseEndDate) {
    return <Range {...props} />;
  }

  if (["date"].find((f) => f === type)) {
    return (
      <DateInput
        label={label}
        disabled={handler.busy}
        setValue={(e) => handleChange(field, apiDate(new Date(e)))}
        value={handler.eventProp[field]}
      />
    );
  }

  // if (["time"].find((f) => f === type)) {
  //   return (
  //     <IconTextField
  //     startIcon={!prefix ? null : <Flex 
  //         sx={{
  //           fontSize: '0.8rem',
  //           borderRadius: 1,
  //           p: t => t.spacing(0, 0.5) ,
  //           backgroundColor: 'divider',
  //         }}
  //         ><TinyButton icon={icon} /> {prefix}</Flex>}
  //       label={label}
  //       type="time"
  //       size="small"
  //       fullWidth
  //       disabled={handler.busy}
  //       setValue={(e) => handleChange(field, apiDate(new Date(e)))}
  //       value={handler.eventProp[field]}
  //       inputProps={{
  //         step: 900, // 5 min
  //       }}
  //     />
  //   );
  // }

  if (["text", "time"].find((f) => f === type)) {
    return (
      <>
      {/* {type === 'time' && <>{eventTime( handler.eventProp[field]) }--{handler.eventProp[field]}</>} */}
      <IconTextField
        sx={{ mt: 1 }}
        fullWidth
        type={type}
        startIcon={!prefix ? null : <Flex 
            sx={{
              fontSize: '0.8rem',
              borderRadius: 1,
              p: t => t.spacing(0, 0.5) ,
              backgroundColor: 'divider',
            }}
            ><TinyButton icon={icon} /> {prefix}</Flex>}
        autoFocus={auto}
        multiline={!!rows}
        disabled={handler.busy}
        select={!!types}
        rows={rows}
        size="small"
        label={label} 

        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min:'12:00',
          max: '01:00',
          step: 900, // 5 min
        }}

        onChange={(e) => handleChange(field, e.target.value)}
        value={
          !!handler.eventProp[field] || handler.eventProp[field] === 0
            ? handler.eventProp[field]
            : -1
        }
      >
        {!!none && <MenuItem value={-1}>{none}</MenuItem>}
        {types?.map((type, i) => (
          <MenuItem key={i} value={i}>
            {typeof type === "string" ? type : <Divider sx={{ width: "100%" }} />}
          </MenuItem>
        ))}
      </IconTextField></>
    );
  }

  if (type === "rooms" && handler.roomList) {
    return <RoomSelect rooms={handler.roomList} value={handler.eventProp[field]}/>
    // return (
    //   <TextField
    //     select
    //     fullWidth
    //     size="small"
    //     disabled={handler.busy}
    //     label={label}
    //     onChange={(e) => handleChange(field, e.target.value)}
    //     value={handler.eventProp[field]}
    //   >
    //     {handler.roomList?.map((room) => (
    //       <MenuItem value={room.ID}>{room.RoomName}</MenuItem>
    //     ))}
    //   </TextField>
    // );
  }

  return <i />;
};

const Field = (props) => {
  const { xs = 12 } = props;

  return (
    <Grid item xs={xs}>
      <Input {...props} />
    </Grid>
  );
};

 

const EventForm = ({ handler, disabled }) => {
  const navigate = useNavigate();
  if (!handler.eventProp) {
    return <i />;
  }
  const index = handler.eventList.map(f => f.ID).indexOf(handler.eventProp.ID);

  const handleIndex = (i) => { 
    handler.send({
      type: 'EDIT',
      ID: handler.eventList[i].ID
    })
  }

  const handleChange = (key, value) => {
    handler.send({
      type: "ATTR",
      key,
      value,
    });
  };
  return (
    <Columns sx={{ alignItems: "flex-start", mb: 8 }} columns="1fr 300px">
      {/* <Box>
        <CalendarInput handler={handler} />
      </Box> */}

      <Stack spacing={1} sx={{ p: 1 }}> 

      {/* <Btn onClick={() => navigate("/list")} startIcon={<TextIcon
                icon="KeyboardArrowLeft"
              />} >
                    back  
          </Btn>
         */}
        <Layout>
          <Banner disabled={handler.busy}>
            Edit{" "}
            <Nowrap small bold>
              {handler.eventProp.EventName}
            </Nowrap>
            <Spacer />
            <IconButton disabled={index < 1} onClick={() => handleIndex(index - 1)}>
              <TextIcon icon="KeyboardArrowLeft" /> 
            </IconButton> 
            <TextField 
                select 
                size="small"
                onChange={e => handleIndex(e.target.value) }
                value={index}
              >
                
              {Array.from(Array(handler.eventList.length).keys()).map(key => 
                <MenuItem key={key} value={key}>{key + 1}</MenuItem>)}
                
              </TextField>
              
              of {handler.eventList.length}
            <IconButton disabled={!handler.eventList[index + 1]} onClick={() => handleIndex(index + 1)}>
              <TextIcon icon="KeyboardArrowRight" /> 
            </IconButton> 
          </Banner>

          {!handler.props.showJSON && <Grid container spacing={1} sx={{ width: "calc(100% - 48px)", m: 2 }}>
            {formProps.map((prop) => (
              <Field
                handleChange={handleChange}
                key={prop.field}
                {...prop}
                handler={handler}
              />
            ))}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Flex spacing={1}>
                <Spacer />
                <Btn size="small" onClick={() => navigate("/list")}>
                  Cancel
                </Btn>
                <Btn size="small" variant="contained" color="warning"
                endIcon={   <TextIcon icon="Save" /> }
                      disabled={handler.busy || disabled}>
                  Save
                </Btn>
              </Flex>
            </Grid>
          </Grid>}

          {!!handler.props.showJSON && (
            <pre>{JSON.stringify(handler.eventProp, 0, 2)}</pre>
          )}
        </Layout>

        <Layout>
          <Banner>
            Comments
          </Banner>
          <Box sx={{ m: 1}}>
            <TextField 
              size="small"
              fullWidth
            />
          </Box>
        </Layout>
      </Stack>

      
      <Stack spacing={1} sx={{ p: 1 }}>
        <Layout>
          <Banner disabled><Nowrap small bold><b>Options</b></Nowrap></Banner>
          <Box sx={{ m: 1 }}>
            <Flex>
              <Switch checked={!!handler.eventProp.ApproveLogin} /> 
              <Nowrap muted small>Approved by <b>{handler.eventProp.FullName}</b></Nowrap>
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

        <Layout>
          <Banner disabled><Nowrap small bold><b>Categories</b></Nowrap></Banner>
          <Box sx={{ m: 1 }}>
            {handler.categories.map(cat => <Flex key={cat.id}>
              <Switch /> 
              <Nowrap muted small>{cat.title}</Nowrap>
            </Flex>)} 
          </Box>
        </Layout>

        <Layout>
          <Banner disabled><Nowrap small bold><b>Calendars</b></Nowrap></Banner>
          <Box sx={{ m: 1 }}>
            {handler.calendars.map(cat => <Flex key={cat.id}>
              <Switch /> 
              <Nowrap muted small>{cat.calendar_name}</Nowrap>
            </Flex>)} 
          </Box>
        </Layout>

       {/* [ {JSON.stringify(handler.calendars)}] */}
      </Stack>
    </Columns>
  );
};
EventForm.defaultProps = {};
export default EventForm;
