
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { saveEvent, getRooms, getUsers, getEvent } from '../connector';

// add machine code
const eventPopMachine = createMachine({
  id: "menu_controller",
  initial: "closed",
  states: {

    closed: {
      initial: "prepare",
      states: {
        prepare: {
          invoke: {
            src: "loadRooms",
            onDone: [
              {
                target: "users",
                actions: "assignRooms",
              },
            ],
          },
        },
        ready: {
          on: {
            open: {
              target: "#menu_controller.opening",
              actions: "assignOpen",
            },
          },
        },
        users: {
          invoke: {
            src: "loadUsers",
            onDone: [
              {
                target: "ready",
                actions: "assignUsers",
              },
            ],
          },
        },
      },
    },

    closing: {
      entry: assign({ editing: false }),
      invoke: {
        src: "menuClicked",
        onDone: [
          {
            target: "#menu_controller.closed.ready",
          },
        ],
      },
    },
 
    opened: {
      entry: assign({ busy: false }),
      initial: "idle",
      states: {
        idle: {
          description: "Show event in display mode",
          on: {
            edit: {
              target: "editing",
            },
          },
        },
        editing: {
          description: "Open event edit form",
          on: {
            save: {
              target: "#menu_controller.saving",
            },
            change: {
              actions: "applyChanges",
            },
            cancel: {
              target: "idle",
            },
          },
        },
      },
      on: {
        prop: {
          actions: "assignProp",
        },
        close: {
          target: "closing",
          actions: "assignClose",
        },
      },
    },

    
    opening: {
      invoke: {
        src: "loadEvent",
        onDone: [
          {
            target: "opened",
            actions: "assignEvent",
          },
        ],
      },
    },
    saving: {
      entry: assign({ busy: true }),
      invoke: {
        src: "commitEvent",
        onDone: [
          {
            target: "opening",
          },
        ],
      },
    },
  },
  context: { busy: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  actions: {
    assignClose: assign((_, event) => ({
      anchorEl: null,
      value: event.value,
      data: null,
      editing: false 
    })),
    assignOpen: assign((_, event) => ({
      anchorEl: event.anchorEl,
      ID: event.ID,
      date: event.date,
      busy: true
    })),
    assignUsers: assign((_, event) => ({
      users: event.data
    })),
    assignRooms: assign((_, event) => ({
      rooms: event.data
    })),
    assignEvent: assign((context, event) => ({
      data: {
        ...event.data,
        CustomDate: context.date
      }
    })),
    
    applyChanges: assign((context, event) => ({
      data: {
        ...context.data,
        [event.key]: event.value
      }
    })),
    assignProp: assign((_, event) => ({
      [event.key]: event.value
    })),
  }
});

export const useEventPop = (onChange) => {
  const [state, send] = useMachine(eventPopMachine, {
    services: {

      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      }, 
      loadUsers: async(context) => await getUsers(context),
      loadRooms: async(context) => await getRooms(context),
      loadEvent: async(context) => await getEvent(context.ID),
      commitEvent: async(context) => await saveEvent(context.data)
     },
  }); 

  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });
  const handleClick = (event, ID, date) => {  
    send({
      type: "open",
      anchorEl: event.currentTarget,
      ID,
      date
    });
  };
 

  return {
    ...state.context,
    state,
    send,
    anchorEl,
    handleClick,
    handleClose, 
  };

}
