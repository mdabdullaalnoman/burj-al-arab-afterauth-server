const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
// console.log(process.env.DB_NAME);


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.bdvqy.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(bodyParser.json());


client.connect(err => {
const BookingCollection = client.db("burjAlArab").collection("booking-two");


app.get('/bookings' , (req , res ) => {
  console.log(req.headers.authorization);
  BookingCollection.find({email: req.query.email})
  .toArray((err , document ) => {
    res.send(document)
  })
});

app.post('/oneBooking' , (req, res) => {
  const newBooking = req.body;
  BookingCollection.insertOne(newBooking)
  .then(result => {
    res.send(result.insertedCount > 0);
  })
});



});

app.get('/', (req , res ) => {
  res.send('connected')
 })


app.listen(4200, () => {
  console.log('losting to port 4200')
});