
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { apiDate } from "../util/apiDate";
import { shuffle } from "../util/shuffle";

// add machine code
const demoMachine = createMachine({
  id: "narrator",
  initial: "idle",
  states: {
    idle: {
      after: {
        300: {
          target: "#narrator.init.dormant"
        }
      }
    },
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
              actions: [assign({ open: true, step: 0 })],
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
          description: "Wait for user to request demo",
          entry: assign({ step: 0 }),
          on: {
            START: {
              target: "#narrator.welcome",
            },
            LOGIN: {
              target: "#narrator.logging_in",
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
        paused: {
          on: {
            RESUME: {
              target: 'tock',
              actions: 'pauseOff',
            },
          },
        },
      },
      on: {
        PAUSE: {
          target: '.paused',
          actions: 'pauseOn',
        },
      },
    },
    welcome: {
      entry: ["setMessageWelcome", "say", "setDrawerWelcome"],
      exit: [ "incrementStep", assign({ open: false })],
      initial: "tick",
      states: {
        tick: {
          after: {
            "1000": {
              target: "#narrator.welcome.tock",
              actions: ["decrementTick"],
              internal: false,
            },
          },
        },
        tock: {
          after: {
            "1000": [
              {
                target: "#narrator.welcome.tick",
                cond: "zeroTick",
                actions: ["decrementTick"],
                internal: false,
              },
              {
                target: "#narrator.demo_home",
                actions: ["closeDrawer"],
                internal: false,
              },
            ],
          },
        },
        paused: {
          on: {
            RESUME: {
              target: "tock",
              actions: "pauseOff",
            },
          },
        },
      },
      on: {
        PAUSE: {
          target: ".paused",
          actions: "pauseOn",
        },
      },
    }, 

    pause_date: {
      entry: ["incrementStep", "setDrawerSearch"],
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
        paused: {
          on: {
            RESUME: {
              target: 'tock',
              actions: 'pauseOff',
            },
          },
        },
      },
      on: {
        PAUSE: {
          target: '.paused',
          actions: 'pauseOn',
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
          entry: ["incrementStep", "setMessagePause", "say", "setDrawerRoom"],
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
            paused: {
              on: {
                RESUME: {
                  target: "tock",
                  actions: "pauseOff",
                },
              },
            },
          },
          on: {
            PAUSE: {
              target: ".paused",
              actions: "pauseOn",
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
          entry: ["incrementStep", "setDrawerForm"],
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
            paused: {
              on: {
                RESUME: {
                  target: "tock",
                  actions: "pauseOff",
                },
              },
            },
          },
          on: {
            PAUSE: {
              target: ".paused",
              actions: "pauseOn",
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
      entry: ["setMessageReset","incrementStep", "say",  assign({ open: true })],
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
              target: "#narrator.demo_complete",
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
                target: "#narrator.demo_toggle",
                actions: [],
                internal: false,
              },
            ],
          },
        },
      },
    },


    demo_toggle: {
      entry: [assign({ ticks: 3, bit: 1 }), "setMessageListToggle", "say"],
      initial: "tick",
      states: {
        tick: {
          invoke: {
            src: "toggleSidebar",
          },
          after: {
            "2500": {
              target: "#narrator.demo_toggle.tock",
              actions: ["decrementTick"],
              internal: false,
            },
          },
        },
        tock: {
          invoke: {
            src: "toggleSidebar",
          },
          after: {
            "2500": [
              {
                target: "#narrator.demo_toggle.tick",
                cond: "zeroTick",
                actions: ["decrementTick"],
                internal: false,
              },
              {
                target: "#narrator.pause_date",
                actions: ["closeDrawer"],
                internal: false,
              },
            ],
          },
        },
        paused: {
          on: {
            RESUME: {
              target: 'tock',
              actions: 'pauseOff',
            },
          },
        },
      },
      on: {
        PAUSE: {
          target: '.paused',
          actions: 'pauseOn',
        },
      },
    },

    demo_event: {
      entry: assign({ count: 0, bit: 2 }),
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

        toggle_close: {
          entry: ["setMessageToggle", "say"],
          invoke: {
            src: "toggleSidebar",
            onDone: [
              {
                target: "leaving",
              },
            ],
          },
        },
        toggle_open: {
          invoke: {
            src: "toggleSidebar",
            onDone: [
              {
                target: "#narrator.demo_reset",
              },
            ],
          },
        },


        leaving: {
          entry: ["incrementStep", "setDrawerBack"],
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
                    target: "#narrator.demo_event.toggle_open",
                    actions: ["closeDrawer"],
                    internal: false,
                  },
                ],
              },
            },
            paused: {
              on: {
                RESUME: {
                  target: "tock",
                  actions: "pauseOff",
                },
              },
            },
          },
          on: {
            PAUSE: {
              target: ".paused",
              actions: "pauseOn",
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
                target: "#narrator.demo_event.toggle_close",
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
 
    logging_in: {
      entry: ["setMessageReady", "say"],
      initial: "explaining",
      states: {
        set_user: {
          entry: ["assignUserProp", "setMessageLogin", "say"],
          invoke: {
            src: "setAuthProp",
          },
          after: {
            "2500": {
              target: "#narrator.logging_in.set_pass",
              actions: [],
              internal: false,
            },
          },
        },
        set_pass: {
          entry: "assignPassProp",
          invoke: {
            src: "setAuthProp",
          },
          after: {
            "500": {
              target: "#narrator.logging_in.send_login",
              actions: [],
              internal: false,
            },
          },
        },
        send_login: {
          invoke: {
            src: "signOn",
          },
          after: {
            "4500": {
              target: "#narrator.init",
              actions: [],
              internal: false,
            },
          },
        },
        ready: {
          on: {
            BEGIN: {
              target: "set_user",
            },
          },
        },
        explaining: {
          after: {
            "8000": {
              target: "#narrator.logging_in.ready",
              actions: [],
              internal: false,
            },
          },
        },
      },
      on: {
        CANCEL: {
          target: "#narrator.init.dormant",
        },
      },
    },
    demo_complete: {
      entry: ["setMessageComplete", "setDrawerComplete", "say"],
      initial: "tick",
      states: {
        tick: {
          after: {
            "1000": {
              target: "#narrator.demo_complete.tock",
              actions: ["decrementTick"],
              internal: false,
            },
          },
        },
        tock: {
          after: {
            "1000": [
              {
                target: "#narrator.demo_complete.tick",
                cond: "zeroTick",
                actions: ["decrementTick"],
                internal: false,
              },
              {
                target: "#narrator.demo_complete.logging_off",
                actions: [],
                internal: false,
              },
            ],
          },
        },
        paused: {
          on: {
            RESUME: {
              target: "tock",
            },
          },
        },
        logging_off: {
          invoke: {
            src: "signOut",
            onDone: [
              {
                target: "#narrator.init.dormant",
              },
            ]
          },
        },
      },
      on: {
        PAUSE: {
          target: ".paused",
        },
      },
    },

  },
  context: {
    count: 0,
    room: 86,
    ev: 49141,
    rooms: [75, 101, 87, 64, 97],
    events: [],
    date: '03/07/2023',
    dates: ['02/07/2023','04/03/2023','01/22/2023','03/01/2023','02/01/2023','01/11/2023'],
    message: 'loading...',
    bit: 2,
    step: 0
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
    assignUserProp: assign({ props: {
      key: 'username',
      value: 'guest'
    }}),
    assignPassProp: assign({ props: {
      key: 'password',
      value: 'pj0m$$@d'
    }}),
    decrementTick: assign(context => ({ ticks: context.ticks - 1 })),
    incrementStep: assign(context => ({ step: context.step + 1})),
    incrementDemo: assign(context => ({
      date: context.dates[context.count],
      room: context.rooms[context.count],
      count: context.count + 1,
      ev: context.events[context.count],
    })),
    assignParam: assign({
      index: 2,
      param: 'israel purim party',
      value: 'is'
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
    pauseOff: assign({ paused: false }),
    pauseOn: assign({ paused: true }),
    close: assign({ open: false }),
    say: context => speek(context.message),
    
    setDrawerComplete: assign({ text: "Next: Logging off", ticks: 8, drawer: true }),
    setDrawerWelcome: assign({ text: "Next: Using the home page", ticks: 10, drawer: true }),
    setDrawerBack: assign({ text: "Next: Returning to the main list", ticks: 10, drawer: true }),
    setDrawerForm: assign({ text: "Next: Editing selected events", ticks: 3, drawer: true }),
    setDrawerRoom: assign({ text: "Next: Using the roomlist", ticks: 6, drawer: true }),
    setDrawerHome: assign({ text: "Next: Using the calendar", ticks: 6, drawer: true }),
    setDrawerSearch: assign({ text: "Next: The event search bar", ticks: 4, drawer: true }),
    closeDrawer: assign({ drawer: false }),
    setMessageLogin: assign({message: "Logging in as guest"}),
    setMessageReady: assign({message: "This will begin an automated walk-through. Please avoid using your mouse or keyboard during the demo. Click Next when ready."}),
    setMessageComplete: assign({ message: "This completes the demo. More information will be added as development continues. Thank you for your attention."}),
    setMessageListToggle: assign({ message: "To hide or show the event calendar, click the X icon in the sidebar like this."}),
    setMessageToggle: assign({ message: "However if you want more space, the event list can be hidden using the X icon in the sidebar"}),
    setMessageWelcomeTicks: assign(context => ({ message: `Starting demo in ${context.ticks} seconds`})),
    setMessageTick: assign(context => ({ message: `${context.ticks}`})),
    setMessageSearch: assign({ open: true, message: "You can search for events by using the provided input bar which displays event details including the date, room name and the name of the event creator."}),
    setMessageHome: assign({ open: true, message: "This is the home page. It shows all events for the current date by default."}),
    setMessageEventEdit: assign({ message: 'The event form allows the editing of individual events in your facility. Notice that the event list is still visible in the left panel to allow continuous editing without returning to the main list'}),
    setMessageReset: assign({ message: 'Once editing is complete, the full event list can be reopened by using the back button on the sidebar'}),
    setMessageRoomEdit: assign({ message: 'By clicking the room name like I am doing now, Rooms can be edited without losing your place in the list . Now is that cool or what!'}),
    setMessageRoomDemo: assign({ message: 'For example, the room list can be opened by clicking the Rooms button in the sidebar like so.'}),
    setMessagePause: assign({ message: 'Although the event list is the main page of the application. Other pages can be reached using the sidebar controls', open: true}),
    setMessageWelcome: assign({ message: 'This is an automated demo. I will control your screen while showing you the features of the new EventBuilder version 8. Sit back relax and I will do all the work.', open: true}),
    setMessageDateDemo: assign(context => ({ message: "Dates can be changed using the inline calendar, like this.", open: true})),
    setMessageEventDemo: assign({ message: 'Open an event for editing by clicking on any event name.', open: true}), 
  }
});

export const useDemo = (events, room, find, auth) => {
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
      signOn: async(context) => {
        auth('SIGNIN')
      },
      signOut: async(context) => {
        auth('SIGNOUT')
      },
      setAuthProp: async(context) => { 
        auth({
          type: 'CHANGE',
          ...context.props
        })
      },
      loadEventIDs: async() => {
        if (!events.eventList) return []
        return shuffle(events.eventList.map(f => f.ID).slice(0,8));
      },
      exitSearch: async (context) => {
        find('EXIT')
      },
      toggleSidebar: async (context) => { 
        chat({
          type: 'VIEW',
          bit: context.bit
        })
      },
      simulateSearch: async (context) => { 
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