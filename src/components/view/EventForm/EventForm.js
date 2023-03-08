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
} from "@mui/material";
import { Flex, Btn, Spacer, Columns, Nowrap } from "../../../styled";
import { DateInput, CalendarInput } from "../..";
import { formProps } from "./config";
import { useNavigate } from "react-router-dom";
import { apiDate } from "../../../util/apiDate";
import { recurseText } from "../../../util/recurseText";

const Layout = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  // padding: theme.spacing(2),
  border: "solid 1px " + theme.palette.divider,
}));

const RangeCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  // padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  // color: theme.palette.common.white,
}));

const Range = (props) => {
  const { handler } = props;
  const { eventProp } = handler;
  const caption = recurseText(eventProp);
  return (
    <>
      <RangeCard
        onClick={() => {
          handler.send({
            type: "CHANGE",
            key: "showRange",
            value: !handler.props.showRange,
          });
        }}
      >
        <Typography variant="body2">
          Every {caption.label} {caption.middle} {caption.suffix} until{" "}
          {caption.until} {eventProp.EventDate}
        </Typography>
      </RangeCard>
      {/* {JSON.stringify(recurseText(eventProp))} */}
      <Collapse in={handler.props.showRange}>
        <pre>
          {eventProp.dates.map((f) => (
            <Box>
              {f.CustomDate} {apiDate(new Date(f.CustomDate))}{" "}
            </Box>
          ))}
        </pre>
      </Collapse>
    </>
  );
};

const Input = (props) => {
  const {
    rows,
    handler,
    auto,
    types,
    type = "text",
    handleChange,
    field,
    label,
  } = props;

  if (["range"].find((f) => f === type)) {
    return <Range {...props} />;
  }

  if (["date"].find((f) => f === type)) {
    return (
      <DateInput
        label={label}
        setValue={(e) => handleChange(field, apiDate(new Date(e)))}
        value={handler.eventProp[field]}
      />
    );
  }

  if (["text", "time"].find((f) => f === type)) {
    return (
      <TextField
        sx={{ mt: 1 }}
        fullWidth
        autoFocus={auto}
        multiline={!!rows}
        select={!!types}
        rows={rows}
        size="small"
        label={label}
        onChange={(e) => handleChange(field, e.target.value)}
        value={handler.eventProp[field]}
      >
        {types?.map((type, i) => (
          <MenuItem key={i} value={i}>
            {typeof type === "string" ? type : <hr style={{ width: "100%" }} />}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (type === "rooms") {
    return (
      <TextField
        select
        fullWidth
        size="small"
        label={label}
        onChange={(e) => handleChange(field, e.target.value)}
        value={handler.eventProp[field]}
      >
        {handler.roomList?.map((room) => (
          <MenuItem value={room.ID}>{room.RoomName}</MenuItem>
        ))}
      </TextField>
    );
  }

  return <>[{type}]</>;
};

const Field = (props) => {
  const { xs = 12 } = props;

  return (
    <Grid item xs={xs}>
      <Input {...props} />
    </Grid>
  );
};

const EventForm = ({ handler }) => {
  const navigate = useNavigate();
  if (!handler.eventProp) {
    return <i />;
  }

  const handleChange = (key, value) => {
    handler.send({
      type: "ATTR",
      key,
      value,
    });
  };
  return (
    <Columns sx={{ alignItems: "flex-start", mb: 8 }} columns="300px 1fr 300px">
      <Box>
        <CalendarInput handler={handler} />
      </Box>

      <Box>
        <Layout data-testid="test-for-EventForm">
          <Flex
            spacing={1}
            sx={{
              backgroundColor: (t) => t.palette.primary.main,
              p: 1,
              color: "white",
            }}
          >
            Edit{" "}
            <Nowrap sx={{ color: "white" }} small bold>
              {handler.eventProp.EventName}
            </Nowrap>
          </Flex>

          <Grid container spacing={1} sx={{ width: "calc(100% - 48px)", m: 2 }}>
            {formProps.map((prop) => (
              <Field
                handleChange={handleChange}
                key={prop.field}
                {...prop}
                handler={handler}
              />
            ))}

            <Grid item xs={12}>
              <hr />
            </Grid>

            <Grid item xs={12}>
              <Flex spacing={1}>
                <Spacer />
                <Btn size="small" onClick={() => navigate("/list")}>
                  Cancel
                </Btn>
                <Btn size="small" variant="contained" color="warning">
                  Save
                </Btn>
              </Flex>
            </Grid>
          </Grid>

          {!!handler.showJSON && (
            <pre>{JSON.stringify(handler.eventProp, 0, 2)}</pre>
          )}
        </Layout>
      </Box>
      <Box>right</Box>
    </Columns>
  );
};
EventForm.defaultProps = {};
export default EventForm;
