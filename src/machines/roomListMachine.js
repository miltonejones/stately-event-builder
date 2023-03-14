
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getRooms } from '../connector';
import { scrubRoom } from '../util/scrubRoom';

// add machine code
const roomListMachine = createMachine({
  id: "room_list",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: {
          target: "opened",
          actions: assign({ open: true }),
        },
      },
    },
    opened: {
      initial: "init",
      states: {
        init: {
          entry: assign({ busy: true }),
          invoke: {
            src: "loadRoomList",
            onDone: [
              {
                target: "ready",
                actions: "assignRoomList",
              },
            ],
          },
        },
        ready: {
          description: "Show tree view with list of rooms",
          entry: [assign({ busy: false }), assign({ dirty: false })],
          on: {
            EDIT: {
              target: "editing",
              actions: "assignID",
            },
            CREATE: {
              target: "editing",
            },
            CLOSE: {
              target: "#room_list.idle",
              actions: assign({ open: false }),
            },
            CHANGE: {
              actions: "assignProp",
            },
          },
        },
        editing: {
          description: "Show room editing form",
          on: {
            EDIT: { 
              actions: "assignID",
            },
            CHANGE: {
              actions: ["applyChanges", assign({ dirty: true })],
            },
            SAVE: {
              target: "saving",
            },
            CLOSE: {
              target: "ready",
              actions: "clearID",
            },
          },
        },
        saving: {
          invoke: {
            src: "saveRoom",
            onDone: [
              {
                target: "init",
              },
            ],
            onError: [
              {
                target: "save_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        save_error: {
          on: {
            RECOVER: {
              target: "ready",
              actions: "clearProblems",
            },
          },
        },
        deleting: {
          invoke: {
            src: "deleteRoom",
            onDone: [
              {
                target: "init",
                actions: "clearID",
              },
            ],
            onError: [
              {
                target: "delete_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        delete_error: {
          on: {
            RECOVER: {
              target: "init",
              actions: "clearProblems",
            },
          },
        },
      },
      on: {
        DROP: {
          target: ".deleting",
          actions: "assignID",
        },
      },
    },
  },
  context: { open: false, busy: false, dirty: false, roomList: [] },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    assignRoomList: assign((_, event) => ({
      roomList: event.data?.map(scrubRoom)
    })),
    assignProp: assign((_, event) => ({
      [event.key]: event.value
    })),
    applyChanges: assign((context, event) => ({
       room: {
        ...context.room,
        [event.key]: event.value
       }
    })),
    clearID: assign((_, event) => ({
      ID: null,
      room: null
    })),
    assignID: assign((context, event) => ({
      ID: event.ID,
      room: context.roomList.find(f => f.ID === event.ID)
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

export const useRoomList = () => {
  const [state, send] = useMachine(roomListMachine, {
    services: { 
      loadRoomList: async() => await getRooms(),
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
