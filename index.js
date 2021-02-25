const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;
require('dotenv').config();
// console.log(process.env.DB_NAME);


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.bdvqy.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(bodyParser.json());


var serviceAccount = require("./burj-al-arab-after-auth-49-firebase-adminsdk-z3hey-cb11967b3a.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-after-auth-49.firebaseio.com"
});


client.connect(err => {
  const BookingCollection = client.db("burjAlArab").collection("bookings");

// get bookings data by the email and jwt token
  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      // idToken comes from the client app
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          if (tokenEmail == req.query.email) {
            BookingCollection.find({ email: req.query.email })
              .toArray((err, document) => {
                res.send(document)
              })
          }
          else {
            res.send('unauthrige user')
          }
        })
        .catch((error) => {
          // Handle error
        });

    }
    else {
      res.send('unauthrige user')
    }

  });

  app.post('/oneBooking', (req, res) => {
    const newBooking = req.body;
    BookingCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  });



});

app.get('/', (req, res) => {
  res.send('connected')
})

app.listen( port,()=>console.log(`connected database server${port}`));