
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const transcriberMachine = createMachine({
  id: "transciber",
  initial: "idle",
  states: {
    idle: {
      on: {
        TALK: {
          target: "listening",
          actions: "setAssumptions",
          description: "Assign whatever assumptions are needed to complete the request.",
        },
      },
    },
    listening: {
      initial: "start",
      states: {
        start: {
          invoke: {
            src: "startListening",
            onDone: [
              {
                target: "ears",
              },
            ],
          },
        },
        ears: {
          description: "speech recognition is on and listening",
          on: {
            HEARD: {
              target: "stop",
              actions: "assignHeard",
            },
            STOP: {
              target: "stop",
            },
          },
        },
        stop: {
          invoke: {
            src: "stopListening",
            onDone: [
              {
                target: "#transciber.request",
                // actions: "assignResponse",
              },
            ],
          },
        },
      },
    },
    request: {
      initial: "init",
      states: {
        init: {
          invoke: {
            src: "sendChatRequest",
            onDone: [
              {
                target: "curate",
                actions: "assignEventProps",
              },
            ],
          },
        },
        response: {
          invoke: {
            src: "emitProps",
            onDone: [
              {
                target: "#transciber.idle",
              },
            ],
          },
        },
        curate: {
          on: {
            OK: {
              target: "response",
            },
          },
        },
      },
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  actions: {

    
    setAssumptions: assign(() => ({
      asumptions: []
    })),
    
    // assignEventProps: assign((_, event) => ({
    //   eventProps: event.data
    // })),


    assignHeard: assign((_, event) => ({
      requestText: event.result
    })),


    assignEventProps: assign((_, event) =>  {
      const { choices } = event.data;
      const { message, finish_reason } = choices[0]; 
      return {
        ...message,
        finish_reason
      }
    })
  }
}
);

export const useTranscriber = (onChange) => {
  const [state, send] = useMachine(transcriberMachine, {
    services: {
      emitProps: async (context) => onChange && onChange(context.content),

        /**
         * Stops speech recognition.
         * @async
         * @function stopListening
         * @returns {Promise<void>} - A promise that resolves when speech recognition has stopped.
         */
        stopListening: async() => {
          return recognition.stop();
      },

      /**
       * Starts speech recognition.
       * @async
       * @function startListening
       * @returns {Promise<void>} - A promise that resolves when speech recognition has started.
       */
      startListening: async() => {
          return recognition.start();
      },
      sendChatRequest: async(context) => {
        const {  requestText  } = context; 
        const create = q => ([{"role": "user", "content": q}]);
 
        // alert (requestText);
            

        return await generateText (create(instructions (requestText)), 0.2, 512)
      },

     },
  }); 



  /**
   * Creates a new `webkitSpeechRecognition` object, sets the recognition language to 'en-US', and sets the recognition mode to continuous.
   * Also creates a new `SpeechSynthesisUtterance` object.
   * @constant {webkitSpeechRecognition} recognition 
   */
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;  

  recognition.addEventListener("result",  (event) => { 
    const result = event.results[event.resultIndex][0].transcript; 
    send({
      type: 'HEARD',
      result
    });
  }); 


  return {
    state,
    send, 
    ...state.context
  };
}



const instructions = f => `
assume these interfaces

enum RecurseType {
  daily,
  weekly,
  monthly_by_date,
  monthly_by_day,
  yearly,
  weekday,
  custom
}

interface EventDate {
  EventDate: string;
} 

interface Event { 
  EventDate: string;
  RecurseEndDate: string;  
  EventStartTime: string; 
  EventEndTime: string;  // default to 1 hour after start time
  EventName: string;  // default to "New Event"
  CreateDate: string;  
  RecurseType: RecurseType; // blank if not specified
  RecurseUnit: number; // 1 if weekly, 2 if biweekly and so on
  SetupStartTime: string; // default 30 minutes before start
  SetupEndTime: string; // default 30 minutes after end,
  rooms: any[];
  categories: any[];
  customproperties: any[];
  calendars: any[];
  comments: any[];
  dates: EventDate[]; // array of dates this event occurs on
}

format all times as HH:mm:ss
format all dates as MM/DD/YYYY
assume today is 12 april 2023
assume the time is 7:30pm


${f}


return a JSON code block with no additional comments
`


/**
 * Generates text using OpenAI's GPT-3 API
 * @async
 * @function
 * @param {string[]} messages - Array of strings representing the conversation history
 * @param {number} temperature - A number between 0 and 1 representing the creativity of the generated text
 * @returns {Promise<Object>} - A Promise that resolves with an object representing the generated text
 */
const generateText = async (messages, temperature, max_tokens = 128) => {
  const requestOptions = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`,
    },
    body: JSON.stringify({
      messages,
      temperature,
      model: "gpt-3.5-turbo",
      max_tokens
    }),
  };

  /**
   * Sends a POST request to OpenAI's API and returns a Promise that resolves with the response JSON
   * @async
   * @function
   * @param {string} url - The URL to send the request to
   * @param {Object} options - The options to include in the request
   * @returns {Promise<Object>} - A Promise that resolves with the response JSON
   */
  const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions );
  const json = await response.json();

  console.log ({ json })
  return json;
};
