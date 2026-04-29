## Express backend MongoDB setup

The Express backend reads users from MongoDB through Mongoose instead of an
in-memory array. The schema lives in `packages/express-backend/models/user.js`,
and database operations live in `packages/express-backend/services/user-service.js`.

Create `packages/express-backend/.env` with your Atlas connection string:

```env
MONGO_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster-host>/
```

Do not commit `.env`. The backend appends `users` to the connection string so it
uses the `users` database and the `users_list` collection.

Start the backend from the repo root:

```sh
npm run start:backend
```
