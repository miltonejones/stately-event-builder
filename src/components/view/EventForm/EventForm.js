import React from 'react';
import {
  styled, 
  Card, 
  Grid, 
  // Divider, 
  Stack,
  // Box,
} from '@mui/material';

import {
  Flex,
  // Btn,
  // Spacer, 
  TextIcon,
  // Nowrap,
  Columns,  
  IconTextField,
  // Warn,
  // GridFormHeader,
  GridFormFooter,
  Pill
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
  padding: theme.spacing(2)
})); 
 
const Field = (props) => {
  const { xs = 12 } = props;

  return (
    <Grid item xs={xs}>
      <EventInput {...props} />
    </Grid>
  );
};

const CategoryPill = ({categories, folderfk}) => {
  const pill = categories.find(f => f.ID ===folderfk);
  return <Pill sx={{ mr: 1 }} color={pill.color}>{pill.title}</Pill>
}

const EventForm = ({ handler, whois, disabled }) => {
  const navigate = useNavigate();
  const opened = Boolean(handler.view & VIEW.FORM_OPTIONBAR);
  if (!handler.eventProp) {
    return <i />;
  } 

  const { dates, ...data} = handler.eventProp;
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

  const columns = opened ? "1fr 360px" : "1fr 24px";
  const error = handler.is('editing.leaving');

  // if (handler.is('editing.leaving')) {
  //   return <Card sx={{p: 2, m: 2, maxWidth: 500}}><Stack>
  //   <Warn filled severity="warning">You have unsaved changes.</Warn>
  //     <Nowrap sx={{ mt: 1 }}>Are you sure you want to exit?</Nowrap>
  //     <Flex sx={{ mt: 1 }} spacing={1}>
  //       <Btn variant="contained" onClick={() => handler.send('SAVE')}>Save Changes</Btn>
  //       <Spacer />
  //       <Btn onClick={() => handler.send('CANCEL')}>Cancel</Btn>
  //       <Btn variant="contained" color="error" onClick={() => handler.send('OK')}>Discard Changes</Btn>
  //     </Flex>
  //   </Stack></Card>
  // }

  return (
    <Columns sx={{ alignItems: 'flex-start', mb: 8 }} columns={columns}>
      <Stack spacing={1} sx={{ p: 1 }}>

        <Layout sx={{ mb: 5}}>

          <FormHeader handler={handler} handleIndex={handleIndex} /> 

          {!handler.props.showJSON && (
            <Grid
              container
              spacing={2}
              sx={{ width: 'calc(100%)', mt: 1 }}
            >

              <Grid item xs={12}>
                <Flex spacing={2}>
                <TextIcon icon="Edit" />
                <IconTextField 
                  autoFocus
                  name="EventName"
                  error={error}
                  helperText={error ? "If you leave now you will lose your unsaved changes!" : ""}
                  onChange={e => handleChange(e.target.name, e.target.value)}
                  startIcon={
                    handler.eventProp.categories.map(c => <CategoryPill folderfk={c.folderfk} categories={handler.categories}/>)
                  }
                  size="small"
                  fullWidth
                  label="Event Name"
                  value={handler.eventProp.EventName}
                />      

                </Flex>         
              </Grid>


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
                <GridFormFooter 
                sx={{ ml: 5 }}
                handler={handler} 
                error={error} 
                cancel="CANCEL" 
                handleClose={() => navigate('/list')}
                handleSave={() => handler.send('SAVE')}
                />
              </Grid>

              {/* control buttons */}
              {/* <Grid item xs={12}>
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
              </Grid> */}
            </Grid>
          )}

          {!!handler.props.showJSON && (
            <pre>{JSON.stringify(data, 0, 2)}</pre>
          )}
        </Layout>

        <CommentList
          value={handler.eventProp.comments}
          handleChange={handleChange}
          handler={handler}
          whois={whois}
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
