import React from 'react';
import {
  styled, 
  Card, 
  Grid, 
  Divider, 
  Stack,
} from '@mui/material';

import {
  Flex,
  Btn,
  Spacer, 
  TextIcon,
  // TinyButton,
  Columns,  
} from '../../../styled'; 
import { formProps } from './config';
import { useNavigate } from 'react-router-dom'; 
import CategoryList from './components/CategoryList/CategoryList';
import CalendarList from './components/CalendarList/CalendarList';
import CommentList from './components/CommentList/CommentList';
import FormHeader from './components/FormHeader/FormHeader';
import EventOptions from './components/EventOptions/EventOptions';
import EventInput from './components/EventInput/EventInput'; 
import { VIEW } from '../../../machines'; 

const Layout = styled(Card)(({ theme }) => ({ 
  border: 'solid 1px ' + theme.palette.divider,
})); 
 
const Field = (props) => {
  const { xs = 12 } = props;

  return (
    <Grid item xs={xs}>
      <EventInput {...props} />
    </Grid>
  );
};

const EventForm = ({ handler, disabled }) => {
  const navigate = useNavigate();
  const opened = Boolean(handler.view & VIEW.FORM_OPTIONBAR);
  if (!handler.eventProp) {
    return <i />;
  } 

  const handleIndex = (i) => {
    handler.send({
      type: 'EDIT',
      ID: handler.eventList[i].ID,
    });
  };

  const handleChange = (key, value) => {
    handler.send({
      type: 'ATTR',
      key,
      value,
    });
  };

  const columns = opened ? "1fr 300px" : "1fr 24px";

  return (
    <Columns sx={{ alignItems: 'flex-start', mb: 8 }} columns={columns}>
      <Stack spacing={1} sx={{ p: 1 }}>

        <Layout>

          <FormHeader handler={handler} handleIndex={handleIndex} /> 

          {!handler.props.showJSON && (
            <Grid
              container
              spacing={1}
              sx={{ width: 'calc(100% - 48px)', m: 2 }}
            >

              {/* loop over form config to render event attribute elements */}
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

              {/* control buttons */}
              <Grid item xs={12}>
                <Flex spacing={1}>
                  <Spacer />
                  <Btn size="small" onClick={() => navigate('/list')}>
                    Cancel
                  </Btn>
                  <Btn
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => handler.send('SAVE')}
                    endIcon={<TextIcon icon="Save" />}
                    disabled={handler.busy || handler.saving || disabled || !handler.dirty}
                  >
                    Save
                  </Btn>
                </Flex>
              </Grid>
            </Grid>
          )}

          {!!handler.props.showJSON && (
            <pre>{JSON.stringify(handler.eventProp, 0, 2)}</pre>
          )}
        </Layout>

        <CommentList
          value={handler.eventProp.comments}
          handleChange={handleChange}
          handler={handler}
        />

      </Stack>

      <Stack spacing={1} sx={{ p: 1, alignItems: opened ? 'stretch' : 'center' }}>

        <EventOptions handler={handler} />
   
        {opened && <CategoryList
          value={handler.eventProp.categories}
          handleChange={handleChange}
          handler={handler}
        />}

        {opened && <CalendarList
          value={handler.eventProp.calendars}
          handleChange={handleChange}
          handler={handler}
        />}
      </Stack>
    </Columns>
  );
};
EventForm.defaultProps = {};
export default EventForm;
