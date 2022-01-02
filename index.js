const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvd1e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("players").collection("cricket");
  // perform actions on the collection object
  app.post('/api/addPlayer', (req, res) => {
      const data = req.body;
      collection.insertOne(data)
      .then(result => {
          res.send(result.insertCount > 0);
      })
  })
  app.get('/api/players', (req, res) => {
    collection.find({}).sort({ highScore: -1 })
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  // filter Specific name
 app.get('/api/:nickname', (req, res) => {
    collection.find({}).filter({ nickname: req.params.nickname })
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
});

app.get('/', (req, res) =>{
    res.send('working...');
})

app.listen(process.env.PORT || port);