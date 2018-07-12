const {TWILIO_ACCOUNT_SID, TWILIO_TOKEN} = require('../config/environment');
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_TOKEN);

function sendSMS(body, tel) {
  client.messages
    .create({
      body: body,
      from: '+441915803740',
      to: tel
    })
    .then(message => console.log(message.sid))
    .done();
}

module.exports = {sendSMS};
