
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { 
  getReports, setReport,
  getAmenities, setAmenity, getPropertyTypes,
  getCategories, setCategory, dropCategory,
  getCalendars ,
  getUsers, commitUser, getCognitoGroups,
  getRooms, setRoom
} from '../connector';


export const APPTYPE = {
  CATEGORY: 0,
  REPORT: 1,
  CALENDAR: 2,
  AMENITY: 3,
  USER: 4,
  ROOM: 5
};


const connectors = {
  [APPTYPE.CATEGORY]: {
    get: getCategories,
    put: setCategory,
    drop: dropCategory
  },
  [APPTYPE.REPORT]: {
    get: getReports,
    put: setReport
  },
  [APPTYPE.CALENDAR]: {
    get: getCalendars 
  },
  [APPTYPE.AMENITY]: {
    pre: getPropertyTypes,
    get: getAmenities,
    put: setAmenity
  },
  [APPTYPE.USER]: {
    pre: getCognitoGroups,
    get: getUsers,
    put: commitUser
  },
  [APPTYPE.ROOM]: {
    get: getRooms,
    put: setRoom
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
      invoke: {
        src: "dropItem",
        onDone: [
          {
            target: "loading",
          },
        ],
      },
    },

    loading: {
      description:
        'load initial dataset of Items from server before displaying list',
      entry: assign({ busy: true }),
      initial: 'main',
      states: {
        main: {
          invoke: {
            src: 'loadItems',
            onDone: [
              {
                target: 'before',
                cond: 'beforeLoad',
                actions: 'assignItems',
              },
              {
                target: 'complete',
                actions: ['assignItems', assign({ busy: false })],
              },
            ],
          },
        },
        before: {
          invoke: {
            src: 'preLoad',
            onDone: [
              {
                target: 'complete',
                actions: ['assignSubitems', assign({ busy: false })],
              },
            ],
          },
        },
        complete: {
          description: 'Route to next state based on caller arguments',
          always: [
            {
              target: '#simple_list.idle',
              cond: 'emptyID',
              description:
                'If no ID is passed with LOAD event, go straight to idle mode',
            },
            {
              target: '#simple_list.editing.work',
              // actions: 'assignItem',
            },
          ],
        },
      },
    },

    editing: {
      description: "Show edit form when item is selected",
      initial: "edit",
      states: {
        edit: {
          description: "in write mode items can be edited",
          on: {
            EXIT: {
              target: "#simple_list.confirm_close",
            },
            READ: {
              target: "work",
            },
          },
        },
        work: {
          description: "In work mode items can be read and browsed",
          on: {
            WRITE: {
              target: "edit",
            },
            EXIT: {
              target: "#simple_list.inert.idle",
              actions: "clearID",
            },
          },
        },
      },
      on: {
        CHANGE: {
          actions: "applyChanges",
        },
        EDIT: {
          actions: "assignItem",
        },
        UNDO: {
          actions: "resetItem",
        },
      },
    },
    // editing: {
    //   description: 'Show edit form when item is selected',
    //   initial: 'edit',
    //   states: {
    //     edit: {
    //       description: 'in write mode items can be edited',
    //       on: {
    //         READ: {
    //           target: 'work',
    //         },
    //       },
    //     },
    //     work: {
    //       description: 'In work mode items can be read and browsed',
    //       on: {
    //         WRITE: {
    //           target: 'edit',
    //         },
    //       },
    //     },
    //   },
    //   on: {
    //     EXIT: {
    //       target: 'confirm_close',
    //     },
    //     CHANGE: {
    //       actions: ['applyChanges', assign({ dirty: true })],
    //     },
    //     EDIT: {
    //       actions: 'assignItem',
    //     },
    //     UNDO: {
    //       actions: 'resetItem',
    //     },
    //   },
    // },

    // editing: {
    //   description: "Show edit form when item is selected",
    //   on: {
    //     EXIT: {
    //       target: "confirm_close",
    //     },
    //     EDIT: {
    //       actions: "assignItem",
    //     },
    //     "UNDO": {
    //       "actions": "resetItem"
    //     },
    //     CHANGE: {
    //       actions: [assign((context, event) => ({ 
    //         dirty: true 
    //       })), "applyChanges"],
    //     },
    //   },
    // },
    // loading: {
    //   description:
    //     "load initial dataset of Items from server before displaying list",
    //   entry: assign({ busy: true }),
    //   initial: "main",
    //   states: {
    //     main: {
    //       invoke: {
    //         src: "loadItems",
    //         onDone: [
    //           {
    //             target: "before",
    //             cond: "beforeLoad",
    //             actions: "assignItems",
    //           },
    //           {
    //             target: "#simple_list.idle",
    //             actions: ["assignItems", assign({ busy: false })],
    //           },
    //         ],
    //       },
    //     },
    //     before: {
    //       invoke: {
    //         src: "preLoad",
    //         onDone: [
    //           {
    //             target: "#simple_list.idle",
    //             actions: ["assignSubitems", assign({ busy: false })],
    //           },
    //         ],
    //       },
    //     },
    //   },
    // },

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
      initial: "checkauto",
      states: {
        checkauto: {
          invoke: {
            src: "checkAuto",
            onDone: [
              {
                target: "idle",
                cond: "emptyChoice",
                actions: "applyChoice",
              },
              {
                target: "#simple_list.loading",
              },
            ],
          },
        },
        idle: {},
      },
    },
  },
  on: {
    DROP: {
      target: ".deleting",
      actions: "assignID",
    },
    CREATE: {
      target: ".editing",
      actions: "assignNew",
    },
    UPDATE: {
      target: ".saving",
    },
    LOAD: {
      target: ".loading",
      actions: "assignChoice",
    },
    CLOSE: {
      target: ".inert.idle",
      actions: "clearItems",
    },
    PROP: {
      actions: "applyProps",
    },
  },
  context: { items: [], dirty: false, busy: false, choice: -1, ID: null, item: null },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    isClean: context => !context.dirty,
    emptyID: context => !context.ID,
    emptyChoice: (_, event) => !event.data,
    beforeLoad: context => Boolean(connectors[context.choice].pre)
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
    applyChoice: assign((_, event) => ({
      choice: event.data
    })),
    assignChoice: assign((_, event) => ({
      choice: event.choice,
      ID: event.ID
    })),
    assignSubitems: assign((_, event) => ({
      subitems: event.data, 
    })),
    assignItems: assign((_, event) => ({
      items: event.data,
      title: null
    })),
    resetItem: assign((context) => ({ 
      item: context.items.find(f => f.ID === context.ID), 
      dirty: false
    })),
    assignItem: assign((context, event) => ({
      ID: event.ID,
      item: context.items.find(f => f.ID === event.ID),
      title: event.title,
      dirty: false
    })),
    assignNew: assign((context, event) => ({
      ID: null, 
      dirty: false,
      busy: false,
      item: {
        ...event.item
      },
      title: "New item" || event.title
    })),
    applyProps: assign((context, event) => ({
      [event.key]: event.value
    })),
    applyChanges: assign((context, event) => ({
      dirty: true,
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

export const useSimpleList = (appType) => {
  const [state, send] = useMachine(simpleListMachine, {
    services: {
      checkAuto: () => appType,
      commitItem: async(context) => {
        const { put } = connectors[context.choice];
        return await put(context.item)
      },
      preLoad: async(context) => {
        const { pre } = connectors[context.choice]; 
        return await pre()
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
 

  const handleEdit = (ID, title) => {
    send({
      type: 'EDIT',
      ID ,
      title 
    })
  }

  const handleDrop = (ID) => {
    send({
      type: 'DROP',
      ID 
    })
  }
    
  const handleChange = (event, value) => {
    send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }

  return {
    state,
    send, 
    is,
    handleDrop,
    handleChange,
    handleEdit,
    ...state.context
  };
}
