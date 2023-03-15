import React from 'react';
import { styled, Collapse, Box, MenuItem, Switch, Alert, Card, Typography, LinearProgress, Stack } from '@mui/material';
import { Nowrap, Columns, Flex, TextIcon, Spacer, Banner, IconTextField, Btn } from "../../../styled";
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  width:'100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));


const InvalidUser = ({ send, user }) => {
  return <Stack spacing={1}><Alert severity="error">
    <Nowrap hover onClick={() => send('SIGNIN')}>User <b>{user.username}</b> does not have access to this content. Please log in as a different user.</Nowrap>
  </Alert>
  <Flex>
    <Spacer />
    <Btn variant="contained" onClick={() => send('SIGNIN')}>Sign in</Btn>
  </Flex>
  </Stack>
}
const SignInError = ({ send, error, stack }) => {
  return <Stack sx={{ maxWidth: 500}} spacing={1}> 
    <Typography variant="h6">There was an error with your signin</Typography>
    <Typography variant="body2">{error}</Typography>
    <Typography variant="caption">{stack}</Typography>
   <Flex>
    <Spacer/>
    <Btn variant="contained" onClick={() => send('RETRY')}>
      try again
    </Btn>
   </Flex>
  </Stack>
}

const SignUpForm = ({send, state, email, verificationCode, username, password }) => {
  const handleChange = (event) => {
    send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }

  return <Card sx={{ width: 400, height: 400}}>
    <Banner>Create New Account
 
    </Banner>
    <Stack sx={{p: 1}} spacing={1}>
      <Collapse sx={{ width: '100%'}}  in={state.matches('signing_up.config')}>
          <Stack sx={{p: 1}} spacing={1}>

            
          <Typography>Username</Typography>
            <IconTextField
              fullWidth
              startIcon={<TextIcon icon="Person" />}
              size="small"
              name="username"
              value={username}
              onChange={handleChange}
            /> 

            <Typography>Email Address</Typography>
            <IconTextField
              fullWidth
              startIcon={<TextIcon icon="Email" />}
              size="small"
              name="email"
              value={email}
              onChange={handleChange}
            /> 


          <Typography>Password</Typography>
          <IconTextField
            fullWidth
            startIcon={<TextIcon icon="Lock" />}
            size="small"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          <Flex>
            <Spacer />
            <Btn variant="contained" onClick={() => send('SEND')}>Create account</Btn>
          </Flex>
        </Stack>
      </Collapse>

    <Collapse sx={{ width: '100%'}} in={state.matches('signing_up.confirming')}>
    
      <Typography>Verification Code</Typography>
      <IconTextField
        fullWidth
        startIcon={<TextIcon icon="Code" />}
        size="small"
        name="verificationCode"
        value={verificationCode}
        onChange={handleChange}
      />

      <Flex>
        <Spacer />
        <Btn variant="contained" onClick={() => send('CONFIRM')}>Confirm</Btn>
      </Flex>
    
    </Collapse>


    </Stack>

  </Card>
}
 

const SignInForm = ({ demo, send, state, verificationCode, username, password }) => {
  const handleChange = (event) => {
    send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }
  return <Box>

    <Collapse in={demo.state.matches('translate')}>
      <Stack sx={{width: 500}} spacing={2}>
        <Alert>{demo.message}</Alert>
        <LinearProgress variant="determinate" value={demo.progress} />
        <Nowrap muted small><em>{demo.translation}</em></Nowrap>
      
        <Flex sx={{ width: '100%'}} spacing={2}> 
          <Spacer/> 
          <Btn onClick={() => demo.send('CANCEL')}>cancel</Btn> 
        </Flex>
      </Stack>
    </Collapse>

    <Collapse in={demo.state.matches('logging_in')}>
      <Stack sx={{width: 500}} spacing={2}>
      {!demo.state.matches('logging_in.choose_lang') && <Alert>{demo.message}</Alert>}
      {!!demo.state.matches('logging_in.choose_lang') && <Stack spacing={1}>
        <Nowrap variant="body2">Choose the language for your demo presenter</Nowrap>
      <IconTextField label="Choose language" fullWidth size="small"
        select onChange={(e) => demo.send({
          type: 'DECODE',
          code: e.target.value
        })}>
            {Object.keys(demo.languages).map(lang => <MenuItem key={lang} value={demo.languages[lang]}>{lang}</MenuItem>)}
            </IconTextField>
        </Stack>}
      
        <Flex sx={{ width: '100%'}} spacing={2}>
          <Btn variant="contained" color="warning" disabled={demo.state.matches('logging_in.choose_lang')} onClick={() => demo.send('LANG')}>change language</Btn>
          <Spacer/> 
          <Btn onClick={() => demo.send('CANCEL')}>cancel</Btn>
          <Btn disabled={!demo.state.matches('logging_in.ready')} variant="contained" onClick={() => demo.send('BEGIN')}> next</Btn>
        </Flex>
      </Stack>
    </Collapse>


    <Collapse in={demo.state.matches('init')}>
    <Card sx={{ width: 400, minHeight: 400}}>
    <Banner>Please sign in

      <Spacer />
      <Nowrap onClick={() => send('FORGOT')} hover variant="caption">
        Forgot password?
      </Nowrap>
    </Banner>
    <Stack sx={{p: 1}} spacing={1}> 

    <Collapse sx={{ width: '100%'}} in={!state.matches('signing_in.validate')}>
    
      <Typography>Username</Typography>
      <IconTextField
        fullWidth
        placeholder="Username"
        autoComplete="off"
        startIcon={<TextIcon icon="Person" />}
        size="small"
        name="username"
        value={username}
        onChange={handleChange}
      />
    
    </Collapse>

    <Collapse sx={{ width: '100%'}} in={state.matches('signing_in.validate')}>
    
      <Typography>Verification Code</Typography>
      <IconTextField
        fullWidth
        placeholder="Verification Code"
        autoComplete="off"
        startIcon={<TextIcon icon="Code" />}
        size="small"
        name="verificationCode"
        value={verificationCode}
        onChange={handleChange}
      />
    
    </Collapse>

  <Collapse sx={{ width: '100%'}} in={state.matches('signing_in.name_entry')} >
    <Stack>

    <Flex spacing={2}>
        <Spacer />
      <Btn onClick={() => send('CANCEL')}>Cancel</Btn>
      <Btn variant="contained" onClick={() => send('SUBMIT')}>Reset password</Btn>
    </Flex>
    <hr sx={{width: '100%'}} />
      <Typography variant="caption">You will be sent a verification code to the email address we have on file.</Typography>

    </Stack>
  </Collapse>

  <Collapse sx={{ width: '100%'}} in={['signing_in.form_entry', 'signing_in.validate'].some(state.matches)} >
    
    <Typography>Password</Typography>
    <IconTextField
      fullWidth
      autoComplete="off"
      placeholder="Password"
      startIcon={<TextIcon icon="Lock" />}
      size="small"
      type="password"
      name="password"
      value={password}
      onChange={handleChange}
    />

  </Collapse>

<Collapse sx={{ width: '100%'}} in={['signing_in.form_entry'].some(state.matches)} >
  
   <Flex spacing={1}>
      <Switch />
      <Typography>Remember me</Typography>
    </Flex>
    
    <Columns columns="100px 1fr" spacing={2}>
      <Btn variant="contained" onClick={() => send('SIGNIN')}>Login</Btn>
      <Typography variant="caption">This is a <b>secure area</b>. Please log in to use EventBuilder 8.</Typography>
    </Columns>

</Collapse>


<Collapse sx={{ width: '100%'}} in={['signing_in.validate'].some(state.matches)} >
     
     <Columns columns="160px 1fr" spacing={2}>
       <Btn variant="contained" onClick={() => send('UPDATE')}>reset password</Btn>
       <Typography variant="caption">This will reset your password.</Typography>
     </Columns>

 </Collapse>



    <Flex>
      <Spacer />
      <img src="/poweredby.gif" alt="logo"/>
    </Flex>
    
    <Flex spacing={1}>
      <Spacer />
      <Typography variant="caption">New to EventBuilder?</Typography>
      <Btn variant="contained" color="warning" onClick={() => send('SIGNUP')}>Create a new account</Btn>
    </Flex>
    
  </Stack>
  </Card>

    </Collapse>
 

{demo.state.matches('init') && <Flex sx={{ m: 1, width: 400}}>
  <Spacer/>
 View the 
  <Btn disabled={!demo.state.matches('init')} onClick={() => demo.send('LOGIN')}> Automated demo</Btn>
</Flex>}
    </Box>
}


 
const AuthForm = ({ handler, demo }) => { 
 return (
   <Layout data-testid="test-for-AuthForm">


    {handler.state.matches('start.error') && <InvalidUser {...handler} />}
    {handler.state.matches('signing_in') && <SignInForm demo={demo} {...handler} />}
    {handler.state.matches('signing_up') && <SignUpForm {...handler} />}
    {handler.state.matches('send_signin.error') && <SignInError {...handler} />}
    {/* {JSON.stringify(handler.state.value)} */}

     {/*
     <pre>
     {JSON.stringify(handler.user, 0, 2)}  
     </pre> */}
   </Layout>
 );
}
AuthForm.defaultProps = {};
export default AuthForm;
