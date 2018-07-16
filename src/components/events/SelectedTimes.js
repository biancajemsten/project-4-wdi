import React from 'react';
import moment from 'moment';

const SelectedTimes = ({ event }) => {

  //checks the date of the column with the date of the timeSlot
  const filterStartTime = (date, i) => {
    if(event.finalTimes.length > 0){
      if(date === moment(event.finalTimes[i]).format('ddd, MMM Do')) return true;
    } else{
      if(date === moment(event.timeSlots[i].date).format('ddd, MMM Do')) return true;
    }
  };

  const columnCounter = () => {
    if(event.finalTimes.length > 0) {
      return event.finalEventDates.length > 1;
    } else{
      return event.eventDates.length > 1;
    }
  };

  const getFormattedTime = (time) => {
    return moment(time).format('HH:mm') + '-' + moment(time).add(event.length, 'minutes').format('HH:mm');
  };

  return (
    <div>
      <h2 className="title is-2">Selected Times</h2>
      <div className="columns is-full is-mobile is-multiline">
        {event.finalEventDates.map((date, i) =>
          <div key={i} className={`column dateColumn${columnCounter() ? ' is-half-mobile' : ' is-full-mobile'}`}>
            <div className="columns is-multiline">
              <div className="column is-full">
                <h6 className="title is-6">{date}</h6>
              </div>
              {event.finalTimes.map((time, i) => filterStartTime(date, i) &&
                <div className="timeSlotDiv column is-one-third-desktop is-full-mobile is-full-tablet" key={i}>
                  <p>
                    <strong>Time: </strong> {getFormattedTime(time)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedTimes;
