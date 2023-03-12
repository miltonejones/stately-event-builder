
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getUsers, searchEvents } from '../connector';

// add machine code
const eventSearchMachine = createMachine({
  id: "event_search",
  initial: "idle",
  states: {
    idle: {


      initial: "get_users",
      states: {
        get_users: {
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
        ready: {
          description: "Component is ready when user list successfully loads",
        },
        exiting: {
          after: {
            "1500": {
              target: "#event_search.idle.ready",
              actions: [],
              internal: false,
            },
          },
        },
      },
      on: {
        FIND: {
          target: "searching",
          actions: "assignParam",
        },
        EXIT: {
          target: "exiting",
          actions: "clearParam",
        },
      },
    },



    // idle: {
    //   on: {
    //     FIND: {
    //       target: "searching",
    //       actions: "assignParam",
    //     },
    //     EXIT: { 
    //       actions: "clearParam",
    //       target: "exiting",
    //     },
    //   },
    // },


    exiting: {
      after: {
        2000: {
          target: "#event_search.idle.ready",
        }
      }
    },


    searching: {
      initial: "find_events",
      states: {
        find_events: {
          invoke: {
            src: "eventSearch",
            onDone: [
              {
                target: "#event_search.idle.ready",
                actions: "assignOptions",
              },
            ],
            onError: [
              {
                target: "#event_search.idle.ready",
              },
            ],
          },
        },
      },
    },
  },
  context: { options: [], param: "", auto: false },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    clearParam: assign({ param: "", options: [], auto: false }),
    assignUsers: assign((_, event) => ({ users: event.data })),
    assignParam: assign((_, event) => ({ param: event.param, auto: event.auto })),
    assignOptions: assign((context, event) => {
      const value = context.param;
      const opts = event.data;
      if (opts.message) {
        return {
          options: []
        };
      }

      console.log ({
        opts
      })

      const more = opts.length > 10 ? [{
        EventName: `Show all ${opts?.length} results.`,
        value,
        icon: "Launch",
        show: 1,
      }] : [];
      const options = [
        {
          EventName: `Create new event named "${context.param}"`, 
          RoomNames: "Open the event edit form.",
          value,
          icon: "Add",
          create: 1,
        },
        ...more,
        ...opts?.slice(0, 10)
      ] ;
      return {
        options
      }; 
    }),
  }
});

export const useEventSearch = () => {
  const [state, send] = useMachine(eventSearchMachine, {
    services: { 
      loadUsers: async () => await getUsers(),
      eventSearch: async (context) => {
        return await searchEvents({
          title: context.param,
          order: "ID DESC"
        }); 
      }
     },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
