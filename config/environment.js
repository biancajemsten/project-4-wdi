const env = process.env.NODE_ENV || 'dev';
const dbURI = `mongodb://localhost:27017/worldwide-${env}`;
const port = 4000;
const secret = 'Xy.Two-und-h4lf-T0w3rs';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;


module.exports = { dbURI, port, secret, TWILIO_ACCOUNT_SID, TWILIO_TOKEN };
