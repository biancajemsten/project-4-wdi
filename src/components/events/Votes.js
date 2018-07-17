import React from 'react';
import Auth from '../../lib/Auth';
import moment from 'moment';

const Votes = ({ event, handleVote, handlePickDate, handleConfirmFinalTimes, handleVoteSubmit, selectedTimeSlots }) => {
  const checkUserIsOrganizer = () => {
    return Auth.isAuthenticated() && Auth.getPayload().sub === event.organizer._id;
  };

  const checkUserAttending = () => {
    return Auth.isAuthenticated() && event.attendees.includes(Auth.getPayload().sub);
  };

  const checkUserIsInvitee = () => {
    return Auth.isAuthenticated() && event.invitees.some(invitee => invitee._id === Auth.getPayload().sub);
  };

  const isVoted = (slotId) => selectedTimeSlots.includes(slotId);

  const isPicked = (date) => event.finalTimes.includes(date);

  const columnCounter = () => {
    if(event.finalTimes.length > 0) {
      return event.finalEventDates.length > 1;
    } else{
      return event.eventDates.length > 1;
    }
  };

  //checks the date of the column with the date of the timeSlot
  const filterStartTime = (date, i) => {
    if(event.finalTimesChecker){
      return date === moment(event.finalTimes[i]).format('ddd, MMM Do');
    } else{
      return date === moment(event.timeSlots[i].date).format('ddd, MMM Do');
    }
  };

  return (
    <div>
      {!event.finalTimesChecker && (checkUserIsInvitee() || checkUserIsOrganizer() || checkUserAttending()) &&
        <div className="columns is-mobile is-multiline">

          {event.eventDates.map((date, i) =>
            <div key={i} className={`column dateColumn${columnCounter() ? ' is-half-mobile' : ' is-full-mobile'}`}>
              <div className="columns is-multiline">

                <div className="column is-full">
                  <h6 className="title is-6">{date}</h6>
                </div>

                {event.timeSlots.map((timeSlot, i) => filterStartTime(date, i) &&
                  <div className="timeSlotDiv column is-one-third-desktop is-full-mobile is-full-tablet" key={i}>
                    {isVoted(timeSlot._id) && <div>
                      <img className="checkIcon" src="/assets/images/checklogo.png"/>
                    </div>}

                    <strong>Time: </strong>
                    <p>{timeSlot.startTime} - {timeSlot.endTime}</p>
                    <p><strong>Votes:</strong> {timeSlot.votes.length}</p>

                    {!checkUserAttending() &&
                      <button
                        className={`button${isVoted(timeSlot._id) ? ' selected' : ''}`}
                        onClick={() => handleVote(timeSlot._id)}
                      >
                        {isVoted(timeSlot._id) ? 'Selected' : 'Vote'}
                      </button>
                    }
                    {checkUserIsOrganizer() &&
                      <button
                        className={`button${isPicked(timeSlot.date) ? ' selected' : ''}`}
                        onClick={() => handlePickDate(timeSlot.date)}
                      >
                        {isPicked(timeSlot.date) ? 'Selected' : 'Pick Date'}
                      </button>
                    }
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      }
      <div className="buttonDiv">
        {!event.finalTimesChecker && event.finalTimes.length > 0 &&
          <button className="button" onClick={handleConfirmFinalTimes}>Confirm Times</button>
        }
        {!checkUserAttending() && !event.finalTimesChecker && (checkUserIsInvitee() || checkUserIsOrganizer()) &&
          <button className="button" onClick={handleVoteSubmit}>Submit Votes</button>
        }
      </div>
    </div>
  );
};

export default Votes;
