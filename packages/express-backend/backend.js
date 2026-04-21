// backend.js
import cors from "cors";
import express from "express";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(cors());
app.use(express.json());

const findUsers = ({ name, job }) => {
  return users.users_list.filter((user) => {
    if (name !== undefined && user.name !== name) {
      return false;
    }

    if (job !== undefined && user.job !== job) {
      return false;
    }

    return true;
  });
};

const findUserById = (id) => {
  return users.users_list.find((user) => user.id === id);
};

const generateId = () => {
  let id = "";

  do {
    id = Math.random().toString(36).slice(2, 8);
  } while (findUserById(id) !== undefined);

  return id;
};

const addUser = (user) => {
  const userToAdd = {
    id: generateId(),
    name: user.name,
    job: user.job,
  };

  users.users_list.push(userToAdd);
  return userToAdd;
};

const deleteUserById = (id) => {
  const userIndex = users.users_list.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return undefined;
  }

  const [deletedUser] = users.users_list.splice(userIndex, 1);
  return deletedUser;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name !== undefined || job !== undefined) {
    const result = {
      users_list: findUsers({ name, job }),
    };

    res.send(result);
    return;
  }

  res.send(users);
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  const createdUser = addUser(userToAdd);
  res.status(201).send(createdUser);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("Resource not found.");
    return;
  }

  res.send(result);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deletedUser = deleteUserById(id);

  if (deletedUser === undefined) {
    res.status(404).send("Resource not found.");
    return;
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
