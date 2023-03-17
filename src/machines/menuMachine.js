
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const menuMachine = createMachine({
  id: 'menu_controller',
  initial: 'closed',
  states: {
    closed: {
      on: {
        open: {
          target: 'opened',
          actions: "assignOpen",
        },
      },
    }, 
    closing: {
      invoke: {
        src: 'menuClicked',
        onDone: [
          {
            target: 'closed',
          },
        ],
      },
    },
    opened: {
      on: {
        change: {
          actions: "applyChanges"
        },  
        prop: {
          actions: "assignProp"
        },  
        close: {
          target: 'closing',
          actions: "assignClose",
        },
      },
    },
  },
},
{
  actions: {
    assignClose: assign((_, event) => ({
      anchorEl: null,
      value: event.value,
      data: null
    })),
    assignOpen: assign((_, event) => ({
      anchorEl: event.anchorEl,
      data: event.data
    })),
    applyChanges: assign((context, event) => ({
      data: {
        ...context.data,
        [event.key]: event.value
      }
    })),
    assignProp: assign((_, event) => ({
      [event.key]: event.value
    })),
  }
});


export const useMenu = (onChange) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      }, },
  }); 

  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });
  const handleClick = (event, data) => {  
    send({
      type: "open",
      anchorEl: event.currentTarget,
      data
    });
  };

  const diagnosticProps = {
    id: menuMachine.id,
    states: menuMachine.states,
    state,
    send,
  };

  return {
    ...state.context,
    state,
    send,
    anchorEl,
    handleClick,
    handleClose,
    diagnosticProps,
  };


}
