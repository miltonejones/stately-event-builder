
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
      entry: [assign({ editing: false }), "assignClose"],
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
          description: "Show event in display mode only",
          on: {
            edit: {
              target: "editing",
            },
          },
        },
        editing: {
          description: "Open event form for editing", 
          on: { 
            change: {
              actions: ["applyChanges", assign({ dirty: true })],
            },
            cancel: {
              target: "#menu_controller.opened.cancelling.edit",
            },
            close: {
              target: "#menu_controller.opened.cancelling.close",
            },
          },
        },
        cancelling: {
          initial: "edit",
          states: {
            edit: {
              description: "confirm exit when changes unsaved",
              always: {
                target: "#menu_controller.opened.idle",
                cond: "isClean",
              },
              on: {
                exit: {
                  target: "#menu_controller.opened.editing",
                },
                ok: {
                  target: "#menu_controller.opened.reload",
                  actions: ["assignClean"]
                },
              },
            },
            close: {
              description: "Confirm window close",
              always: {
                target: "#menu_controller.closing",
                cond: "isClean",
              },
              on: {
                ok: {
                  target: "#menu_controller.closing",
                },
                exit: {
                  target: "#menu_controller.opened.editing",
                },
              },
            },
          },
        },
        reload: {
          invoke: {
            src: "loadEvent",
            onDone: [
              {
                target: "idle",
                actions: "assignEvent",
              },
            ],
          },
        },
      },
      on: {
        prop: {
          actions: "assignProp",
        },
        close: {
          target: "closing",
        },
        save: {
          target: "saving",
        },
      },
    },

    opening: {
      invoke: {
        src: "loadEvent",
        onDone: [
          {
            target: "opened",
            cond: "isReadMode",
            actions: "assignEvent",
          },
          {
            target: "#menu_controller.opened.editing",
            actions: "assignEvent",
          },
        ],
      },
    },


    saving: {
      entry: assign({ busy: true }),
      initial: "save",
      states: {
        save: {
          invoke: {
            src: "commitEvent",
            onDone: [
              {
                target: "emit",
              },
            ],
          },
        },
        emit: {
          invoke: {
            src: "menuClicked",
            onDone: [
              {
                target: "#menu_controller.opening",
              },
            ],
          },
        },
      },
    },
  },
  context: { busy: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  guards: {
    isClean: context => !context.dirty,
    isReadMode: context => !context.auto
  },
  actions: {
    assignClean: assign({ dirty: false }),
    assignClose: assign((_, event) => ({
      anchorEl: null,
      value: event.value,
      data: null,
      editing: false ,
      auto: false ,
      dirty: false
    })),
    assignOpen: assign((_, event) => ({
      anchorEl: event.anchorEl,
      ID: event.ID,
      date: event.date,
      auto: event.auto,
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
        !!context.dirty && onChange && onChange(event.value);
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
  const handleClick = (event, ID, date, auto) => {  
    send({
      type: "open",
      anchorEl: event.currentTarget,
      ID,
      date,
      auto
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
