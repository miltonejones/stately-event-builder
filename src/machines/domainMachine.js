
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import * as api from '../connector';


// add machine code
const domainMachine = createMachine({
  id: "domain",
  initial: "idle",
  states: {


    idle: {
      description: "Modal is closed in idle state",
      initial: "ping",
      states: {
        ping: {
          invoke: {
            src: "pingAPI",
            onDone: [
              {
                target: "ready",
                actions: "assignPing",
              },
            ],
          },
        },
        ready: {
          on: {
            OPEN: {
              target: "#domain.opened",
              actions: assign({ open: true }),
            },
          },
        },
      },
    },


    // idle: {
    //   description: "Modal is closed in idle state",
    //   on: {
    //     OPEN: {
    //       target: "opened",
    //       actions: assign({ open: true }),
    //     },
    //   },
    // },


    opened: {
      initial: "load",
      states: {
        list: {
          description: "In idle  state show list of domains",
          meta: {
            message: "Ready",
            step: -1,
          },
          on: {
            ADD: {
              target: "adding",
              actions: "assignName",
            },
            EDIT: {
              target: "editing",
              actions: "assignID",
            },
            SELECT: {
              actions: "assignSelected",
            },
            DROP: {
              target: "dropping",
            },
          },
        },
        adding: {
          initial: "info",
          states: {

            add_domain: { 
              description: "Create subdomain in Route 53",
              meta: {
                step: 2,
                message: "Adding domain",
              },
              entry: "incrementStep",
              initial: "commit",
              states: {
                commit: {
                  invoke: {
                    src: "commitDomain",
                    onDone: [
                      {
                        target: "record",
                        actions: "assignDomainChangeInfo",
                      },
                    ],
                    onError: [
                      {
                        target: "#domain.opened.adding.error",
                      },
                    ],
                  },
                },
                record: {
                  invoke: {
                    src: "saveDomainRecord",
                    onDone: [
                      {
                        target: "#domain.opened.adding.create_env",
                      },
                    ],
                  },
                },
              },
            },

            create_env: {
              description: "Create cognito user pool and mysql database for new instance",
              meta: {
                message: "Initializing database",
              },
              entry: "incrementStep",
              initial: "init_db",
              states: {
                init_db: {
                  description: "Create mysql database and seed with records",
                  meta: {
                    message: "Creating database",
                  },
                  invoke: {
                    src: "initDb",
                    onDone: [
                      {
                        target: "init_pool",
                      },
                    ],
                    onError: [
                      {
                        target: "#domain.opened.adding.error",
                        actions: "assignProblem",
                      },
                    ],
                  },
                },
                init_pool: {
                  description: "Create Cognito user pool and add initial users",
                  meta: {
                    message: "Creating Cognito user pool",
                  },
                  invoke: {
                    src: "initPool",
                    onDone: [
                      {
                        target: "record",
                        actions: "assignPool",
                      },
                    ],
                    onError: [
                      {
                        target: "#domain.opened.adding.error",
                        actions: "assignProblem",
                      },
                    ],
                  },
                },
                record: {
                  invoke: {
                    src: "saveDomainRecord",
                    onDone: [
                      {
                        target: "#domain.opened.adding.get_cert",
                      },
                    ],
                  },
                },
              },
            },
    
 

            get_cert: {
              description: "Request AWS cert for the new subdomain",
              entry: ["incrementStep", assign({ counter: 60, limit: .6 })],
              exit: assign({progress: 0}),
              meta: {
                step: 3,
                message: "Requesting domain certificate",
              }, 
              initial: "tik",
              states: {
                tik: {
                  after: {
                    "1000": {
                      target: "#domain.opened.adding.get_cert.tok",
                      actions: ["decrementTick"],
                      internal: false,
                    },
                  },
                },
                tok: {
                  after: {
                    "1000": [
                      {
                        target: "#domain.opened.adding.get_cert.tik",
                        cond: "counterPositive",
                        actions: ["decrementTick"],
                        internal: false,
                      },
                      {
                        target: "#domain.opened.adding.get_cert.send_cert",
                        actions: [],
                        internal: false,
                      },
                    ],
                  },
                },
                send_cert: {
                  invoke: {
                    src: "sendCertRequest",
                    onDone: [
                      {
                        target: "#domain.opened.adding.validate_cert",
                        actions: "assignValidationInfo",
                      },
                    ],
                    onError: [
                      {
                        target: "#domain.opened.adding.error",
                        actions: "assignProblem",
                      },
                    ],
                  },
                },
              },
            },
 

            check_record_status: {
              description: "Check the status of the DNS validation record",
              meta: {
                step: 6,
                message: "Checking validation status",
              },
              entry: ["incrementStep", assign({ counter: 10, limit: .1 })],
              exit: assign({progress: 0}),
              initial: "tik",
              states: {
                tik: {
                  invoke: {
                    src: "loadCertStatus",
                    onDone: [
                      {
                        target: "tok",
                        cond: "counterPositive",
                        actions: "assignValidationChangeInfo",
                      },
                      {
                        target: "timeout",
                      },
                    ],
                    onError: [
                      {
                        target: "#domain.opened.adding.error",
                        actions: "assignProblem",
                      },
                    ],
                  },
                },
                tok: {
                  entry: "decrementTick",
                  after: {
                    "5500": [
                      {
                        target: "#domain.opened.adding.check_record_status.tik",
                        cond: "certStatusPending",
                        actions: [],
                        internal: false,
                      },
                      {
                        target: "#domain.opened.adding.success",
                        actions: [],
                        internal: false,
                      },
                    ],
                  },
                },
                timeout: {
                  meta: {
                    message: "The operation has timed out"
                  },
                  on: {
                    OK: {
                      target: "#domain.opened.adding.success",
                    },
                  },
                },
              },
            },


            success: {
              entry: "incrementStep",
              meta: {
                step: 7,
                message: "Done",
              },
              on: {
                OK: {
                  target: "#domain.opened.load",
                },
              },
            },
            error: {
              description: "In error state pause to show the error with no retry option",
              on: {
                OK: {
                  target: "#domain.opened.list",
                },
              },
            },

            
            validate_cert: {
              entry: "incrementStep",
              description: "Write validation record to Route 53 hosted zone",
              meta: {
                step: 5,
                message: "Writing validation to DNS server",
              },
              initial: "tik",
              states: {
                tik: {
                  meta: {
                    message: "Checking validation record state",
                  },
                  invoke: {
                    src: "loadRequestStatus",
                    onDone: [
                      {
                        target: "tok",
                        actions: "assignValidationInfo",
                      },
                    ],
                  },
                },
                tok: {
                  after: {
                    "5500": [
                      {
                        target: "#domain.opened.adding.validate_cert.tik",
                        cond: "emptyRecord",
                        actions: [],
                        internal: false,
                      },
                      {
                        target: "#domain.opened.adding.validate_cert.send_validation",
                        actions: [],
                        internal: false,
                      },
                    ],
                  },
                },
                send_validation: {
                  meta: {
                    message: "sending validation",
                  },
                  invoke: {
                    src: "sendValidationRequest",
                    onDone: [
                      {
                        target: "#domain.opened.adding.check_record_status",
                        actions: "assignValidationChangeInfo",
                      },
                    ],
                  },
                },
              },
            },

            create_record: {
              invoke: {
                src: "saveDomainRecord",
                onDone: [
                  {
                    target: "add_domain",
                    actions: "assignRecord",
                  },
                ],
              },
            },

            
            confirm: {
              description: "If form is dirty force confirm before closing",
              always: {
                target: "#domain.opened.list",
                cond: "isClean",
                actions: "clearRecord",
              },
              on: {
                OK: {
                  target: "#domain.opened.list",
                  actions: "clearRecord",
                },
                CANCEL: {
                  target: "info",
                },
              },
            },
            
            info: {
              entry: "incrementStep",
              description: "Show  a form to complete instance infirmation",
              meta: {
                step: 1,
                message: "Getting application details",
              },
              on: {
                CREATE: {
                  target: "create_record",
                },
                CHANGE: {
                  actions: ["applyChanges", assign({ dirty: true })],
                },
                CANCEL: {
                  target: "confirm",
                },
              },
            },



          },
        },
        load: {
          invoke: {
            src: "loadDomains",
            onDone: [
              {
                target: "list",
                actions: "assignDomains",
              },
            ],
          },
        },

        dropping: {
          initial: "tik",
          states: {
            tik: {
              entry: "updateSelected",
              invoke: {
                src: "dropDomain",
                onDone: [
                  {
                    target: "tok",
                  },
                ],
              },
            },
            tok: {
              after: {
                "5500": [
                  {
                    target: "#domain.opened.dropping.tik",
                    cond: "moreDrops",
                    actions: [],
                    internal: false,
                  },
                  {
                    target: "#domain.opened.load",
                    actions: [],
                    internal: false,
                  },
                ],
              },
            },
          },
        },

        editing: {
          initial: "show_form",
          states: {
            show_form: {
              description: "Display instance editing form",
              on: {
                SAVE: {
                  target: "saving",
                },
                CHANGE: {
                  actions: ["applyChanges", assign({ dirty: true })],
                },
                CANCEL: {
                  target: "confirm",
                  actions: assign({ selected: [] }),
                },
              },
            },
            saving: {
              meta: {
                message: "Saving changes",
              },
              invoke: {
                src: "saveDomainRecord",
                onDone: [
                  {
                    target: "#domain.opened.load",
                    actions: assign({ dirty: false }),
                  },
                ],
              },
            },
            confirm: {
              description: "Confirm  closing when there are unsaved changed",
              always: {
                target: "#domain.opened.list",
                cond: "isClean",
                actions: "clearRecord"
              },
              on: {
                OK: {
                  target: "#domain.opened.list",
                  actions:"clearRecord"
                },
              },
            },
          },
          on: {
            EDIT: {
              target: "editing",
              actions: "assignID",
            },
            DROP: {
              target: "dropping",
            },
          },
        },
      },
      on: {
        CLOSE: {
          target: "idle",
          actions: assign({ open: false }),
        },
      },
    },
  },
  context: {
    open: false, dirty: false, selected: [], step: -1, counter: 0, limit: 0
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    emptyRecord: context => !context.record.CertResourceRecord,
    counterPositive: context => context.counter > 1,
    isClean: context => !context.dirty,
    moreDrops: context => !!context.selected.length,
    domainStatusPending: context => context.record.DomainChangeInfoStatus !== 'INSYNC',
    certStatusPending: context => context.record.CertChangeInfoStatus !== 'INSYNC'
  },
  actions: {
    assignID: assign ((context, event) =>  ({
      ID: event.id,
      record: context.domains.find(f => f.Subdomain === event.id),
      selected: [event.id]
    })),
    incrementStep: assign ((context, event) =>  ({
      step: context.step + 1
    })),
    decrementTick: assign ((context, event) =>  ({
      counter: context.counter - 1,
      progress: 100 - (context.counter / context.limit)
    })),
    updateSelected: assign ((context, event) =>  {
      const { selected } = context;
      const drop = selected.pop();
      return {
        selected,
        drop
      }
    }),
    assignSelected: assign ((context, event) => ({
      selected: context.selected.find(f => f === event.id)
        ? context.selected.filter(f => f !== event.id)
        : context.selected.concat(event.id)
    })),
    assignName: assign ((_, event) => ({
      dirty: true,
      step: -1,
      record: {
        InstanceName: event.name,
        UserPoolName: "cognito_" + event.name.toLowerCase().replace(/\s/g, '_') + "_users",
        Subdomain: event.name.toLowerCase().replace(/\s/g, '-'),
        DbName: 'x_db_' + event.name.toLowerCase().replace(/\s/g, '_')
      }
    })),
    applyChanges: assign((context, event) => {
      const extra = event.key === 'InstanceName'
        ? {
          Subdomain: event.value.toLowerCase().replace(/\s/g, '-'),
          UserPoolName: "cognito_" + event.value.toLowerCase().replace(/\s/g, '_') + "_users",
          DbName: 'x_db_' + event.value.toLowerCase().replace(/\s/g, '_')
        }
        : {}
      return {
        dirty: 1,
        record: {
          ...context.record,
          [event.key]: event.value,
          ...extra
        }
      }
    }),
    assignRecord: assign ((_, event) => ({ 
      record: event.data
    })),
    clearRecord: assign ((_, event) => ({
      dirty: false,
      step: -1,
      ID: null,
      record: null
    })),
    assignProblem: assign ((_, event) => ({
      error: event.data.message,
      stack: event.data.stack
    })), 
    assignDomains: assign ((_, event) => ({
      domains: event.data
    })), 
    assignValidationInfo: assign ((context, event) => {
      const { record } = context;
      const { CertificateArn, DomainValidationOptions } = event.data.Certificate;
      console.log ({ CertificateArn, DomainValidationOptions })
      if (!DomainValidationOptions) {
        return {
          record: { 
            ...record,
            CertificateArn, 
          }
        }
      }
      return {
        record: { 
          ...record,
          CertificateArn,
          CertValidationStatus: DomainValidationOptions[0].ValidationStatus,
          CertResourceRecord: !DomainValidationOptions[0].ResourceRecord ? null : JSON.stringify(DomainValidationOptions[0].ResourceRecord)
        }
      }
    }),
    assignDomainChangeInfo: assign ((context, event) => {
      const { record } = context;
      const { ChangeInfo } = event.data;
      return {
        record: {
          ...record,
          DomainChangeInfoId: ChangeInfo?.Id,
          DomainChangeInfoStatus: ChangeInfo?.Status,
          DomainChangeInfoDate: ChangeInfo?.SubmittedAt,
        } 
      }
    }),
    assignPool: assign ((context, event) => ({
      record: {
        ...context.record,
        UserPoolId: event.data.Id
      }
    })),
    assignPing: assign((_, event) => ({
      hello: event.data
    })),
    assignValidationChangeInfo: assign ((context, event) => {
      
      const { record } = context; 

      const { ChangeInfo } = event.data;
      console.log ({ ChangeInfo })
      return {
        record: { 
          ...record,
          CertChangeInfoId: ChangeInfo?.Id,
          CertChangeInfoStatus: ChangeInfo?.Status,
          CertChangeInfoDate: ChangeInfo?.SubmittedAt
        }
      }
    }),
  }
});

export const useDomain = () => {
  const [state, send] = useMachine(domainMachine, {
    services: {
      saveDomainRecord: async (context) =>  {
        const { record } = context;
        const { rows } = await api.setInstance(record);
        return {
          ...record,
          ID:  record.ID || rows.insertId
        }
      }, 
      dropDomain: async (context) =>  {
        return await api.unsetInstance(context.drop);
      }, 
      sendValidationRequest: async (context) =>  {
        const { CertResourceRecord } = context.record;
        const record = JSON.parse(CertResourceRecord);
        return await api.validateCertificate({
          record,
          hostedZoneId
        });
      },
      loadRequestStatus: async (context) =>  {
        const { CertificateArn } = context.record; 
        return await api.getCertificateStatus({ certificateArn: CertificateArn });
      },
      loadCertStatus: async (context) =>  {
        try {
          const { CertChangeInfoId } = context.record;
          if (!CertChangeInfoId) return {};
  
          const id = CertChangeInfoId.split('/').pop()
          return await api.getDomainChangeState(id);
        } catch (ex) {
          return {}
        }
      }, 
      commitDomain: async (context) =>  {
        const { record } = context;
        const res = await api.createAmplifyDomain(record.Subdomain);


        console.log ({
          res 
        })
        // if (!res.ChangeInfo) {
        //   console.log (res)
        //  throw new Error("There was a problem with the request. Check the console")
        // }
        return res;
      },
      sendCertRequest: async (context) =>  {
        const { record } = context;
        return await api.requestCertificate({
          subdomain: domainOf(record.Subdomain)
        });
      },
      initDb: async (context) =>  {
        const { record } = context;
        return await api.createDatabase(record.DbName)
      },
      initPool: async (context) =>  {
        const { record } = context;
        return await api.initCognito(record.UserPoolName)
      },
      pingAPI: async () =>  {
        return await api.ping()
      },
      loadDomains: async () =>  {
        return await api.listAmplifyApps()
      },
     },
  }); 

  const handleChange = event => {
    send({
      type: 'CHANGE',
      key: event.target.name,
      value: event.target.value
    })
  }

  return {
    state,
    send, 
    handleChange,
    ...state.context
  };
}

const domainOf = str => `${str}.eventbuilder.pro`;
const hostedZoneId = "Z1L9HRKX5E86PJ";
