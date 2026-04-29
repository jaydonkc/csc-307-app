// backend.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import {
  addUser,
  deleteUserById,
  findUserById,
  findUsers,
} from "./services/user-service.js";

dotenv.config({ quiet: true });

const { MONGO_CONNECTION_STRING } = process.env;
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose.set("debug", true);

if (MONGO_CONNECTION_STRING === undefined) {
  console.error("Missing MONGO_CONNECTION_STRING in packages/express-backend/.env");
  process.exit(1);
}

const buildMongoConnectionString = (connectionString) => {
  const connectionUrl = new URL(connectionString);
  connectionUrl.pathname = "/users";
  return connectionUrl.toString();
};

const mongoConnectionWithDatabase = buildMongoConnectionString(
  MONGO_CONNECTION_STRING,
);

mongoose
  .connect(mongoConnectionWithDatabase)
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  findUsers({ name, job })
    .then((users) => {
      res.send({ users_list: users });
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  addUser(userToAdd)
    .then((createdUser) => {
      res.status(201).send(createdUser);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send(error.message);
        return;
      }

      res.status(400).send(error.message);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  findUserById(id)
    .then((result) => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
        return;
      }

      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  deleteUserById(id)
    .then((deletedUser) => {
      if (deletedUser === undefined) {
        res.status(404).send("Resource not found.");
        return;
      }

      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
