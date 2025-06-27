const {SkyWayAuthToken, nowInSec} = require("@skyway-sdk/token");
const crypto = require('crypto');
const express = require('express');

const appId = process.env.SKYWAY_APP_ID ?? 'PASTE_YOUR_APP_ID';
const secretKey = process.env.SKYWAY_SECRET_KEY ?? 'PASTE_YOUR_SECRET_KEY';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/authenticate', (req, res) => {
  const roomName = req.body.roomName;
  const memberName = req.body.memberName;
  const sessionToken = req.body.sessionToken;

  if (roomName === undefined || memberName === undefined || sessionToken === undefined) {
    res.status(400).send('Bad Request');
    return;
  }

  // Check the sessionToken for your app.
  if (sessionToken !== '4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID') {
    res.status(401).send('Authentication Failed');
    return;
  }

  const currentTime = nowInSec();
  const iat = currentTime;
  const exp = currentTime + 10 * 60 * 60; // 10h

  const authToken = calculateAuthToken(roomName, memberName, iat, exp);

  const credential = {
    roomName: roomName,
    memberName: memberName,
    iat: iat,
    exp: exp,
    authToken: authToken
  };

  res.send(credential);
})

const calculateAuthToken = (roomName, memberName, iat, exp) => {
  return new SkyWayAuthToken({
    jti: crypto.randomUUID(),
    iat: iat,
    exp: exp,
    version: 3,
    scope: {
      appId,
      turn: {
        enabled: true
      },
      analytics: {
        enabled: true
      },
      rooms: [
        {
          id: '*',
          name: roomName,
          methods: ['create', 'close', 'updateMetadata'],
          sfu: {
            enabled: true,
            maxSubscribersLimit: 99
          },
          member: {
            id: '*',
            name: memberName,
            methods: ['publish', 'subscribe', 'updateMetadata']
          }
        }
      ]
    }
  }).encode(secretKey);
};

app.listen(8080, (error) => {
  if (error) {
    console.error('Error starting server:', error);
    return;
  }

  console.log('Server is running on http://localhost:8080');
})
