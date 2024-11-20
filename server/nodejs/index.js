const jwt = require('jsonwebtoken');
const express = require('express');
const crypto = require('crypto');

const appId = 'YourAppId'; // replace with your app id from SkyWay Console
const secretKey = 'YourSecretKey'; // replace with your own secret key from SkyWay Console

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
  if (sessionToken != '4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID') {
    res.status(401).send('Authentication Failed');
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = Math.floor(Date.now() / 1000) + 36000; // 10h

  const credential = {
    roomName: roomName,
    memberName: memberName,
    iat: iat,
    exp: exp,
    authToken: calculateAuthToken(roomName, memberName, iat, exp)
  };

  res.send(credential);
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening on port ${listener.address().port}`);
});

const calculateAuthToken = (roomName, memberName, iat, exp) => {
  return jwt.sign({
    jti: crypto.randomUUID(),
    iat: iat,
    exp: exp,
    version: 3,
    scope: {
      appId: appId,
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
  }, secretKey);
};
