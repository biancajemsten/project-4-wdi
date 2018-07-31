# WDI 34 project 4 - CheckIt <p display= "inline" style="float: right"><img src="./src/assets/images/checklogo.png" width="50"></p>
### A MERN Stack App
##### by Bianca Jemsten, Martin Koeoep and Richard Tzanov
---

#### Overview
CheckIt is an application that allows users to organize an event and suggest time slots to its chosen invitees. Users invited to the event receive a push notification and can then vote on the most suitable time slots for them. Given the votes, the organizer can then set a final time which attendees are notified of via text message.  

#### Before using the app

- Use Chrome v68.0.3440.70 to ensure features work as intended
- Make sure you’re on the HTTPS version of the site
- Enable pop-ups


#### Technologies used

||||
|--- |--- |--- |
|React|JavaScript(ECMAScript6)|SCSS|
|GitHub|Bulma|MongoDB|
|Node.js|Express.js|Webpack|
|Chai|Enzyme|Nyc|
|Mocha|Yarn|Supertest|
|web-push|filestack-js|bcrypt|
|jsonwebtoken|bluebird|axios|
|body-parser|file-loader|moment|

#### Third party APIs
The application uses three third party APIs. Google Maps is used on the event show page to indicate to the user where the event takes place. When creating an event, we have implemented Filestack to enable the user to upload a photo. Lastly, twilio is used to send out notifications to users who have been invited to an event as well as notifying them when the final time for an event has been set.

*Please note that we have currently commented out the code that enables twilio. The reason for this is that we are using a trial account which requires us to register all phone numbers with twilio. The function would work for a paid account but we have decided to disable the code for now.*

#### Build process

The project started with the group discussing the initial plans for the project such as first features, looking into APIs we could use and planning out models for the database.

Thereafter we set up wireframes to describe the user-journey through the entire stay on the website:
from registering
to creating an event,
to voting on different time slots,
to the event creator deciding on the final times of the event.

The next step was to set up our Trello board. And to create feature-focused cards. Every card represented a smallest individual feature to be worked on.

From the get go we decided to design the application mobile first. Therefore it is fully mobile responsive and functional on all devices.

Coding started from the back end, once again completing smallest feature possible, and then testing it, before pushing it to the development branch. The initial setup of the processes was fairly straightforward and simple. The developer picked a trello card, assigned it to themselves, and then they proceeded to write the code for it.

When the project reached more challenging stages, it was common for developers in this to pair up, to hasten the process.

And once more, every feature was tested pushed to development.


#### The user experience

The user can have two roles on the site - they can be an organizer or an invitee. The experience looks somewhat different for the two and it will also depend on if the event is public or private.

<table>
  <th><p align="center"><img src="https://i.imgur.com/OeXsjyT.png" width="500"></p></th>
  <th><p align="center"><img src="https://i.imgur.com/HjhgDYY.png" width="500"></p></th>
</table>


**Creating the event.** As an organizer, you create and edit the event in a form. The form uses react-datepicker to populate a calendar where the user can pick a date and a time that can then be added as a timeslot for users to vote on. The timeslot can easily be removed by clicking the small x. The location uses Google Autocomplete to fetch suggestions of addresses based on the user input. The invitees is a list of users on the site. When the organizer selects a user, their endpoint browser as well as their phone number used in the create-process of the event in order to notify them via text and push notification. The organizer can also set the privacy level of the event on the form. Lastly, images can be uploaded with filestack-react.

<p align="center"><img src="https://i.imgur.com/D6oJvJS.png" width="700"></p>

<p align="center"><img src="https://i.imgur.com/0Aj1wVQ.png" width="700"></p>


**Viewing events.** If the event is public, it will show up on the `Public Events` page where anyone can view it. If the event is private, however, it will only show up on the organizer’s and the invitees’ `My Events` page where they can view all events they have created and been invited to. The list items are direct links to the show page of each event.

**Joining an event.** If the user is not invited to the event, but the event is set to public, we’ve given the user the ability to request to join the event. Upon clicking `Request to Join` button, the creator of the event will see, at the bottom of the event page a small table, that contains the name of the user that requested to join and two buttons, to accept or decline the request.
If the creator clicks Accept, the user is included as an invitee to the event, giving them access to rest of the information about the event, which are time slots and location, as well as the ability to vote on their preferred time slot.
If the creator declines the request, then the user is simply removed from the process.

<p align="center"><img src="https://i.imgur.com/t5L4Gha.gif" width="700"></p>

**Voting process.** The invitees as well as the organizer can view the event and vote on the time slots that are the most convenient for them. They simply click `Vote` on each slot they want to select and then click Submit votes at the bottom. If the user is also the organizer there will be two buttons. One for voting and one for picking the final time.

<p align="center"><img src="https://i.imgur.com/7CPwFaq.gif" width="700"></p>

**Choosing final times.** When the organizer is satisfied with the amount of votes received, he may choose to click the button `Pick Date` on one or more chosen time slots.
When the organizer has selected and submitted the final times of the event, the layout of the page changes to only display the final times instead of all choices. The submission also notifies the invited users with an SMS that the final times for the event have been chosen, reminding them to attend at the right time and location.


#### Challenges

The biggest challenge we found when building the app came a few days into the project when we realised that we had created a lot of WET code, all within large single files. The Events Show component, where the bulk of the app’s “work” is done, was particularly bloated and messy.

This was caused by a combination of trying to familiarise ourselves with React and component-based development during the project, and also a general approach of solving a problem and then moving on to the next, rather than refactoring what we had done before trying to tackle the next problem.

What this meant was that the last couple of days on the project were spent almost entirely on refactoring the code, transferring the majority of the data manipulation on to the back-end, and dividing the front-end code into modules to make it more readable and easier to debug. This process taught us a lot about the benefits of refactoring code as you go, and of making React as modular as possible.

Related to this was the issue of feature-bloat. As we moved quite quickly through the initial build, we kept coming up with extra functionality we wanted to add to do with the types of events, how those events were accessed by different users, different types of notifications, etc. An important part of the learning process for us was realising the essentials necessary to get an app working and focusing on making those function as smoothly as possible.

The final major challenge we faced was working with Date and the Event model. As the entire app is driven by the dates and times for events, storing and formatting dates correctly was essential. Moment.js was invaluable for this, as was coming to understand that the best way to store the Date data was unformatted on the model, then using virtuals to render it how we wanted before sending it to the front-end. This was an ongoing process, as there were lots of different ways we wanted to use the event times, from listing all the times for a single day under one date heading to storing which dates had been voted on and then displaying the final times to the user.


#### What's next
If we were to return to the project we would include Nodemailer, Google Calendar and/or iCalendar events, to ensure that the user is contacted via a method that is preferable to them, rather than only having the ability to be contacted by SMS or visiting the website.

Additionally, using Geolocation we would want to include directions, so that the user could simply open up the event and be shown quickest way to the event from their current location.

The project itself is open-ended and simple enough in concept that it allows for different kinds of additions and improvements even later down the line.

<p align="center"><img src="https://i.imgur.com/u52P9kA.gif" width="700"></p>
