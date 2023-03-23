import React from 'react';
import { Box, Stack, Grid } from '@mui/material';
import GridField from './GridField';
import Nowrap from './Nowrap'; 
import GridFormHeader from './GridFormHeader';
import TextIcon from './TextIcon';

const GridForm = (props) => {
  const {
    config,
    values, 
    error,
    handleChange, 
  }  = props;
  return (
    <Box sx={{ p: 1 }}>
      {!!error && (
        <Nowrap color="error" small>
          If you leave you will lose your unsaved changes!
        </Nowrap>
      )}

      <GridFormHeader {...props} />
 

      <Grid sx={{ maxWidth: '100%' }} container spacing={2}>
        {config.map((conf) => (
          <Grid item xs={conf.xs || 12} key={conf.field}>
            <Stack>
              {!!conf.label && (
                <Nowrap bold variant="body2">
                  {conf.label}
                </Nowrap>
              )}
              {!!conf.caption && (
                <Nowrap sx={{ mb: !!conf.field ? 1 : 0 }} small muted>
                  {conf.caption}
                </Nowrap>
              )}

              {!!conf.field && (
                <GridField
                  startIcon={!conf.icon ? conf.startIcon : <TextIcon icon={conf.icon} />}
                  renderOption={conf.renderOption}
                  label={conf.label || conf.field}
                  name={conf.field}
                  type={conf.type}
                  options={conf.options}
                  disabled={conf.disabled}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  value={values[conf.field]}
                />
              )}
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GridForm;
