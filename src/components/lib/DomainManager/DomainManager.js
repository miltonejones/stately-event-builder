import React from 'react';
import { styled, Card, LinearProgress, Stack, Drawer, Typography, IconButton, Box } from '@mui/material';
import { Flex, Nowrap, RotateButton, JsonCollapse, ConfirmPop, Btn, Spacer, Check, TinyButton, TextIcon, GridForm, GridFormFooter, Columns, IconTextField } from "../../../styled";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(2),
 height: '65vh'
}));

const DomainRow = ({ onSelect, onEdit, selected, domain }) => {
  // const [ subdomain, ...rest ] = domain.Name.split('.');
  return <Columns spacing={1} columns="24px 24px 200px 180px 280px 1fr">

<TinyButton icon="Launch" onClick={() => window.open(`https://${domain.Subdomain}.eventbuilder.pro`)} />
    <Check onClick={() => onSelect(domain.Subdomain)} on={selected} />

  <Flex onClick={() => onEdit(domain.Subdomain)}><Nowrap hover bold={selected}>{domain.InstanceName}</Nowrap></Flex>
    <Nowrap bold={selected} >{domain.Subdomain}</Nowrap> 


  <Nowrap bold={selected}>{domain.DbName}</Nowrap>

  {!!domain.dnsRecord && <Nowrap bold={selected}>{domain.dnsRecord}</Nowrap>}

</Columns>
}
 
const DomainManager = ({ source, handler }) => {
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
      disabled: handler.state.matches("opened.editing")
    },
    {
      label: "Cognito User Pool name",
      field: 'UserPoolName', 
      caption: "Create a new Cognito user pool for this application",
      disabled: handler.state.matches("opened.editing")
     
    },
    {
      label: "Database name",
      field: 'DbName', 
      caption: "Set the database name used to store the application data",
      disabled: handler.state.matches("opened.editing")
     
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
  
  const editing = ["opened.adding", "opened.editing"].some (handler.state.matches);
  const busy = ["opened.load", "opened.dropping"].some (handler.state.matches);
 
  const working = editing && !handler.state.matches("opened.adding.info");
  const metaKeys = Object.keys(handler.state.meta ?? {});
  const metaMsg = !metaKeys.length ? "" : handler.state.meta[metaKeys[0]].message;
  
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
          <TextIcon  icon="AppRegistration"/>
        </IconButton>
      </Box>
      <Nowrap>Manage EventBuilder Instances</Nowrap>

        <Spacer />

        {handler.state.can('DROP') && 
          !!handler.selected?.length &&
          <ConfirmPop 
            label="Confirm delete"
            caption="This cannot be undone!"
            message={<>Are you sure you want to delete <b>{handler.selected.length}</b> domains?</>} onChange={ok => {
            !!ok && handler.send('DROP')
          }}><IconButton><TextIcon icon="Delete" /></IconButton></ConfirmPop>}
      
      {handler.state.matches('opened.adding') && <RotateButton deg={!source.props.json ? 0 : 180} onClick={() => source.setProp('json', !source.props.json)}>
        <TextIcon icon="Code"  />
      </RotateButton>}
      {!handler.state.matches('opened.adding') && <RotateButton deg={!source.props.hi ? 0 : 180} onClick={() => source.setProp('hi', !source.props.hi)}>
        <TextIcon icon="Code"  />
      </RotateButton>}
      
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

    {(busy || !!handler.progress) && <LinearProgress 
            variant={busy ? "indeterminate" : "determinate"} 
            value={handler.progress} 
            />}

   <Layout data-testid="test-for-DomainManager">

{/* [{JSON.stringify(handler.state.value)}] */}
    <Columns
          sx={{ alignItems: 'flex-start' }}
          columns={
            editing ? '65% 1fr' : '100% 0'
          }
        >

      {!handler.state.matches('opened.adding') && <Box sx={{ height: '60vh', overflow: 'auto'}}>

        <JsonCollapse object={handler.hello} open={!!source.props.hi}>
          {!busy && <>
            <Stack spacing={1} sx={{ mb: 4 }}>
              <Nowrap bold>Instances</Nowrap>
              <Typography  sx={{ lineHeight: 1.2, color: 'text.secondary', fontSize: '0.85rem' }} >
                This is the current list of EventBuilder instances. Click on a domain to open the edit form, where you can modify or update the applications within that domain. 
                Use the form fields to make changes to the application details, such as the title or description, 
                and click "Save" to apply the changes. To add a new application, 
                click on the "+" button and fill out the required fields.  
              </Typography> 
            </Stack>
      
            <Columns spacing={1} columns="24px 24px 200px 180px 280px 1fr">
              <Nowrap />
              <Nowrap />
              <Nowrap bold>Title</Nowrap>
              <Nowrap bold>Domain</Nowrap>
              <Nowrap bold>Database</Nowrap>
              <Nowrap bold>DNS Record</Nowrap>
            </Columns>        
          </>}



          <Stack spacing={1}>
            {!!handler.domains && handler.domains 
              .map(d => (<DomainRow 
                onSelect={id => {
                  handler.send({
                    type: 'SELECT',
                    id
                  })
                }} 
                onEdit={id => {
                  handler.send({
                    type: 'EDIT',
                    id
                  })
                }} 
                selected={handler.selected?.find(f => f === d.Subdomain) || handler.ID === d.Subdomain}
                key={d.Name} 
                domain={d} 
            />))}
          </Stack>
        </JsonCollapse>

      </Box>}

      {handler.state.matches('opened.adding') && <Stack spacing={2}>

      <JsonCollapse object={handler.record} open={!!source.props.json}>
        
        <Stepper activeStep={handler.step} alternativeLabel>
            {stepProps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

      </JsonCollapse>

      <Card sx={{ p: 2, maxWidth: 500 }}>


        {handler.step > 1 && <Flex spacing={1} sx={{ pl: 2}} onClick={() => window.open(`https://${handler.record.Subdomain}.eventbuilder.pro`)}>
        
            <TinyButton icon="Launch" />
          Open 
        <Nowrap hover muted>{handler.record.Subdomain}.eventbuilder.pro</Nowrap>
        </Flex>}

        {handler.state.matches('opened.adding.success') && <Flex spacing={1} sx={{ pl: 2 }}>
          <Check on />
        <Nowrap muted>
          Operation is complete.
        </Nowrap>
        <Btn
          onClick={() => handler.send('OK')}
            variant="contained"
          >Finish</Btn>

        </Flex> }
        
        <Flex spacing={1}>
          <TinyButton icon="Info" />
          <Nowrap muted>{metaMsg}</Nowrap>
        </Flex>
       
      </Card>
 

      {handler.state.matches('opened.adding.check_record_status.timeout') && <Flex spacing={1} sx={{ pl: 1 }}>
           
      <Nowrap small hover>   Operation has timed out</Nowrap>
      <Btn
        size="small"
        onClick={() => handler.send('OK')}
          variant="outlined"
        >Close</Btn>
      </Flex> }

       </Stack>}

          <Box>

        {!!handler.record && <GridForm 
          sx={{mb: 2}}
            icon="Settings"
            disabled={working}
            error={['opened.adding.confirm', 'opened.editing.confirm'].some(handler.state.matches)}
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
            disabled={working}
            error={['opened.adding.confirm', 'opened.editing.confirm'].some(handler.state.matches)}
            handleClose={() => handler.send('CANCEL')}
            handleSave={() => handler.send('CREATE')}
            drop={handler.state.matches('opened.adding') ? null : "DELETE"}
              handler={handler}
            />
          </Box>


    </Columns>
 
      {/* <pre>
      {JSON.stringify(handler.hello,0,2)}
      </pre> */}
      {JSON.stringify(handler.error,0,2)}
      {JSON.stringify(handler.stack,0,2)}
 
   </Layout>
    
    </Drawer>
 );
}
DomainManager.defaultProps = {};
export default DomainManager;
