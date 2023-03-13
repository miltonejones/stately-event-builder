
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { commitUser } from '../connector';

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
      on: {
        CHANGE: {
          actions: "applyChanges",
        },
        SAVE: {
          target: "saving",
        },
        CLOSE: {
          target: "idle",
          actions: assign({ open: false }),
        },
      },
    },
    saving: {
      invoke: {
        src: "saveUser",
        onDone: [
          {
            target: "idle",
            actions: assign({ open: false }),
          },
        ],
      },
    },
  },
  context: { open: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignUser: assign((_, event) => ({ user: event.user})),
    applyChanges: assign((context, event) => ({
     user: {
      ...context.user,
      [event.key]: event.value
     }
    })),
  }
});

export const useProfile = () => {
  const [state, send] = useMachine(profileMachine, {
    services: {
      commitUser: async(context) => commitUser(context.user)
     },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
