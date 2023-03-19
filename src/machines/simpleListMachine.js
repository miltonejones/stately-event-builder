
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { 
  getReports, setReport,
  getAmenities, 
  getCategories, setCategory, 
  getCalendars ,
  getUsers, commitUser
} from '../connector';


const LISTYPE = {
  CATEGORY: 0,
  REPORT: 1,
  CALENDAR: 2,
  AMENITY: 3,
  USER: 4
};


const connectors = {
  [LISTYPE.CATEGORY]: {
    get: getCategories,
    put: setCategory
  },
  [LISTYPE.REPORT]: {
    get: getReports,
    put: setReport
  },
  [LISTYPE.CALENDAR]: {
    get: getCalendars
  },
  [LISTYPE.AMENITY]: {
    get: getAmenities
  },
  [LISTYPE.USER]: {
    get: getUsers,
    put: commitUser
  },
};

// add machine code
const simpleListMachine = createMachine({
  id: "simple_list",
  initial: "inert",
  states: {
    idle: {
      description: "Item tab is open with list in idle mode",
      on: {
        EDIT: {
          target: "editing",
          actions: "assignItem",
        },
      },
    },
    editing: {
      description: "Show edit form when item is selected",
      on: {
        EXIT: {
          target: "confirm_close",
        },
        EDIT: {
          actions: "assignItem",
        },
        CHANGE: {
          actions: [assign((context, event) => ({ 
            dirty: true 
          })), "applyChanges"],
        },
      },
    },
    saving: {
      entry: assign({ busy: true }),
      invoke: {
        src: "commitItem",
        onDone: [
          {
            target: "loading",
            actions: "clearID",
          },
        ],
      },
    },

    deleting: {
      description: "Delete selected item and reload list",
      entry: assign({ busy: true }),
      initial: "confirm",
      states: {
        confirm: {
          on: {
            YES: {
              target: "drop",
            },
            NO: {
              target: "#simple_list.idle",
              actions: "clearID",
            },
          },
        },
        drop: {
          invoke: {
            src: "dropItem",
            onDone: [
              {
                target: "#simple_list.loading",
                actions: "clearID",
              },
            ],
          },
        },
      },
    },
    loading: {
      description:
        "load initial dataset of Items from server before displaying list",
      entry: assign({ busy: true }),
      invoke: {
        src: "loadItems",
        onDone: [
          {
            target: "idle",
            actions: ["assignItems", assign({ busy: false })],
          },
        ],
      },
    },
    confirm_close: {
      description:
        "when leaving editing state the user must confirm exit if there are unsaved changes",
      always: {
        target: "idle",
        cond: "isClean",
        actions: "clearID",
      },
      on: {
        OK: {
          target: "idle",
          actions: "clearID",
        },
        CANCEL: {
          target: "editing",
        },
      },
    },
    inert: {
      description: "Machine sits in inert state until called by external actor", 
    },
  },
  on: {
    DROP: {
      target: ".deleting",
      actions: "assignID",
    },
    CREATE: {
      target: ".editing",
      actions: "clearID",
    },
    UPDATE: {
      target: ".saving",
    },
    LOAD: {
      target: ".loading",
      actions: "assignChoice",
    },
    CLOSE: {
      target: ".inert",
      actions: "clearItems",
    },
  },
  context: { items: [], dirty: false, busy: false, choice: -1, ID: null, item: null },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    isClean: context => !context.dirty
  },
  actions: { 
    clearItems: assign((context, event) => ({
      items: [], 
      choice: -1
    })),
    clearID: assign((context, event) => ({
      ID: null, 
      dirty: false,
      busy: false,
      title: null
    })),
    assignChoice: assign((_, event) => ({
      choice: event.choice
    })),
    assignItems: assign((_, event) => ({
      items: event.data,
      title: null
    })),
    assignItem: assign((context, event) => ({
      ID: event.ID,
      item: context.items.find(f => f.ID === event.ID),
      title: event.title
    })),
    applyChanges: assign((context, event) => ({
      item: {
        ...context.item,
        [event.key]: event.value
      }
    })),
    assignID: assign((_, event) => ({
      ID: event.ID 
    })),
  }
});

export const useSimpleList = () => {
  const [state, send] = useMachine(simpleListMachine, {
    services: {
      commitItem: async(context) => {
        const { put } = connectors[context.choice];
        return await put(context.item)
      },
      dropItem: async(context) => {
        const { drop } = connectors[context.choice];
        return await drop(context.ID)
      },
      loadItems: async(context) => { 
        const { get } = connectors[context.choice]; 
        return await get()
      },
     },
  }); 

  const is = (val) => Array.isArray(val)
    ? val.some(state.matches)
    : state.matches(val);

  return {
    state,
    send, 
    is,
    ...state.context
  };
}
