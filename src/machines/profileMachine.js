
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { commitUser, getUser } from '../connector';

// add machine code
const profileMachine = createMachine({
  id: "profile",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: {
          target: "opened",
          actions: ["assignUser", assign({ open: true })],
        },
      },
    },
    opened: {
      description: "show user form for editing profile",
      initial: "load",
      states: {
        load: {
          invoke: {
            src: "loadUser",
            onDone: [
              {
                target: "ready",
                actions: "curateUser",
              },
            ],
          },
        },
        ready: {
          on: {
            SAVE: {
              target: "#profile.saving",
            },
            CHANGE: {
              actions: "applyChanges",
            },
            JSON: {
              target: "#profile.json",
            },
          },
        },
      },
      on: {
        CLOSE: {
          target: "idle",
          actions: assign({ open: false }),
        },
      },
    },
    json: {
      on: {
        EXIT: 'opened'
      }
    },

    saving: {
      initial: "save",
      states: {
        save: {
          invoke: {
            src: "saveUser",
            onDone: [
              {
                target: "emit",
              },
            ],
          },
        },
        emit: {
          invoke: {
            src: "emitSave",
            onDone: [
              {
                target: "#profile.idle",
                actions: assign({ open: false }),
              },
            ],
          },
        },
      },
    }, 
  },
  context: { open: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    curateUser: assign((context, event) => ({ user: {
      ...context.user,
      ...event.data
    }})),
    assignUser: assign((_, event) => ({ user: event.user})),
    applyChanges: assign((context, event) => ({
     user: {
      ...context.user,
      [event.key]: event.value
     }
    })),
  }
});

export const useProfile = (onChanged) => {
  const [state, send] = useMachine(profileMachine, {
    services: {
      emitSave: async(context) => onChanged && onChanged(context.user),
      loadUser: async(context) => await getUser(context.user.ID),
      saveUser: async(context) => {
        
        const {
          ID ,
          Salutation ,
          FirstName ,
          LastName ,
          Title  ,
          Phone  ,
          image 
        } = context.user;

        await commitUser({
          ID ,
          Salutation ,
          FirstName ,
          LastName ,
          Title  ,
          Phone  ,
          image 
        })}
     },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
