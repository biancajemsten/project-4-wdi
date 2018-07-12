const env = process.env.NODE_ENV || 'dev';
const dbURI = `mongodb://localhost:27017/worldwide-${env}`;
const port = 4000;
const secret = 'Xy.Two-und-h4lf-T0w3rs';
const TWILIO_ACCOUNT_SID = 'AC32169a93b810e066759357260571ecc5';
const TWILIO_TOKEN = 'f9aca213c0243708fe7ab8ee2109e47c';


module.exports = { dbURI, port, secret, TWILIO_ACCOUNT_SID, TWILIO_TOKEN };
