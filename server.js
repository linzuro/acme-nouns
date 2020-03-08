const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const db = require("./db");
const { Person, Place, Thing } = db.models;

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/people", (req, res, next) => {
  Person.findAll()
    .then(people => res.send(people))
    .catch(next);
});
app.get("/api/places", (req, res, next) => {
  Place.findAll()
    .then(places => res.send(places))
    .catch(next);
});
app.get("/api/things", (req, res, next) => {
  Thing.findAll()
    .then(things => res.send(things))
    .catch(next);
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
  app.listen(port, () => console.log(`listening on port${port}`));
});
