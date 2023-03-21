
import moment from 'moment';

export const daytimerOptions = () => { 

  const sunday = moment().startOf('week').format('YYYY-MM-DD');
  const monday = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
  const friday = moment().startOf('week').add(5, 'days').format('YYYY-MM-DD');
  const saturday = moment().startOf('week').add(6, 'days').format('YYYY-MM-DD');

  return  {
    today: {
      icon: "Today",
      params: {
        start_date: moment().format('YYYY-MM-DD')
      }
    },
    weekdays: {
      icon: "DateRange",
      params: { 
        start_date: monday,
        end_date: friday
      }
    },
    week: {
      icon: "ViewWeek",
      params: {
        start_date: sunday,
        end_date: saturday
      }
    }
  }

}