const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const connectionString =
  "mongodb+srv://GameJam:2C89JolF3nPPJQZR@gamejam.4yqqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(express.json({ limit: "10mb" }));

const whitelist = ["https://itch.io/"];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to DB");

    const db = client.db("GameJam");
    const scoresCollection = db.collection("GJ");

    app.get("/", (req, res, next) => {
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
          userName: body.username,
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
