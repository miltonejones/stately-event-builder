# State Machine Description: User Profile Form

## State Machine ID
"profile"

## Context
- "open": "false"

## Initial State
"idle"

## States

### idle
- On event "OPEN":
    - Transition to state "opened"
    - Actions:
        - "assignUser"
        - "assign({open: true})"

### opened
- Description: Show user form for editing profile
- Initial state: "load"
- States:
    - load:
        - Invoke "loadUser" function
        - On done:
            - Transition to state "ready"
            - Action: "curateUser"
    - ready:
        - On event "SAVE":
            - Transition to state "#profile.saving"
        - On event "CHANGE":
            - Action: "applyChanges"
        - On event "JSON":
            - Transition to state "#profile.json"
    - json:
        - On event "EXIT":
            - Transition to state "#profile.opened.ready"
- On event "CLOSE":
    - Transition to state "idle"
    - Action: "assign({open: false})"

### saving
- Initial state: "save"
- States:
    - save:
        - Invoke "saveUser" function
        - On done:
            - Transition to state "emit"
    - emit:
        - Invoke "emitSave" function
        - On done:
            - Transition to state "#profile.idle"
            - Action: "assign({open: false})"

### json
- On event "EXIT":
    - Transition to state "#profile.opened.ready"
