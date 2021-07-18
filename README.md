# Messenger

A one-to-one realtime chat app.

## Initial Setup

Create the PostgreSQL database (these instructions may need to be adapted for your operating system):

```
psql
CREATE DATABASE messenger;
CREATE DATABASE messenger_test;
\q
```

Update db.js to connect with your local PostgreSQL set up. The [Sequelize documentation](https://sequelize.org/master/manual/getting-started.html) can help with this.

Create a .env file in the server directory and add your session secret (this can be any string):

```
SESSION_SECRET="your session secret"
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgres://<db_user_name>:<db_user_pass>@localhost:5432/messenger
TEST_DATABASE_URL=postgres://<db_user_name>:<db_user_pass>@localhost:5432/messenger
```

In the server folder, install dependencies and then seed the database:

```
cd server
npm install
npm run seed
```

In the client folder, install dependencies:

```
cd client
npm install
```

### Running the Application Locally

In one terminal, start the front end:

```
cd client
npm start
```

In a separate terminal, start the back end:

```
cd server
npm run dev
```
