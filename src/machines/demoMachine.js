
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { apiDate } from "../util/apiDate";
import { shuffle } from "../util/shuffle";

// add machine code
const demoMachine = createMachine({
  id: "narrator",
  initial: "init",
  states: {
    // init: {
    //   on: {
    //     'START': {
    //       target: "#narrator.welcome", 
    //     },
    //   },
    // },

    init: {
      on: {
        CANCEL: {
          target: "#narrator.init.cancel",
        },
      },
      initial: "waiting",
      states: {

        waiting: {
          entry: [assign({ ticks: 10, message: "The automated demo will begin in a few seconds"}), "say"],
          after: {
            "500": {
              target: "#narrator.init.tick",
              actions: [assign({ open: true }), "setMessageWelcomeTicks", "say"],
              internal: false,
            },
          },
        },

        tick: {
          entry: ["setMessageTick"],
          after: {
            "1000": {
              target: "#narrator.init.tock",
              actions: ["decrementTick"],
              internal: false,
            },
          },
        },

        cancel: {
          entry: [assign({ open: false, message: "Fine. No one listens to me anyway."}), "say"],
          after: {
            500: {
              target: "#narrator.init.dormant",
            }
          }
        },

        dormant: {
          on: {
            START: {
              target: "#narrator.welcome",
            },
          },
        },
        tock: {
          entry: ["setMessageTick"],
          after: {
            "1000": [
              {
                target: "#narrator.init.tick",
                cond: "zeroTick",
                actions: ["decrementTick"],
                internal: false,
              },
              {
                target: "#narrator.welcome",
                // target: "#narrator.demo_search",
                actions: [],
                internal: false,
              },
            ],
          },
        },
      },
    },

    // demo_home: {
    //   entry: ["setMessageHome", "say"],
    //   after: {
    //     "5000": {
    //       target: "#narrator.demo_date",
    //       actions: [],
    //       internal: false,
    //     },
    //   },
    // },

    demo_home: {
      entry: ["setMessageHome", "say", "setDrawerHome"],
      initial: "tick",
      states: {
        tick: {
          after: {
            "1000": {
              target: "#narrator.demo_home.tock",
              actions: ["decrementTick"],
              internal: false,
            },
          },
        },
        tock: {
          after: {
            "1000": [
              {
                target: "#narrator.demo_home.tick",
                cond: "zeroTick",
                actions: ["decrementTick"],
                internal: false,
              },
              {
                target: "#narrator.demo_date",
                actions: ["closeDrawer"],
                internal: false,
              },
            ],
          },
        },
      },
    },

    welcome: {
      entry: ["setMessageWelcome", "say"],
      exit: assign({ open: false }),
      after: {
        9500: {
          target: "#narrator.demo_home",
          actions: [],
          internal: false,
        },
      },
    },

    pause_date: {
      entry: "setDrawerSearch",
      initial: "tick",
      states: {
        tick: {
          after: {
            "1000": {
              target: "#narrator.pause_date.tock",
              actions: ["decrementTick"],
              internal: false,
            },
          },
        },
        tock: {
          after: {
            "1000": [
              {
                target: "#narrator.pause_date.tick",
                cond: "zeroTick",
                actions: ["decrementTick"],
                internal: false,
              },
              {
                target: "#narrator.demo_search",
                actions: ["closeDrawer"],
                internal: false,
              },
            ],
          },
        },
      },
    },

    demo_search: {
      entry: ["setMessageSearch", "say", "assignParam"],
      initial: "type_input",
      states: {
        type_input: {
          invoke: {
            src: "simulateSearch",
            onDone: [
              {
                target: "show_search",
                cond: "doneKeys",
              },
              {
                target: "next_key",
              },
            ],
          },
        },
        pause: {
          entry: ["setMessagePause", "say", "setDrawerRoom"],
          initial: "tick",
          states: {
            tick: {
              after: {
                "1000": {
                  target: "#narrator.demo_search.pause.tock",
                  actions: ["decrementTick"],
                  internal: false,
                },
              },
            },
            tock: {
              after: {
                "1000": [
                  {
                    target: "#narrator.demo_search.pause.tick",
                    cond: "zeroTick",
                    actions: ["decrementTick"],
                    internal: false,
                  },
                  {
                    target: "#narrator.demo_room",
                    actions: ["closeDrawer"],
                    internal: false,
                  },
                ],
              },
            },
          },
        },


        // pause: {
        //   entry: ["setMessagePause", "say"],
        //   after: {
        //     "6500": {
        //       target: "#narrator.demo_room",
        //       actions: [],
        //       internal: false,
        //     },
        //   },
        // },


        show_search: {
          after: {
            "5500": {
              target: "#narrator.demo_search.close_input", 
            },
          },
        },
        close_input: {
          invoke: {
            src: "exitSearch",
            onDone: [
              {
                target: "pause",
              },
            ],
          },
        },
        next_key: {
          after: {
            400: {
              target: "#narrator.demo_search.type_input",
              actions: ["assignNextKey"],
              internal: false,
            },
          },
        },
      },
    },

 

    demo_room: {
      entry: [
        "setMessageRoomDemo",
        "say",
        assign({ open: true }),
        assign({ count: 0 }),
      ],
      initial: "send_room",
      states: {
        send_room: {
          invoke: {
            src: "openRoomPanel",
            onDone: [
              {
                target: "pause_room",
              },
            ],
          },
        },
        pause_room: {
          after: {
            2500: {
              target: 'show_room'
            }
          }
        },
        show_room: {
          entry: ["setMessageRoomEdit", "say"],
          after: {
            "5500": {
              target: "#narrator.demo_room.open_room",
              actions: [],
              internal: false,
            },
          },
        },
        open_room: {
          invoke: {
            src: "selectRoom",
            onDone: [
              {
                target: "show_form",
              },
            ],
          },
        },
        show_form: {
          after: {
            1000: {
              target: "#narrator.demo_room.close_form",
              actions: [],
              internal: false,
            },
          },
        },
        close_form: {
          invoke: {
            src: "closeForm",
            onDone: [
              {
                target: "next",
                cond: "oneDemo",
              },
              {
                target: "close_drawer",
              },
            ],
          },
        },
        close_drawer: {
          exit: assign({ open: false }),
          invoke: {
            src: "closeForm",
            onDone: [
              {
                target: "wait",
              },
            ],
          },
        },
        wait: {
          entry: "setDrawerForm",
          initial: "tick",
          states: {
            tick: {
              after: {
                "1000": {
                  target: "#narrator.demo_room.wait.tock",
                  actions: ["decrementTick"],
                  internal: false,
                },
              },
            },
            tock: {
              after: {
                "1000": [
                  {
                    target: "#narrator.demo_room.wait.tick",
                    cond: "zeroTick",
                    actions: ["decrementTick"],
                    internal: false,
                  },
                  {
                    target: "#narrator.demo_event",
                    actions: ["closeDrawer"],
                    internal: false,
                  },
                ],
              },
            },
          },
        },
        next: {
          entry: "incrementDemo",
          after: {
            1000: {
              target: "#narrator.demo_room.open_room",
              actions: [],
              internal: false,
            },
          },
        },
      },
    },

    demo_reset: {
      entry: ["setMessageReset", "say", assign({ open: true })],
      initial: "reset",
      states: {
        reset: {
          invoke: {
            src: "changeCalendar",
            onDone: [
              {
                target: "wait",
              },
            ],
          },
        },
        wait: {
          after: {
            "7500": {
              target: "#narrator.init.dormant",
              actions: [assign({ open: false })],
              internal: false,
            },
          },
        },
      },
    },

    demo_date: {
      entry: ["setMessageDateDemo", "say"],
      initial: "send_date",
      states: {
        send_date: {
          exit: assign({ open: false }),
          invoke: {
            src: "changeCalendar",
            onDone: [
              {
                target: "show_date",
              },
            ],
          },
        },
        show_date: {
          entry: assign({ open: true }),
          exit: assign({ open: false }),
          after: {
            1500: [
              {
                target: "#narrator.demo_date.send_date",
                cond: "oneDemo",
                actions: ["incrementDemo"],
                internal: false,
              },
              {
                target: "#narrator.pause_date",
                actions: [],
                internal: false,
              },
            ],
          },
        },
      },
    },
    demo_event: {
      entry: assign({ count: 0 }),
      initial: "get_events",
      states: {


        // leaving: {
        //   after: {
        //     "7500": {
        //       target: "#narrator.demo_reset",
        //       actions: [],
        //       internal: false,
        //     },
        //   },
        // },

        leaving: {
          entry: "setDrawerBack",
          initial: "tick",
          states: {
            tick: {
              after: {
                "1000": {
                  target: "#narrator.demo_event.leaving.tock",
                  actions: ["decrementTick"],
                  internal: false,
                },
              },
            },
            tock: {
              after: {
                "1000": [
                  {
                    target: "#narrator.demo_event.leaving.tick",
                    cond: "zeroTick",
                    actions: ["decrementTick"],
                    internal: false,
                  },
                  {
                    target: "#narrator.demo_reset",
                    actions: ["closeDrawer"],
                    internal: false,
                  },
                ],
              },
            },
          },
        },

        send_event: {
          exit: assign({ open: false }),
          invoke: {
            src: "changeEvent",
            onDone: [
              {
                target: "show_event",
              },
            ],
          },
        },
        show_event: {
          entry: assign({ open: true }),
          exit: assign({ open: false }),
          after: {
            "2500": [
              {
                target: "#narrator.demo_event.send_event",
                cond: "oneDemo",
                actions: ["incrementDemo"],
                internal: false,
              },
              {
                target: "#narrator.demo_event.leaving",
                actions: ["assignDemoReset"],
                internal: false,
              },
            ],
          },
        },

        show_form: {
          entry: ["setMessageEventEdit", "say"],
          after: {
            "1500": {
              target: "#narrator.demo_event.send_event",
              actions: [],
              internal: false,
            },
          },
        },
        get_events: {
          exit: ["setMessageEventDemo", "say"],
          invoke: {
            src: "loadEventIDs",
            onDone: [
              {
                target: "show_form",
                actions: "assignEventIDs",
              },
            ],
          },
        },
      },
    },

    // demo_event: {
    //   initial: "send_event",
    //   states: {
    //     send_event: {
    //       entry: ["setMessageEventDemo", "say"],
    //       exit: assign({ open: false }),
    //       invoke: {
    //         src: "changeEvent",
    //         onDone: [
    //           {
    //             target: "show_event",
    //           },
    //         ],
    //       },
    //     },
    //     show_event: {
    //       entry: ["setMessageEventEdit", assign({ open: true }), "say"],
    //       exit: assign({ open: false }),
    //     },
    //   },
    //   after: {
    //     15500: {
    //       target: "#narrator.demo_reset",
    //       actions: "assignDemoReset"
    //     },
    //   },
    // },
  },
  context: {
    count: 0,
    room: 86,
    ev: 49141,
    rooms: [75, 101, 87, 64, 97],
    events: [],
    date: '03/07/2023',
    dates: ['02/07/2023','04/03/2023','01/22/2023','03/01/2023','02/01/2023','01/11/2023'],
    message: 'loading...'
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    oneDemo: context => context.count < 4,
    zeroTick: context => context.ticks > 1,
    doneKeys: context => !(context.index < (context.param.length + 1))
  },
  actions: {
    decrementTick: assign(context => ({ ticks: context.ticks - 1 })),
    incrementDemo: assign(context => ({
      date: context.dates[context.count],
      room: context.rooms[context.count],
      count: context.count + 1,
      ev: context.events[context.count],
    })),
    assignParam: assign({
      index: 2,
      param: 'congregation tiferet',
      value: 'co'
    }),
    assignNextKey: assign((context) => ({
      index: context.index + 1,
      value: context.param.substr(0, context.index)
    })),
    assignEventIDs: assign((_, event) => ({
      events: event.data,
      ev: event.data[0]
    })),
    assignDemoReset: assign({ count: 0 , date: new Date()}),
    close: assign({ open: false }),
    say: context => speek(context.message),

    setDrawerBack: assign({ text: "Next: Returning to the main list", ticks: 6, drawer: true }),
    setDrawerForm: assign({ text: "Next: Editing selected events", ticks: 3, drawer: true }),
    setDrawerRoom: assign({ text: "Next: Using the roomlist", ticks: 6, drawer: true }),
    setDrawerHome: assign({ text: "Next: Using the calendar", ticks: 6, drawer: true }),
    setDrawerSearch: assign({ text: "Next: The event search bar", ticks: 4, drawer: true }),
    closeDrawer: assign({ drawer: false }),

    setMessageWelcomeTicks: assign(context => ({ message: `Starting demo in ${context.ticks} seconds`})),
    setMessageTick: assign(context => ({ message: `${context.ticks}`})),
    setMessageSearch: assign({ open: true, message: "Events can be searched using the provided input bar which displays event details including the date, time and the name of the event creator."}),
    setMessageHome: assign({ open: true, message: "This is the home page listing all events for the current date."}),
    setMessageEventEdit: assign({ message: 'The event form allows the editing of individual events in your facility. Notice that the event list is still available in the left panel to allow continuous editing without returning to the main list'}),
    setMessageReset: assign({ message: 'Once editing is complete, the full event list can be reopened by using the back button on the sidebar'}),
    setMessageRoomEdit: assign({ message: 'by clicking the room name like I am doing now, Rooms can be edited without losing your place in the list . Check it out.'}),
    setMessageRoomDemo: assign({ message: 'For example, the room list can be opened by clicking the Rooms button in the sidebar like so.'}),
    setMessagePause: assign({ message: 'although The event list is the main page of the application. Other pages can be reached using the sidebar controls', open: true}),
    setMessageWelcome: assign({ message: 'Welcome to the demo. I will control your screen while showing you the features of the new Event Builder. Sit back relax and I will do all the work.', open: true}),
    setMessageDateDemo: assign(context => ({ message: "Dates can be changed using the inline calendar, like this.", open: true})),
    setMessageEventDemo: assign({ message: 'Open an event for editing by clicking on any event name.', open: true}), 
  }
});

export const useDemo = (events, room, find) => {
  const chat = events.send;
  const [state, send] = useMachine(demoMachine, {
    services: { 
      changeCalendar: async (context) => {
        chat({
          type: 'FIND',
          params: {
            start_date: apiDate(new Date(context.date))
          }
        })
      },
      loadEventIDs: async() => {
        if (!events.eventList) return []
        return shuffle(events.eventList.map(f => f.ID).slice(0,8));
      },
      exitSearch: async (context) => {
        find('EXIT')
      },
      simulateSearch: async (context) => {
        console.log (context.value)
        find({
          type: 'FIND',
          param: context.value,
          auto: true
        })
      },
      closeForm: async (context) => {
        room('CLOSE')
      },
      selectRoom: async (context) => {
        room({
          type: 'EDIT',
          ID: context.room
        })
      },
      openRoomPanel: async (context) => {
        room('OPEN')
      },
      changeEvent: async (context) => {
        chat({
          type: 'EDIT',
          ID: context.ev
        })
      }
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
const utterThis = new SpeechSynthesisUtterance()
const speek = msg => {
  const synth = window.speechSynthesis;
  utterThis.lang = "en-US";
  utterThis.text = msg
  synth.speak(utterThis)
}