import React from 'react';
import { styled, LinearProgress, Stack, Drawer, IconButton, Box } from '@mui/material';
import { Flex, Nowrap, Btn, Spacer, Check, TinyButton, TextIcon, GridForm, GridFormFooter, Columns, IconTextField } from "../../../styled";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2),
 height: '60vh'
}));

const DomainRow = ({ onSelect, selected, domain }) => {
  // const [ subdomain, ...rest ] = domain.Name.split('.');
  return <Columns spacing={1} columns="24px 24px 160px 180px 280px 1fr">

<TinyButton icon="Launch" onClick={() => window.open(`https://${domain.Subdomain}.eventbuilder.pro`)} />
    <Check on={selected} />

    <Nowrap onClick={() => onSelect(domain.Subdomain)} bold={selected} hover>{domain.Subdomain}</Nowrap> 

  <Flex><Nowrap bold={selected}>{domain.InstanceName}</Nowrap></Flex>

  <Nowrap bold={selected}>{domain.DbName}</Nowrap>

  {!!domain.dnsRecord && <Nowrap bold={selected}>{domain.dnsRecord}</Nowrap>}

</Columns>
}
 
const DomainManager = ({ handler }) => {
  const handleClose = () => {
    handler.send('CLOSE')
  }

  const fields = [
    {
      label: "Name",
      field: 'InstanceName', 
      caption: "Enter the name of this instance will appear on the website.",
     
    },
    {
      label: "Subdomain",
      caption: " This is the first part of the URL where the new instance will be hosted.",
      field: 'Subdomain', 
    },
    {
      label: "Cognito User Pool name",
      field: 'UserPoolName', 
      caption: "Create a new Cognito user pool for this application",
     
    },
    {
      label: "Database name",
      field: 'DbName', 
      caption: "Set the database name used to store the application data",
     
    },
  ]

  const stepProps = [
    'Getting initial info',
    'Adding Amplify domain',
    'Building environment',
    'Requesting domain certificate',//3
    "Writing validation",//5
    "Checking validation status",//6
    "Done"
  ];
  
  const editing = handler.state.matches("opened.adding");
  const working = editing && !handler.state.matches("opened.adding.info");
  
 return (
  <Drawer open={handler.open} anchor="bottom">
    <Flex
      spacing={1}
      sx={{
        p: 1,
        height: 56,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: (t) => t.palette.grey[100],
      }}
    >
      <Box sx={{ width: 64, textAlign: 'center' }}>
        <IconButton   
        >
          <TextIcon  icon="Settings"/>
        </IconButton>
      </Box>
      <Nowrap>Manager EventBuilder Instances</Nowrap>

        <Spacer />

        {handler.state.can('DROP') && 
          !!handler.selected?.length &&
        <IconButton onClick={() => handler.send('DROP')}><TextIcon icon="Delete" /></IconButton>}
      
        {!!handler && handler.state.matches('opened.list') && <IconTextField 
        prompt 
        button={<IconButton><TextIcon  icon="Add" /></IconButton>}
        icon="Add"
        onChange={e => { 
          handler.send ({
            type: 'ADD',
            name: e.target.value
            }) 
        }}

        label={`Add new instance `}
        name="instanceName"
        description={`Enter a instance title.`}
        placeholder={`Type or paste a new instance title`}
        okayText={`Add instance`}
        />}


      <IconButton>
        <TextIcon icon="Close" onClick={handleClose} />
      </IconButton>
    </Flex>
   <Layout data-testid="test-for-DomainManager">

{/* [{JSON.stringify(handler.domains)}] */}
    <Columns
          sx={{ alignItems: 'flex-start' }}
          columns={
            editing ? '65% 1fr' : '100% 0'
          }
        >

      {!handler.state.matches('opened.adding') && <Box sx={{ height: '60vh', overflow: 'auto'}}>

        <Columns spacing={1} columns="24px 24px 160px 180px 280px 1fr">
          <Nowrap />
          <Nowrap />
          <Nowrap bold>Domain</Nowrap>
          <Nowrap bold>Title</Nowrap>
          <Nowrap bold>Database</Nowrap>
          <Nowrap bold>DNS Record</Nowrap>
        </Columns>
        <Stack spacing={1}>
          {!!handler.domains && handler.domains 
            .map(d => (<DomainRow onSelect={id => {
              handler.send({
                type: 'SELECT',
                id
              })
            }} 
            selected={handler.selected?.find(f => f === d.Subdomain)}
            key={d.Name} 
            domain={d} 
          />))}
        </Stack>


      </Box>}

      {handler.state.matches('opened.adding') && <Stack spacing={2}><pre>

      <Stepper activeStep={handler.step} alternativeLabel>
            {stepProps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

         {!!handler.progress && <LinearProgress value={handler.progress} />}

      <Nowrap>{handler.state.meta?.message}</Nowrap>

      {handler.state.matches('opened.adding.success') && <Btn
        onClick={() => handler.send('OK')}
          variant="contained"
        >Okay</Btn> }
        
      {handler.state.matches('opened.adding.check_record_status.timeout') && <Flex>
              Operation has timed out
      <Btn
        onClick={() => handler.send('OK')}
          variant="contained"
        >Okay</Btn>

      </Flex> }
        
      {JSON.stringify(handler.state.meta,0,2)}
      {JSON.stringify(handler.progress,0,2)}
      {JSON.stringify(handler.record,0,2)}
     [[ {JSON.stringify(handler.step,0,2)}]]
        </pre></Stack>}

      <Box>

     {!!handler.record && <GridForm 
      sx={{mb: 2}}
        icon="Settings"
        disabled={working}
        error={handler.state.matches('opened.adding.confirm')}
        title="Enter application details"
        config={fields} 
        values={handler.record}  
        dirty={handler.dirty}
        handleChange={handler.handleChange}
        handleClose={() => handler.send('CANCEL')}
        handleSave={() => handler.send('CREATE')}
          />}

        <GridFormFooter
        sx={{ mt: 2 }}
        error={handler.state.matches('opened.adding.confirm')}
        handleClose={() => handler.send('CANCEL')}
        handleSave={() => handler.send('CREATE')}
          handler={handler}
        />
      </Box>


    </Columns>
{/* 
          handleUndo={() => handler.send('UNDO')}
           
          error={handler.is('confirm_close')} 
          handleChange={handler.handleChange} */}


      {/* {JSON.stringify(handler.state.value,0,2)} */}
      {/* {JSON.stringify(handler.state.meta,0,2)} */}
      {/* {JSON.stringify(handler.record,0,2)} */}
      {JSON.stringify(handler.error,0,2)}
      {JSON.stringify(handler.stack,0,2)}
     {/* <pre>
      {JSON.stringify(handler.domains,0,2)}
     </pre> */}
   </Layout>
    
    </Drawer>
 );
}
DomainManager.defaultProps = {};
export default DomainManager;
