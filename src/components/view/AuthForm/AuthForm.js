import React from 'react';
import {
  styled,
  Collapse,
  Box,
  MenuItem,
  Switch,
  Alert,
  Card,
  Typography,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Nowrap,
  Columns,
  Flex,
  TextIcon,
  Spacer,
  Banner,
  IconTextField,
  Btn,
} from '../../../styled';
// import { objectPath } from '../../../util/objectPath';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const InvalidUser = ({ send, user }) => {
  return (
    <Stack spacing={1}>
      <Alert severity="error">
        <Nowrap hover onClick={() => send('SIGNIN')}>
          User <b>{user.username}</b> does not have access to this content.
          Please log in as a different user.
        </Nowrap>
      </Alert>
      <Flex>
        <Spacer />
        <Btn variant="contained" onClick={() => send('SIGNIN')}>
          Sign in
        </Btn>
      </Flex>
    </Stack>
  );
};

const SignInError = ({ send, error, stack }) => {
  return (
    <Stack sx={{ maxWidth: 500 }} spacing={1}>
      <Typography variant="h6">There was an error with your signin</Typography>
      <Typography variant="body2">{error}</Typography>
      <Typography variant="caption">{stack}</Typography>
      <Flex>
        <Spacer />
        <Btn variant="contained" onClick={() => send('RETRY')}>
          try again
        </Btn>
      </Flex>
    </Stack>
  );
};

// const SignUpForm = ({
//   send,
//   state,
//   email,
//   verificationCode,
//   username,
//   password,
// }) => {
//   const handleChange = (event) => {
//     send({
//       type: 'CHANGE',s
//       key: event.target.name,
//       value: event.target.value,
//     });
//   };

//   return (
//     <Card sx={{ width: 400, height: 400 }}>
//       <Banner>Create New Account</Banner>
//       <Stack sx={{ p: 1 }} spacing={1}>
//         <Collapse
//           sx={{ width: '100%' }}
//           in={state.matches('signing_up.config')}
//         >
//           <Stack sx={{ p: 1 }} spacing={1}>
//             <Typography>Username</Typography>
//             <IconTextField
//               fullWidth
//               startIcon={<TextIcon icon="Person" />}
//               size="small"
//               name="username"
//               value={username}
//               onChange={handleChange}
//             />

//             <Typography>Email Address</Typography>
//             <IconTextField
//               fullWidth
//               startIcon={<TextIcon icon="Email" />}
//               size="small"
//               name="email"
//               value={email}
//               onChange={handleChange}
//             />

//             <Typography>Password</Typography>
//             <IconTextField
//               fullWidth
//               startIcon={<TextIcon icon="Lock" />}
//               size="small"
//               type="password"
//               name="password"
//               value={password}
//               onChange={handleChange}
//             />
//             <Flex spacing={1}>
//               <Spacer />
//               <Btn onClick={() => send('CANCEL')}>
//                 Cancel
//               </Btn>
//               <Btn variant="contained" onClick={() => send('SEND')}>
//                 Create account
//               </Btn>
//             </Flex>
//           </Stack>
//         </Collapse>

//         <Collapse
//           sx={{ width: '100%' }}
//           in={state.matches('signing_up.confirming')}
//         >
//           <Typography>Verification Code</Typography>
//           <IconTextField
//             fullWidth
//             startIcon={<TextIcon icon="Code" />}
//             size="small"
//             name="verificationCode"
//             value={verificationCode}
//             onChange={handleChange}
//           />

//           <Flex  spacing={1}>
//             <Spacer />
//             <Btn variant="contained" onClick={() => send('CONFIRM')}>
//               Confirm
//             </Btn>
//           </Flex>
//         </Collapse>
//       </Stack>
//     </Card>
//   );
// };

const SignInForm = ({
  demo,
  send,
  state,
  verificationCode,
  username,
  email,
  password,
  is
}) => {
  const handleChange = (event) => {
    send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value,
    });
  };
  return (
    <Box>
      <Collapse in={demo.is('translate')}>
        <Stack sx={{ width: 500 }} spacing={2}>
          <Alert>{demo.message}</Alert>
          <LinearProgress variant="determinate" value={demo.progress} />
          <Nowrap muted small>
            <em>{demo.translation}</em>
          </Nowrap>

          <Flex sx={{ width: '100%' }} spacing={2}>
            <Spacer />
            <Btn onClick={() => demo.send('CANCEL')}>cancel</Btn>
          </Flex>
        </Stack>
      </Collapse>

      <Collapse in={demo.is('logging_in')}>
        <Stack sx={{ width: 500 }} spacing={2}>
          {!demo.is('logging_in.choose_lang') && (
            <Alert severity="info">{demo.message}</Alert>
          )}
          {!!demo.is('logging_in.choose_lang') && (
            <Stack spacing={1}>
              <Nowrap variant="body2">
                Choose the language for your demo presenter
              </Nowrap>
              <IconTextField
                label="Choose language"
                fullWidth
                size="small"
                select
                onChange={(e) =>
                  demo.send({
                    type: 'DECODE',
                    code: e.target.value,
                  })
                }
              >
                {Object.keys(demo.languages).map((lang) => (
                  <MenuItem key={lang} value={demo.languages[lang]}>
                    {lang}
                  </MenuItem>
                ))}
              </IconTextField>
            </Stack>
          )}

          <Flex sx={{ width: '100%' }} spacing={2}>
            <Btn
              variant="contained"
              color="warning"
              disabled={demo.is('logging_in.choose_lang')}
              onClick={() => demo.send('LANG')}
            >
              change language
            </Btn>
            <Spacer />
            <Btn onClick={() => demo.send('CANCEL')}>cancel</Btn>
            <Btn
              disabled={!demo.is('logging_in.ready')}
              variant="contained"
              onClick={() => demo.send('BEGIN')}
            >
              {' '}
              next
            </Btn>
          </Flex>
        </Stack>
      </Collapse>

      <Collapse in={demo.is('init')}>
        <Card sx={{ width: 400, minHeight: 400 }}>

          {/* form header with title and forgot link  */}
          <Banner>
            {is('signing_up') ? "Create account" : "Please sign in"}
            <Spacer />
            {is('signing_in.form_entry')  && <Nowrap onClick={() => send('FORGOT')} hover variant="caption">
              Forgot password?
            </Nowrap>}
          </Banner>


          <Stack sx={{ p: 2 }} spacing={1}>
            <Collapse
              sx={{ width: '100%' }}
              in={!state.matches('signing_in.validate') && !is('signing_up.confirming')}
            >
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

            <Collapse
              sx={{ width: '100%' }}
              in={is(['signing_in.validate', 'signing_up.confirming'])}
            >
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

            <Collapse
              sx={{ width: '100%' }}
              in={is(['signing_in.form_entry', 'signing_in.validate', 'signing_up.config'])}
            >
          
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

              {is('signing_up.config') && (<>
              
                <Typography sx={{mt: 1}}>Email Address</Typography>
                <IconTextField
                  fullWidth
                  startIcon={<TextIcon icon="Email" />}
                  size="small"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />

              </>)}
            </Collapse>


            {/* logging in form body  */}
            <Collapse
              sx={{ width: '100%' }}
              in={is(['signing_in.form_entry'])}
            >
              <Flex spacing={1}>
                <Switch />
                <Typography>Remember me</Typography>
              </Flex>

              <Columns columns="100px 1fr" spacing={2}>
                <Btn variant="contained" onClick={() => send('SIGNIN')}>
                  Login
                </Btn>
                <Typography variant="caption">
                  This is a <b>secure area</b>. Please log in to use
                  EventBuilder 8.
                </Typography>
              </Columns>
            </Collapse>

              
            {/* password reset SUBMIT form body  */}
            <Collapse
              sx={{ width: '100%' }}
              in={state.matches('signing_in.name_entry')}
            >
              <Stack>
                <Flex spacing={2}>
                  <Spacer />
                  <Btn onClick={() => send('CANCEL')}>Cancel</Btn>
                  <Btn variant="contained" onClick={() => send('SUBMIT')}>
                    Request reset
                  </Btn>
                </Flex>
                <hr sx={{ width: '100%' }} />
                <Typography variant="caption">
                  You will be sent a verification code to the email address we
                  have on file.
                </Typography>
              </Stack>
            </Collapse>

            {/* password reset CONFIRM form body  */}
            <Collapse
              sx={{ width: '100%' }}
              in={['signing_in.validate'].some(state.matches)}
            >
              <Columns columns="160px 1fr" spacing={2}>
                <Btn variant="contained" onClick={() => send('UPDATE')}>
                  reset password
                </Btn>
                <Typography variant="caption">
                  This will reset your password.
                </Typography>
              </Columns>
            </Collapse>


            {/* new account CONFIRM form body  */}
            <Collapse
              sx={{ width: '100%' }}
              in={['signing_up.confirming'].some(state.matches)}
            >
                <Flex  sx={{mb: 1}} spacing={2}>
                <Btn variant="contained" onClick={() => send('CONFIRM')}>
                  Verify
                </Btn>
                  <Btn onClick={() => send('CANCEL')}>
                    Cancel
                  </Btn>
              </Flex>
                <Typography variant="caption">
                  Enter the verification code you received in your email 
                  at <b>{email}</b>. This will verify your new account.
                </Typography>
            </Collapse>

            <Collapse
              sx={{ width: '100%' }}
              in={is(['signing_up.config'])}
            >
              <Flex  sx={{mb: 1}} spacing={2}>
                <Btn variant="contained" 
                  disabled={!(email && password && username)}
                onClick={() => send('SEND')}>
                  sign up
                </Btn>
                  <Btn onClick={() => send('CANCEL')}>
                    Cancel
                  </Btn>
              </Flex>
                <Typography variant="caption">
                  You will be sent a verification code to the email address you enter here.
                </Typography>
            </Collapse>

            <Flex>
              <Spacer />
              <img src="/poweredby.gif" alt="logo" />
            </Flex>

            {is('signing_in.form_entry') && <Flex spacing={1}>
              <Spacer />
              <Typography variant="caption">New to EventBuilder?</Typography>
              <Btn
                variant="contained"
                color="warning"
                onClick={() => send('SIGNUP')}
              >
                Create a new account
              </Btn>
            </Flex>}
          </Stack>
        </Card>
      </Collapse>

      

      {demo.is('init') && is (['signing_in', 'signing_up']) && (
        <Flex sx={{ m: 1, mb: 5, width: 400 }} spacing={1}>
          <img src="/amplify.png" alt="aws" height="24" />
          <Nowrap small>Security powered by <a href="https://aws.amazon.com/de/amplify/"
            target="_blank" rel="noreferrer" >AWS Amplify</a></Nowrap>
        </Flex>
      )}

      {demo.is('init') && is ('signing_in.form_entry') && (
        <Flex sx={{ m: 1, width: 400 }} spacing={1}>
          <Spacer />
          <Nowrap variant="body2" muted>
          View the
          </Nowrap>
          <Btn
            variant="contained"
            disabled={!demo.is('init')}
            onClick={() => demo.send('LOGIN')}
          >
            {' '}
            Automated demo
          </Btn>
        </Flex>
      )}
    </Box>
  );
};

const AuthForm = ({ handler, demo }) => {
  return (
   <>
   {/* <Nowrap small muted>{objectPath(handler.state.value)}/{objectPath(demo.state.value)}</Nowrap>  */}
    <Layout data-testid="test-for-AuthForm">
      {handler.is('start.error') && <InvalidUser {...handler} />}
      {handler.is(['signing_in', 'signing_up']) && (
        <SignInForm demo={demo} {...handler} />
      )}
      {/* {handler.is('signing_up') && <SignInForm {...handler} />} */}
      {handler.is('send_signin.error') && (
        <SignInError {...handler} />
      )}
    </Layout>
   </>
  );
};
AuthForm.defaultProps = {};
export default AuthForm;
