import React from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { engDate } from '../util/engDate';
import { searchEvents, getRooms, getCalendars, getEvent, getCategories } from '../connector';
import moment from 'moment';
import {  
  useLocation, 
  useParams,
} from "react-router-dom";



const apiDate = f => moment(f).format('YYYY-MM-DD')
// add machine code
const eventListMachine = createMachine({
  id: "event_list",
  initial: "loaded",
  states: {
    loaded: {
      // entry: "setInitParams",
      invoke: {
        src: "findEvents",
        onDone: [
          {
            target: "listing",
            actions: "assignEvents",
          },
        ],
        onError: [
          {
            target: "load_error",
            actions: "assignProblem",
          },
        ],
      },
    },


    load_error: {
      on: {
        RECOVER: {
          target: "loaded",
        },
      },
    },

    

    listing: {
      initial: "ready",
      states: {
        ready: {
          description: "Ready state shows the list of selected events",
          entry: ["statusListReady", "assignMessage", assign({ busy: false })],
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
              actions: "assignID"
            },
          },
        },
        searching: {
          description: "Connect to search api with requested params",
          entry: assign({ busy: true }),
          invoke: {
            src: "findEvents",
            onDone: [
              {
                target: "ready",
                actions: "assignEvents",
              },
            ],
          },
        },
      },
    },
    editing: {
      initial: "init",
      states: {
        load_event: {
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

        // init: {
        //   entry: assign({ busy: true }),
        //   invoke: {
        //     src: "loadRoomList",
        //     onDone: [
        //       {
        //         target: "load_event",
        //         actions: "assignRoomList",
        //       },
        //     ],
        //   },
        // }, 

        form: {
          description: "Form state shows the event edit form",
          on: {
            CHANGE: {
              actions: "assignProp",
            },
            ATTR: {
              actions: ["assignEventProp", assign({ dirty: true })],
            },
            SAVE: {
              target: "#event_list.saving",
            },
            EDIT: {
              target: "load_event",
              actions: ["assignID", assign({ busy: true })], 
            },
            LIST: {
              target: "#event_list.listing.ready",
              actions: "clearID",
            },
            FIND: {
              target: "#event_list.listing.searching",
              actions: "assignParams",
            },
          },
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
          invoke: {
            src: "commitEvent",
            onDone: [
              {
                target: "#event_list.editing",
                actions: assign({ dirty: false }),
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
  context: {
    params: {}, 
    props: {},
    calendars: [],
    categories: [],
logo: 'http://shalomaustin.eventbuilder.pro/dist/poweredby.gif'},
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {

    statusListReady: assign((context) => ({
      message: 'Event list is ready'
    })),


    setInitParams: assign((_, event) => ({
      params: {
        start_date: apiDate(new Date())
      }
    })),

    assignRoomList: assign((_, event) => ({
      roomList: event.data
    })),
    
    assignEventProp: assign((context, event) => {
      if (event.key.indexOf('Time') > 0) {
        return {
          eventProp: {
            ...context.eventProp,
            [event.key]: eventTime(event.value)
          }
        } 
      }
      return {
        eventProp: {
          ...context.eventProp,
          [event.key]: event.value
        }
      }
    }),
    assignCalendars: assign((_, event) => ({
      calendars: event.data
    })),
    assignCategories: assign((_, event) => ({
      categories: event.data
    })),
    assignEventProps: assign((_, event) => ({
      eventProp: event.data
    })),
    clearID: assign((_, event) => ({
      ID: null,
      props: {}
    })),
    assignID: assign((_, event) => ({
      ID: event.ID
    })),
    assignProblem: assign((_, event) => ({
      error: event.data.message,
      stack: event.data.stack
    })),
    assignEvents: assign((context, event) => ({
      eventList: event.data,
      dirty: false,
      // props: {
      //   ...context.props,
      //   ...context.params
      // }
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
        label: label.join(" ")
      }
      // const label = JSON.stringify(context.params);
      // return {
      //   label
      // }
    }),
    assignParams: assign((context, event) => ({
      ID: null,
      params: event.params,
      dirty: 1,
    })),
    assignParam: assign((context, event) => ({
      dirty: 1,
      params: {
        ...context.params,
        [event.key]: event.value
      }
    })),
    assignProp: assign((context, event) => ({
      props: {
        ...context.props,
        [event.key]: event.value
      }
    })),
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
      // alert (JSON.stringify({event, params},0,2))
      send({
        type: event.toUpperCase(),
        params
      })
      return;
    }

    send(event.toUpperCase())
  }, [location, send, routeProps])

  return {
    state,
    send, 
    ...state.context
  };
}

const eventTime = f => {
  const [hh,mm] = f.split(":");;
  const num = (((hh % 12) * 3600) + (mm * 60)) * 1000;
  return moment.utc(num).format('HH:mm') ;
}