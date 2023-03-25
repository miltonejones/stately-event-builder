export const formProps = [
  // {
  //   label: "Event Name",
  //   auto: 1,
  //   field: "EventName",
  // },
  {
    label: "Room(s)",
    field: "rooms",
    type: "rooms",
    logo: "Room"
  },

  {
    label: "Event Date",
    field: "EventDate",
    type: "date",
    xs: 4,
    logo: "AccessTime"
  },
  {
    label: "Start Time",
    field: "EventStartTime",
    type: "time",
    xs: 2,
  },
  {
    label: "End Time",
    field: "EventEndTime",
    type: "time",
    xs: 2,
  },

  {
    label: "DateRange",
    field: "setup",
    type: "setup",
    xs: 3,
  },

  {
    // prefix: "Repeats",
    field: "RecurseType",
    icon:"CalendarToday",
    none: 'Does not repeat',
    label: "Repeats",
    types: [
      "daily",
      "weekly",
      "monthly",
      "monthly (by day)",
      "yearly",
      "weekdays",
      !1,
      "various",
    ],
    xs: 4,
    logo: "Sync"
  },
  // {
  //   prefix: "Setup Start",
  //   field: "SetupStartTime",
  //   type: "time",
  //   xs: 4,
  // },
  // {
  //   prefix: "Setup End",
  //   field: "SetupEndTime",
  //   type: "time",
  //   xs: 4,
  // },

  {
    label: "DateRange",
    field: "range",
    type: "range",
    xs: 8, 
    rows: 3,
  },

  {
    label: "Comments",
    field: "Comments",
    logo: "Comment",
    rows: 3,
  },
];
