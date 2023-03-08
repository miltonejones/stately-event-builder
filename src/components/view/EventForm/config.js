export const formProps = [
  {
    label: 'Event Name',
    auto: 1,
    field: 'EventName'
  },
  {
    label: 'Room Name',
    field: 'RoomID',
    type: 'rooms',
  },


  {
    label: 'Event Date',
    field: 'EventDate',
    type: 'date',
    xs: 4
  },
  {
    label: 'Start Time',
    field: 'EventStartTime',
    type: 'time',
    xs: 4
  },
  {
    label: 'End Time',
    field: 'EventEndTime',
    type: 'time',
    xs: 4
  },


  {
    label: 'Type',
    field: 'RecurseType', 
    types: [ 'daily', 'weekly', 'monthly', 'monthly (by day)', 'yearly', 'weekdays', !1, 'various' ], 
    xs: 4
  },
  {
    label: 'Setup Start Time',
    field: 'SetupStartTime',
    type: 'time',
    xs: 4
  },
  {
    label: 'Setup End Time',
    field: 'SetupEndTime',
    type: 'time',
    xs: 4
  },

  {
    label: 'Comments',
    field: 'Comments',
    rows: 3, 
  },


]