
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getUsers , getUserByName, getCognitoGroups, commitUser} from '../connector';


// add machine code
const userListMachine = createMachine({
  id: "user_list",
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
          entry: assign({ busy: true, dirty: false }, "clearID"),
          invoke: {
            src: "loadUserList",
            onDone: [
              {
                target: "groups",
                actions: "assignUserList",
              },
            ],
          },
        },
        
        groups: {
          invoke: {
            src: "loadGroupList",
            onDone: [
              {
                target: "ready",
                actions: "assignGroupList",
              },
            ],
          },
        },
        ready: {
          description: "Show view with list of users",
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
              target: "#user_list.idle",
              actions: assign({ open: false }),
            }, 
          },
        },

        editing: {
          description: "Show user editing form",
          initial: "load",
          states: {
            load: {
              invoke: {
                src: "loadUser",
                onDone: [
                  {
                    target: "ready",
                    actions: "assignUser",
                  },
                ],
              },
            },
            ready: {},
          },
          on: {
            EDIT: {
              target: ".load",
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

        // editing: {
        //   description: "Show user editing form",
        //   on: {
        //     EDIT: {
        //       actions: "assignID",
        //     },
        //     CHANGE: {
        //       actions: ["applyChanges", assign({ dirty: true })],
        //     },
        //     SAVE: {
        //       target: "saving",
        //     },
        //     CLOSE: {
        //       target: "ready",
        //       actions: "clearID",
        //     },
        //   },
        // },
 
        saving: {
          invoke: {
            src: "saveUser",
            onDone: [
              {
                target: "init",
                actions: "clearID",
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
            src: "deleteUser",
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
        PROP: {
          actions: "assignProp",
        },
      },
    },
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{

  actions: {
    assignUserList: assign((_, event) => ({
      userList: event.data
    })),
    assignUser: assign((_, event) => ({
      user: event.data
    })),
    assignProp: assign((_, event) => ({
      [event.key]: event.value
    })),
    assignGroupList: assign((_, event) => ({ groups: event.data?.map(g => g.GroupName)})),
    applyChanges: assign((context, event) => ({ 
       user: {
        ...context.user,
        [event.key]: event.value
       }
    })),
    clearID: assign((_, event) => ({ 
      ID: null,
      user: null
    })),
    assignID: assign((context, event) => ({
      ID: event.ID,
      user: context.userList.find(f => f.ID === event.ID),
      dirty: false
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

export const useUserList = () => {
  const [state, send] = useMachine(userListMachine, {
    services: { 
      loadUser: async(context) => await getUserByName(context.user.UserID),
      loadUserList: async() => await getUsers(),
      loadGroupList: async() => await getCognitoGroups(),
      saveUser: async(context) => await commitUser(context.user)
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
