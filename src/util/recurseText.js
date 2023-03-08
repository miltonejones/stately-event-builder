import moment from "moment";

const dateNormalize = (date) => {
  const [text] = date.split("T");
  const regex = /(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (regex) {
    const [_, year, month, day] = regex;
    return `${month}-${day}-${year}`;
  }
  return date;
};

export const recurseText = (ev) => {
  const date = dateNormalize(ev.EventDate);
  const last = dateNormalize(ev.RecurseEndDate);
  const startDate = moment(new Date(date).getTime());
  const dayNumber = Math.floor(new Date(date).getDate() / 7);
  const endDate = moment(new Date(last).getTime());
  const caption = [""];
  const s = ev.RecurseUnit === 1 ? "" : "s";

  const dayLabel = ["1st", "2nd", "3rd", "4th", "5th"];
  const whichday = dayLabel[dayNumber];

  const func = [
    {
      label: "day" + s,
    },
    {
      label: "week" + s,
      middle: " on ",
      suffix: `${startDate.format("dddd")}`, //--${date}!!!`,
    },
    {
      label: "month" + s,
      middle: " on the ",
      suffix: `${startDate.format("Do")}`,
    },
    {
      label: "month" + s,
      middle: " on the ",
      suffix: `${whichday} ${startDate.format("dddd")}`,
    },
    {
      label: "year" + s,
    },
    {
      label: "weekday" + s,
      middle: " (M-F)",
    },
    {},
    {
      label: "['Various dates']",
    },
  ];

  return {
    ...func[ev.RecurseType],
    until: endDate.format("MMM Do YY"),
  };
};
