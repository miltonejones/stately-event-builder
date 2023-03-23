
import moment from 'moment';

 

const dayof = (when, offset) => when.startOf('week').add(offset, 'days').format('YYYY-MM-DD');

export const daytimerOptions = (parameters = {}) => { 

  const now  = () => parameters.start_date ? moment(parameters.start_date) : moment()
  const today = moment().format('YYYY-MM-DD');
  const day = now().format('YYYY-MM-DD');
  const sunday = dayof(now(), 0)
  const monday = dayof(now(), 1)
  const friday = dayof(now(), 5)
  const saturday = dayof(now(), 6) 

  const notNow = !!parameters.start_date && parameters.start_date !== today;

  const options = {
    day: {
      active: (parameters.start_date === day && !parameters.end_date) || 
      !parameters.start_date,
      icon: "Today",
      offset: 'days',
      params: {
        start_date: day
      }
    },
    weekdays: {
      active: parameters.start_date === monday && parameters.end_date  === friday,
      icon: "DateRange",
      offset: 'weeks',
      params: { 
        start_date: monday,
        end_date: friday
      }
    },
    week: {
      active: parameters.start_date === sunday && parameters.end_date  === saturday,
      icon: "ViewWeek",
      offset: 'weeks',
      params: {
        start_date: sunday,
        end_date: saturday
      }
    }
  };

  if (notNow) {
    Object.assign(options,  {
      today: {
        icon: "Schedule",
        offset: "days",
        params: {
          start_date: today
        }
      }
    })
  }



  const addons = ['yesterday', 'tomorrow'];

  return  Object.keys(options).reduce((out, key) => {
    const option = options[key]
    const { params, offset } = option;
    const { start_date, end_date } = params;


    [-1, 1].map((off, index) => {

      const next_start = moment(start_date)
        .add(off, offset)
        .format('YYYY-MM-DD');

      const next_end = moment(end_date)
        .add(off, offset)
        .format('YYYY-MM-DD');

      const addon = {
        start_date: next_start,
      }
      
      !!end_date && Object.assign(addon, {
        end_date: next_end
      })

      return Object.assign(option, {
        [addons[index]]: addon
      }) 
    })


    out[key] = option
    return out;
  },  {});

}