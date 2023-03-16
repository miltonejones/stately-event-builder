
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
          actions: assign({
            anchorEl: (context, event) => event.anchorEl,
          }),
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
        close: {
          target: 'closing',
          actions: assign({
            anchorEl: null,
            value: (context, event) => event.value,
          }),
        },
      },
    },
  },
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
  const handleClick = (event) => {
    send({
      type: "open",
      anchorEl: event.currentTarget,
    });
  };

  const diagnosticProps = {
    id: menuMachine.id,
    states: menuMachine.states,
    state,
    send,
  };

  return {
    state,
    send,
    anchorEl,
    handleClick,
    handleClose,
    diagnosticProps,
  };


}
