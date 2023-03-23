
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
          actions: ["assignUser", assign({ open: true, dirty: false })],
        },
      },
    },
    
    confirm: {
      description:
        "User has to confirm closing when there are unsaved changes.",
      on: {
        OK: {
          target: "idle",
          actions: assign({ open: false }),
        },
        CANCEL: {
          target: "#profile.opened.ready",
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
            JSON: {
              target: "#profile.json",
            },
          },
        },
      },
      on: {
        CLOSE: [
          {
            target: "idle",
            cond: "isClean",
            actions: assign({ open: false }),
          },
          {
            target: "confirm",
          },
        ],
        CHANGE: {
          actions: "applyChanges",
        },
        RESET: {
          target: ".load",
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
  context: { open: false, dirty: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    isClean: context => !context.dirty 
  },
  actions: {
    curateUser: assign((context, event) => ({ 
      dirty: false,
      user: {
      ...context.user,
      ...event.data
    }})),
    assignUser: assign((_, event) => ({ user: event.user})),
    applyChanges: assign((context, event) => ({
    dirty: 1,
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
