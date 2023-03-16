
import { Auth } from 'aws-amplify';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getUsers } from '../connector';

// add machine code
const amplifyMachine = createMachine({
  id: "auth",
  initial: "start",
  states: {
     
    start: {
      initial: "load_users",
      states: {
        load_users: {
          invoke: {
            src: "loadUserList",
            onDone: [
              {
                target: "authenticate",
                actions: "assignUserList",
              },
            ],
          },
        },
        authenticate: {
          invoke: {
            src: "authenticateUser",
            onDone: [
              {
                target: "validate",
                actions: "assignAuth",
              },
            ],
            onError: [
              {
                target: "#auth.signing_in",
              },
            ],
          },
        },
        validate: {
          entry: "assignValid",
          always: [
            {
              target: "#auth.signed_in",
              cond: "validUser",
            },
            {
              target: "error",
              cond: "containsUser",
            },
            {
              target: "#auth.signing_in",
            },
          ],
        },
        error: {
          on: {
            SIGNIN: {
              target: "logout",
            },
          },
        },
        logout: {
          invoke: {
            src: "signOut",
            onDone: [
              {
                target: "#auth.signing_in",
              },
            ],
          },
        },
      },
    },

    signed_in: {
      description: "Successful login adds the authenticated user to scope",
      on: {
        SIGNOUT: {
          target: "signing_out",
        },
        UPDATE: {
          actions: "updateUser",
        },
      },
    },

    auth_error: {},

    signing_in: {
      initial: "form_entry",
      states: {
        form_entry: {
          description:
            "Shows the login form with option to sign up or reset password",
          on: {
            SIGNUP: {
              target: "#auth.signing_up",
            },
            FORGOT: {
              target: "name_entry",
            },
          },
        },
        name_entry: {
          description: "Provide user name for password reset process",
          on: {
            SUBMIT: {
              target: "send_forgot",
            },
            CANCEL: {
              target: "form_entry",
            },
          },
        },
        send_forgot: {
          invoke: {
            src: "forgotRequest",
            onDone: [
              {
                target: "validate",
              },
            ],
            onError: [
              {
                target: "forgot_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        validate: {
          description: "User enters validation code received in email",
          on: {
            UPDATE: {
              target: "change_pass",
            },
            CANCEL: {
              target: "name_entry",
            },
          },
        },
        change_pass: {
          invoke: {
            src: "updateRequest",
            onDone: [
              {
                target: "form_entry",
              },
            ],
            onError: [
              {
                target: "change_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        change_error: {
          on: {
            RETRY: {
              target: "validate",
            },
          },
        },
        forgot_error: {
          on: {
            RETRY: {
              target: "name_entry",
            },
          },
        },
      },
      on: {
        SIGNIN: {
          target: "send_signin",
        },
      },
    },

    signing_up: {
      initial: "config",
      states: {
        config: {
          on: {
            SEND: {
              target: "send_signup",
            },
          },
        },
        send_signup: {
          invoke: {
            src: "signUp",
            onDone: [
              {
                target: "confirming",
              },
            ],
            onError: [
              {
                target: "error",
                actions: "assignProblem",
              },
            ],
          },
        },
        confirming: {
          on: {
            CONFIRM: {
              target: "send_confirm",
            },
          },
        },
        send_confirm: {
          invoke: {
            src: "confirmSignUp",
            onDone: [
              {
                target: "#auth.signing_in",
              },
            ],
            onError: [
              {
                target: "error",
                actions: "assignProblem",
              },
            ],
          },
        },
        error: {
          on: {
            RETRY: {
              target: "config",
              actions: "clearProblems",
            },
            CANCEL: {
              target: "#auth.signing_in",
              actions: "clearProblems",
            },
          },
        },
      },
      on: {
        CANCEL: {
          target: "#auth.signing_in",
        },
      },
    },
    send_signin: {
      initial: "login",
      states: {
        login: {
          invoke: {
            src: "signIn",
            onDone: [
              {
                target: "#auth.start.validate",
                actions: "assignAuth",
              },
            ],
            onError: [
              {
                target: "error",
                actions: "assignProblem",
              },
            ],
          },
        },
        error: {
          on: {
            RETRY: {
              target: "#auth.signing_in",
              actions: "clearProblems",
            },
          },
        },
      },
    },
    signing_out: {
      invoke: {
        src: "signOut",
        onDone: [
          {
            target: "signing_in",
            actions: "clearAuth",
          },
        ],
      },
    },
  },
  on: {
    CHANGE: {
      actions: "applyChanges",
    },
  },
  context: {
    username: "",
    password: "",
    verificationCode: "",
    remember: false,
    user: {},
    email: "",
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    containsUser: (context) => !!context.user,
    validUser: (context) => !!context.valid,
    successAuth: (_, event) => !!event.data.username
  },
  actions: { 
    updateUser: assign((context, event) => ({
      user: {
        ...context.user,
        ...event.user 
      }
    })),
    assignValid: assign((context) => {
      const { user, userList } = context;
      if (user) {
        const matched = userList.find(f => f.UserID === user.username);
        if (matched) {
          return {
            valid: true,
            user: {
              ...user,
              ...matched
            }
          }
        }
      }

      return {
        valid: false
      }

    }),
    assignUserList: assign((_, event) => ({
      userList: event.data
    })),
    applyChanges: assign((_, event) => ({
      [event.key]: event.value
    })),
    assignAuth: assign((_, event) => ({
      user: event.data,
      admin: event.data.groups?.indexOf('Admins') > -1
    })),
    clearAuth: assign((_, event) => ({
      user: null
    })),
    assignProblem: assign((_, event) => ({
      error: event.data.message,
      stack: event.data.stack
    })),
    clearProblems: assign((context, event) => {
      return {
        error: null,
        stack: null,
      };
    })
  }
});

export const useAmplify = () => {
  const [state, send] = useMachine(amplifyMachine, {
    services: { 
      loadUserList: async() => await getUsers(),
      authenticateUser: async() => {  
        const e = await Auth.currentAuthenticatedUser();

        const groups = e.signInUserSession.accessToken.payload['cognito:groups'];
        console.log('User groups:', groups);

        console.log ( { e })
        return {
          username: e?.username,
          attributes: e?.attributes,
          groups
        }; 
      },
      signOut: async(context) => { 
        return await Auth.signOut(); 
      },
      forgotRequest: async(context) => {
        const { username } = context;
        return await Auth.forgotPassword(username)
      },
      updateRequest: async(context) => {
        const { username, verificationCode, password } = context;
        return await Auth.forgotPasswordSubmit(username, verificationCode, password); 
      },
      signIn: async(context) => {
        const { username, password } = context;
        const e = await Auth.signIn(username, password); 
        const groups = e.signInUserSession.accessToken.payload['cognito:groups'];
        return {
          username: e?.username,
          attributes: e?.attributes,
          groups
        }; 
      },
      confirmSignUp: async(context) => {
        const { username, verificationCode } = context;
        return await Auth.confirmSignUp(username, verificationCode); 
      },
      signUp: async(context) => {
        const { username, password, email} = context;
        return await Auth.signUp({
          username,
          password,
          attributes: {
            email,
          }});
      }
    },
  }); 

  const is = (val) => Array.isArray(val)
    ? val.some(state.matches)
    : state.matches(val);

  const diagnosticProps = {
    id: amplifyMachine.id,
    states: amplifyMachine.states,
    state,
    send,
  };

  return {
    diagnosticProps,
    state,
    send, 
    is,
    ...state.context
  };
}
