const express = require('express');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("arDB").collection("modelMarkers");

  app.use(express.static('public'));
  app.use(express.json());

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'model') {
        cb(null, 'public/models');
      } else {
        cb(null, 'public/markers');
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  app.get('/host', (req, res) => {
    res.sendFile(__dirname + '/public/host.html');
  });

  app.post('/upload', upload.fields([{ name: 'model' }, { name: 'marker' }]), (req, res) => {
    const model = req.files['model'][0];
    const marker = req.files['marker'][0];

    const modelMarkerData = {
      modelPath: '/models/' + model.filename,
      markerPath: '/markers/' + marker.filename
    };

    collection.insertOne(modelMarkerData, (err, result) => {
      if (err) throw err;
      res.json(modelMarkerData);
    });
  });

  app.get('/getModels', (req, res) => {
    collection.find({}).toArray((err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});