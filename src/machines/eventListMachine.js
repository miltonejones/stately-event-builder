import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { engDate } from '../util/engDate';
import { searchEvents, getEventListCategories, saveEvent, getCognitoGroups, getUsers,
   getRooms, getReports, getCalendars, getEvent, getCategories } from '../connector';
// import { scrubRoom } from '../util/scrubRoom';
import moment from 'moment';
import {  
  useLocation, 
  useParams,
} from "react-router-dom"; 


export const VIEW = {
  LIST_SIDEBAR: 1,
  FORM_SIDEBAR: 2,
  FORM_OPTIONBAR: 4,
  OPTION_CATEGORY: 8,
  OPTION_CALENDAR: 16
}


const PERSIST_PROPS = [
  "active_machine",
  "format",
  "informed",
  "theme" 
]

const lookupItems = {
  roomList: getRooms,
  calendars: getCalendars,
  categories: getCategories,
  groups: getCognitoGroups,
  users: getUsers,
  reports: getReports
}


const apiDate = f => moment(f).format('YYYY-MM-DD')
// add machine code
const eventListMachine = createMachine({
  id: "event_list",
  initial: "init_lookup",
  states: {

    init_lookup: {
      entry: [
        assign({ busy: true }),
        assign({ lookup_index: 0 }),
        "restoreProps", "setInitParams", 
      ],
      initial: "tick",
      states: {
        tick: {
          after: {
            "500": [
              {
                target: "#event_list.init_lookup.tock",
                cond: "moreLookup", 
              },
              {
                target: "#event_list.listing.searching",
                actions: [assign({ busy: false }), "clearLookup"],  
              },
            ],
          },
        },
        tock: {
          invoke: {
            src: "loadLookup",
            onDone: [
              {
                target: "tick",
                actions: "assignLookup",
              },
            ],
          },
        },
      },
    },

  
    listing: {
      initial: "ready",
      states: {


        ready: {
          description: "Ready state shows the list of selected events",
          entry: [
            assign({ busy: false }),
            "assignMessage",
            assign({ ticks: 5 }),
          ],
          initial: "tik",
          states: {
            tik: {
              after: {
                "30000": {
                  target: "#event_list.listing.ready.tok",
                  actions: ["countdown"],
                  internal: false,
                },
              },
            },
            tok: {
              after: {
                "30000": [
                  {
                    target: "#event_list.listing.ready.tik",
                    cond: "moreTicks",
                    actions: ["countdown"],
                    internal: false,
                  },
                  {
                    target: "#event_list.listing.searching",
                    actions: [],
                    internal: false,
                  },
                ],
              },
            },
          },
          on: {
            CHANGE: {
              actions: "assignProp",
            },
            PARAM: {
              actions: "assignParam",
            },
            FIND: {
              target: "searching",
              actions: "assignParams",
            },
            EDIT: {
              target: "#event_list.editing",
              actions: "assignID",
            },
            CREATE: {
              target: "#event_list.editing",
              actions: "assigNew",
            },
          },
        },
        // ready: {
        //   description: "Ready state shows the list of selected events",
        //   entry: [ "assignMessage", assign({ busy: false })],
        //   on: {
        //     CHANGE: {
        //       actions: "assignProp",
        //     },
        //     PARAM: {
        //       actions: "assignParam",
        //     },
        //     FIND: {
        //       target: "searching",
        //       actions: "assignParams",
        //     },
        //     EDIT: {
        //       target: "#event_list.editing",
        //       actions: "assignID"
        //     }, 
        //   },
        // },


        list_received: {
          invoke: {
            src: "getListCategories",
            onDone: [
              {
                target: "ready",
                actions: "updateEvents",
              },
            ],
          },
        },
        search_error: {
          after: {
            "30000": {
              target: "#event_list.listing.ready",
              actions: [],
              internal: false,
            },
          },
        },
        searching: {
          description: "Connect to search api with requested params",
          // entry: assign({ busy: true }),
          invoke: {
            src: "findEvents",
            onDone: [
              {
                target: "list_received",
                actions: "assignEvents",
              },
            ],
            onError: [
              {
                target: "search_error",
                actions: "assignProblem",
              },
            ],
          },
        },
      },
    },

    editing: {
      initial: "load_event",
      states: {
        load_event: {
          entry: assign({ busy: true }),
          invoke: {
            src: "loadEventDetail",
            onDone: [
              {
                target: "form",
                actions: ["assignEventProps", assign({ busy: false })],
              },
            ],
          },
        },

        init: {
          entry: assign({ busy: true }),
          initial: "roomload",
          states: {
            roomload: {
              invoke: {
                src: "loadRoomList",
                onDone: [
                  {
                    target: "categoryload",
                    actions: "assignRoomList",
                  },
                ],
              },
            },
            categoryload: {
              invoke: {
                src: "loadCategories",
                onDone: [
                  {
                    target: "calendarload",
                    actions: "assignCategories",
                  },
                ],
              },
            },
            calendarload: {
              invoke: {
                src: "loadCalendars",
                onDone: [
                  {
                    target: "#event_list.editing.load_event",
                    actions: "assignCalendars",
                  },
                ],
              },
            },
          },
        }, 

        leaving: {
          initial: "list",
          states: {
            list: {
              description: "Confirm closing form",
              always: {
                target: "#event_list.listing",
                cond: "isClean",
                actions: "clearID",
              },
              on: {
                OK: {
                  target: "#event_list.listing",
                  actions: ["clearID", assign({ dirty: false })],
                },
              },
            },
            find: {
              description: "Confirm closing form",
              always: {
                target: "#event_list.listing.searching",
                cond: "isClean",
              },
              on: {
                OK: {
                  target: "#event_list.listing.searching",
                  actions: assign({ dirty: false }),
                },
              },
            },
            edit: {
              description: "Confirm loading new event",
              always: {
                target: "#event_list.editing.load_event",
                cond: "isClean",
              },
              on: {
                OK: {
                  target: "#event_list.editing.load_event",
                },
              },
            },
          },
          on: {
            CANCEL: {
              target: "form",
              actions: "resetID"
            },
          },
        },

        reload: {
          initial: "list",
          states: {
            list: {
              invoke: {
                src: "findEvents",
                onDone: [
                  {
                    target: "folders",
                    actions: "assignEvents",
                  },
                ],
              },
            },
            folders: {
              invoke: {
                src: "getListCategories",
                onDone: [
                  {
                    target: "#event_list.editing.load_event",
                    actions: "updateEvents",
                  },
                ],
              },
            },
          },
        },


        
        form: {
          description: "Form state shows the event edit form", 
          initial: "findconflicts",
          states: {
            idle: {
              on: {
                ATTR: [
                  {
                    target: "idle",
                    cond: "passCheck",
                    actions: ["assignEventProp", assign({ dirty: true })],
                    internal: false,
                  },
                  {
                    target: "findconflicts",
                    actions: ["assignEventProp", assign({ dirty: true })],
                  },
                ],
              },
            },
            findconflicts: {
              invoke: {
                src: "loadConflicts",
                onDone: [
                  {
                    target: "idle",
                    actions: "assignConflicts",
                  },
                ],
              },
            },
          },
          on: {
            CHANGE: {
              actions: "assignProp",
            },
            LIST: {
              target: "#event_list.editing.leaving.list",
            },
            FIND: {
              target: "#event_list.editing.leaving.find",
              actions: "assignParams",
            },
            EDIT: {
              target: "#event_list.editing.leaving.edit",
              actions: "assignID",
              description: "User opens another event while editing this one",
            },
            UNDO: {
              target: "load_event",
            },
          },
        },

        // form: {
        //   description: "Form state shows the event edit form",
        //   on: {
        //     CHANGE: {
        //       actions: "assignProp",
        //     },
        //     ATTR: {
        //       actions: ["assignEventProp", assign({ dirty: true })],
        //     },
        //     UNDO: {
        //       target: "load_event",
        //     }, 
        //     EDIT: {
        //       target: "#event_list.editing.leaving.edit",
        //       actions: "assignID",
        //     },
        //     LIST: {
        //       target: "#event_list.editing.leaving.list",
        //     },
        //     FIND: {
        //       target: "#event_list.editing.leaving.find",
        //       actions: "assignParams",
        //     },
        //   },
        // },
      },
      on: {
        SAVE: {
          target: "saving",
        },
      },
    },

    saving: {
      initial: "validating",
      states: {
        validating: {
          invoke: {
            src: "validateEvent",
            onDone: [
              {
                target: "saving",
              },
            ],
            onError: [
              {
                target: "valid_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        saving: {
          entry: assign({ saving: true }),
          invoke: {
            src: "commitEvent",
            onDone: [
              {
                target: "#event_list.editing.reload",
                actions: assign({ dirty: false, saving: false }),
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
        valid_error: {
          description: "In validation error state user can modify request",
          on: {
            RETRY: {
              target: "validating",
            },
            CANCEL: {
              target: "#event_list.editing",
              actions: "clearProblems",
            },
          },
        },
        save_error: {
          on: {
            CANCEL: {
              target: "#event_list.editing",
              actions: "clearProblems",
            },
            RETRY: {
              target: "saving",
            },
          },
        },
      },
    },

  },
  on: {
    VIEW: {
      actions: "toggleViewBit",
    },
  },
  context: {
    params: {}, 
    props: {
      theme: 'secondary',
      format: 1
    },
    calendars: [],
    categories: [],
    lookup_index: 0,
    logo: '/poweredby.gif'
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    moreTicks: context => context.ticks > 0,
    isClean: context => !context.dirty,
    passCheck: (_, event) => !['EventStartTime'].some(f => f === event.key),
    moreLookup: context => context.lookup_index < Object.keys(lookupItems).length
  },
  actions: {
 


    setInitParams: assign({
      view: VIEW.FORM_OPTIONBAR + VIEW.FORM_SIDEBAR + VIEW.LIST_SIDEBAR,
      busy: true
    }),
    
    toggleViewBit: assign((context, event) => ({
      view: context.view & event.bit 
        ? context.view - event.bit 
        : Number(context.view) + Number(event.bit)
    })),
    
    assignEventProp: assign((context, event) => {
      if (event.key.indexOf('Time') > 0) {
        return {
          changedProp: event.key,
          eventProp: {
            ...context.eventProp,
            [event.key]: eventTime(event.value)
          }
        } 
      }
      return {
        changedProp: event.key,
        eventProp: {
          ...context.eventProp,
          [event.key]: event.value
        }
      }
    }),

    clearLookup: assign((context, event) => { 
      return { 
        lookup_index: 0,
        lookup_progress: 0,
      }
    }),
    
    assignLookup: assign((context, event) => {
      const { lookup_index } = context;
      const keys = Object.keys(lookupItems);
      return {
        [keys[lookup_index]]: event.data,
        lookup_index: lookup_index + 1,
        lookup_progress: 100 * (lookup_index /  keys.length)
      }
    }),
    
    assignRoomList: assign((_, event) => ({
      roomList: event.data
    })),

    assignCalendars: assign((_, event) => ({
      calendars: event.data
    })),
    assignCategories: assign((_, event) => ({
      categories: event.data
    })),
    assignConflicts: assign((_, event) => ({
      conflicts: event.data
    })),

    

    assignEventProps: assign((_, event) => ({
      eventProp: event.data,
      pagename: "Edit", 
      title: event.data?.EventName,
      dirty: false,
      conflicts: null
    })),
    clearID: assign((context, event) => ({
      ID: null,
      props: {
        active_machine: context.props.active_machine,
        format: context.props.format,
        informed: context.props.informed,
        theme: context.props.theme
      }
    })),
    assignID: assign((_, event) => ({
      ID: event.ID
    })),
    countdown: assign((context) => ({
      ticks: context.ticks - 1
    })),
    resetID: assign((context) => ({
      ID: context.eventProp.ID
    })),
    assignProblem: assign((_, event) => ({
      error: event.data.message,
      stack: event.data.stack
    })),
    assignEvents: assign((context, event) => ({
      eventList: event.data,
      dirty: false ,
      busy: true
    })),
    assignMessage: assign(context => {
      const { params } = context;
      const { title, start_date, end_date } = params;
      const label = [context.eventList.length + ' events '];

      if (!Object.keys(params).length) { 
        label.push('on', engDate())
      }

      if (start_date) {
        if (end_date) {
          label.push('from', engDate(start_date), 'to', engDate(end_date))  
        } else label.push('on', engDate(start_date))  
      }

      if (title) {
        label.push('named', `"${title}"`)
      }
      
      return {
        label: label.join(" "),
        title: label.join(" "),
        pagename: "List",
      }
      // const label = JSON.stringify(context.params);
      // return {
      //   label
      // }
    }),
    assignParams: assign((context, event) => ({
      ID: null,
      params: event.params,
      busy: 1
    })),
    assignParam: assign((context, event) => ({ 
      params: {
        ...context.params,
        [event.key]: event.value
      }
    })),
    updateEvents: assign((context, event) => {
      const { eventList } = context;
      const categories = event.data || [];

      return {
        eventList: eventList.map(f => ({
          ...f,
          categories: categories.filter(e => e.eventfk === f.ID)
        }))
      }
    }),
    restoreProps: assign(() => {
      const memory = localStorage.getItem('eb-memory-12');
      if (memory) {
        return {
          props: JSON.parse(memory)
        }
      }
    }),
    assignProp: assign((context, event) => {
      const props = {
        ...context.props,
        [event.key]: event.value
      };

      const memory = PERSIST_PROPS.reduce((out, key) => {
        out[key] = props[key];
        return out;
      }, {});

      localStorage.setItem('eb-memory-12', JSON.stringify(memory))

      return {
        props 
      }
    }),
  }
});

export const useEventList = () => {
  const location = useLocation();
  const routeProps = useParams();
  const [state, send] = useMachine(eventListMachine, {
    services: { 
      findEvents: async(context) => { 
        if (!Object.keys(context.params).length) {
          return searchEvents({
            start_date: apiDate(new Date())
          })
        }
        return await searchEvents(context.params)
      },
      
      loadConflicts: async(context) => {
        
        const fields = {
          id: 'ID',
          start_date: 'EventDate',
          start_time: 'EventStartTime',
          end_time: 'EventEndTime',
          roomfk: 'RoomID',
          dates: 'dates'
        };
        
        if (context.eventProp.RecurseEndDate) {
          Object.assign(fields, {
            end_date: 'RecurseEndDate'
          })
        }
 
        const params = Object.keys(fields).reduce((out, key) => {
          out[key] = key.indexOf('date') > 0 
            ? apiDate( context.eventProp[ fields[key] ] )
            : context.eventProp[ fields[key] ];
          return out;
        }, {});

        const present = moment().format('YYYY-MM-DD') 
        console.log ({ present, params })
        const res = await searchEvents(params);
        return res.filter(f => f.ID !== context.eventProp.ID);


      },
      getListCategories: async(context) => {
        const { eventList } = context;
        const ids = eventList.map(d => d.ID);
        console.log ({ ids })
        return await getEventListCategories(ids.join(','))
      },
      commitEvent: async(context) => await saveEvent(context.eventProp),
      validateEvent: async() => true,

      loadLookup: async(context) => {
        const { lookup_index } = context;
        const keys = Object.keys(lookupItems);
        const key = keys[lookup_index];
        const get = lookupItems[key];
        const storageKey = `lookup-${key}`;
        const store = localStorage.getItem(storageKey);
        if (store) {
          return JSON.parse(store);
        }
        const data = await get();
        localStorage.setItem(storageKey, JSON.stringify(data))
        return data;
      },

      loadCalendars: async() => await getCalendars(),
      loadCategories: async() => await getCategories(),
      loadRoomList: async() => await getRooms(),

      loadEventDetail: async(context) => { 
        return await getEvent(context.ID)
      },
      getTodaysEvents: async() => {
        return await searchEvents({
          start_date: apiDate(new Date())
        })
      }
    },
  }); 


  React.useEffect(() => {
    // eslint-disable-next-line
    const [_, event] = location.pathname.split('/');
    if (event === 'edit') {
      const { id } = routeProps;
      send({
        type: 'EDIT',
        ID: id
      });
      return;
    }
    const route = routeProps['*'];
    if (route) {
      const values = route.split('/');
      const params  = {}
      for (var i = 0; i < values.length; i +=2) {
        Object.assign(params, { [values[i]]: values[i + 1] })
      } 
      send({
        type: event.toUpperCase(),
        params
      })
      return;
    }

    send(event.toUpperCase())
  }, [location, send, routeProps])

  const diagnosticProps = {
    id: eventListMachine.id,
    states: eventListMachine.states,
    state,
    send,
  };

  const setView = (bit) => {
    send({
      type: 'VIEW',
      bit 
    })
  }

  const setProp = (key, value) => { 
    send({
      type: 'CHANGE',
      key, value 
    })
  }

  const is = (val) => Array.isArray(val)
    ? val.some(state.matches)
    : state.matches(val);

  return {
    state,
    is,
    send, 
    diagnosticProps,
    setProp,
    setView,
    ...state.context
  };
}

const eventTime = f => {
  const [hh,mm] = f.split(":");;
  const num = (((hh % 12) * 3600) + (mm * 60)) * 1000;
  return moment.utc(num).format('HH:mm') ;
}