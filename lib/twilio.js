const {TWILIO_ACCOUNT_SID, TWILIO_TOKEN} = require('../config/environment');
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_TOKEN);

function sendSMS() {
  client.messages
    .create({
      body: 'HAAAAJ',
      from: '+441915803740',
      to: '+447762948257'
    })
    .then(message => console.log(message.sid))
    .done();
}

module.exports = {sendSMS};
