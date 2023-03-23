
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getUsers, searchEvents } from '../connector';
import moment from 'moment';

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
    clearParam: assign({ param: "", options: [], auto: false, label: null }),
    assignUsers: assign((_, event) => ({ users: event.data })),
    assignParam: assign((_, event) => ({ param: event.param, auto: event.auto })),
    assignOptions: assign((context, event) => {
      const props = inferProp(context.param)
      // const value = context.param;
      // const isDate =  moment(value).isValid();
      const opts = event.data;
      if (opts.message) {
        return {
          options: []
        };
      }

      // const more = opts.length > 50 ? [{
      //   EventName: `Show all ${opts?.length} results ${props.label}.`,
      //   value,
      //   icon: "Launch",
      //   show: 1,
      // }] : [];

      // const add = props.create ? [{
      //     EventName: `Create new event ${props.label}`, 
      //     RoomNames: "Open the event edit form.",
      //     value,
      //     icon: "Add",
      //     create: 1,
      //   }] : []
      // const options = [
      //   // ...add,
      //   // ...more,
      //   ...opts//.slice(0, 50)
      // ] ; 

      return {
        options: opts ,
        label: `${opts?.length} events ${props.label}`
      }; 
    }),
  }
});
// 4/1/2023
export const useEventSearch = () => {
  const [state, send] = useMachine(eventSearchMachine, {
    services: { 
      loadUsers: async () => await getUsers(),
      eventSearch: async (context) => {

        const props = inferProp(context.param)
        

        // const isDate =  moment(context.param).isValid();
        // const params = isDate 
        //   ? {
        //     start_date: moment(context.param).format('YYYY-MM-DD'),
        //     order: "ID DESC"
        //   }
        //   : {
        //     title: context.param,
        //     order: "ID DESC"
        //   };
 
        return await searchEvents(props.params); 
      }
     },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}

const inferProp = value => {
  const order = "ID DESC";

  if (!isNaN(value) && value < 13 && value > 0) {
    const start_date = moment(`${value}/1/2023`).format('YYYY-MM-DD');
    const end_date = moment(`${value}/1/2023`)
    .add(1, 'months')
    .add(-1, 'days')
    .format('YYYY-MM-DD');
    return {
      label: `during the month of ${moment(start_date).format('MMMM, YYYY')}`,
      params: {
        start_date,
        end_date,
        order: "CustomDate DESC"
      }
    }
  }

  const isDate =  moment(value).isValid();

  if (isDate) {
    const year = moment(value).year();

    const start_date = moment(value).year(year < 2018 ? 2023 : year).format('YYYY-MM-DD');
    return {
      label: `on ${moment(start_date).format('MMM Do, YYYY')}`,
      create: 1,
      params: {
        start_date, 
        order
      }
    }
  }

  return  {
    label: `named "${value}"`,
    create: 1,
    params: {
      title: value,
      order
    } 
  }

}
