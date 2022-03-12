const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// ----------------------------------------- //
// ----------------- vars ------------------ //
// ----------------------------------------- //
const app = express();
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'; // from script
const IS_PREPROD = process.env.IS_PREPROD; // only declared in the remote preprod server
const SERVER_PORT = process.env.PORT || 8080;
const FORCE_PROD = false;

// ----------------------------------------- //
// --------------- load envs --------------- //
// ----------------------------------------- //
let envFileName;
let serverUrl;
const localHostName = 'http://localhost:' + SERVER_PORT;

if (IS_DEVELOPMENT && !FORCE_PROD) {
  console.log('[ENV]:', 'dev');
  envFileName = '.env.local';
  serverUrl = localHostName;
} else {
  // load prod .env in local
  if (FORCE_PROD) {
    console.log('[ENV]:', 'forceProd');
    serverUrl = localHostName;
    envFileName = '.env.prod';
  /** same prod env but different server */
  }  else if (IS_PREPROD) {
    console.log('[ENV]:', 'preprod');
    envFileName = '.env.local';
    serverUrl = 'https://noteo-preprod.herokuapp.com/'; // temporary
  } else {
    console.log('[ENV]:', 'prod');
    envFileName = '.env.prod';
    serverUrl = 'https://www.noteo.com'; // temporary
  }
}

dotenv.config({
  path: path.resolve(__dirname, envFileName)
});

// ----------------------------------------- //
// -------------- express app -------------- //
// ----------------------------------------- //
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// the client build folder should be served by the server as static (like images, ...)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(SERVER_PORT, (err) => {
  if (err) throw err;
  console.log(`Server run on ${serverUrl}`);
});

// 005 sign-up in heroku and make some configurations