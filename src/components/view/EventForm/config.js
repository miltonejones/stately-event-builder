export const formProps = [
  {
    label: "Event Name",
    auto: 1,
    field: "EventName",
  },
  {
    label: "Room(s)",
    field: "rooms",
    type: "rooms",
  },

  {
    label: "Event Date",
    field: "EventDate",
    type: "date",
    xs: 4,
  },
  {
    prefix: "Start Time",
    field: "EventStartTime",
    type: "time",
    xs: 4,
  },
  {
    prefix: "End Time",
    field: "EventEndTime",
    type: "time",
    xs: 4,
  },

  {
    prefix: "Repeats",
    field: "RecurseType",
    icon:"CalendarToday",
    none: 'Does not repeat',
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
  },
  {
    prefix: "Setup Start",
    field: "SetupStartTime",
    type: "time",
    xs: 4,
  },
  {
    prefix: "Setup End",
    field: "SetupEndTime",
    type: "time",
    xs: 4,
  },

  {
    label: "DateRange",
    field: "range",
    type: "range",
    rows: 3,
  },

  {
    label: "Comments",
    field: "Comments",
    rows: 3,
  },
];
