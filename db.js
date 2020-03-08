const pg = require("pg");

const Sequelize = require("sequelize");
const conn = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/acme_nouns");

const Person = conn.define("person", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  }
});
const Place = conn.define("place", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  }
});
const Thing = conn.define("thing", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  }
});

Person.belongsTo(Place);
Thing.belongsTo(Person);

const sync = async () => {
  await conn.sync({ force: true });

  const [Brooklyn, Manhattan, Queens] = await Promise.all([
    Place.create({ name: "brooklyn" }),
    Place.create({ name: "manhattan" }),
    Place.create({ name: "queens" })
  ]);

  const [Mark, Lindsey, Denis] = await Promise.all([
    Person.create({ name: "mark", placeId: Brooklyn.id }),
    Person.create({ name: "lindsey", placeId: Manhattan.id }),
    Person.create({ name: "denis", placeId: Queens.id })
  ]);

  const [Coffee, Computer, Bagel] = await Promise.all([
    Thing.create({ name: "coffee", personId: Lindsey.id }),
    Thing.create({ name: "computer", personId: Denis.id }),
    Thing.create({ name: "bagel", personId: Mark.id })
  ]);
};

const createPerson = async (name, placeId) => {
  const newPerson = await new Promise((resolve, reject) => resolve(Person.create({ name: name, placeId: placeId })));
  return newPerson;
};
const createPlace = async name => {
  const newPlace = await new Promise((resolve, reject) => resolve(Place.create({ name: name })));
  return newPlace;
};
const createThing = async (name, personId) => {
  const newThing = await new Promise((resolve, reject) => resolve(Thing.create({ name: name, personId: personId })));
  return newThing;
};

module.exports = {
  sync,
  models: {
    Person,
    Place,
    Thing
  },
  createPerson,
  createPlace,
  createThing
};
