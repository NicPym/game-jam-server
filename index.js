const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const connectionString =
  "mongodb+srv://GameJam:2C89JolF3nPPJQZR@gamejam.4yqqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(express.json({ limit: "10mb" }));

MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to DB");

    const db = client.db("GameJam");
    const scoresCollection = db.collection("GJ");

    app.get("/score", (req, res, next) => {
      res.status(200).send();
    });

    app.get("/score", (req, res, next) => {
      scoresCollection.find({}).toArray((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(
            result
              .map((doc) => `${doc.userName}|${doc.score}|${doc.dateTime}`)
              .join(",")
          );
        }
      });
    });

    app.post("/score", (req, res, next) => {
      const body = req.body;

      if (!(body.username && body.score)) {
        res.status(400).send();
      }

      scoresCollection
        .insertOne({
          username: body.username,
          score: body.score,
          dateTime: body.dateTime,
        })
        .then((result) => {
          res.status(200).send();
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send();
        });
    });

    app.listen(3000, function () {
      console.log("listening on http://localhost:3000");
    });
  }
);
