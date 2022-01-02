const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var http = require('https');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config();
const port = 5000;


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvd1e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const playerCollection = client.db("players").collection("cricket");

  console.log('connected');
  // perform actions on the collection object
  app.post('/addPlayer', (req, res) => {
      const player = req.body;
      playerCollection.insertOne(player)
      .then(result => {
          res.send(result.insertCount > 0);
      })
  })

  app.get('/players', (req, res) => {
    playerCollection.find({}).sort({ highScore: -1 })
   .toArray((err, documents) => {
     res.send(documents);
   })
 })

 // filter Specific name
 app.get('/:nickname', (req, res) => {
   playerCollection.find({}).filter({ nickname: req.params.nickname })
   .toArray((err, documents) => {
     res.send(documents);
   })
 })
 client.close();
});

app.get('/', (req, res) => {
  res.send('I am working...');
})

app.listen(process.env.PORT || port);