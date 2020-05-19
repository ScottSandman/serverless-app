require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const db = require("mysql2/promise");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = db.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.post("/create_user", async (request, response) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO user.users (username, firstname, lastname, email, avatar, bio, github) VALUES ('${request.body.username}', '${request.body.firstname}', '${request.body.lastname}', '${request.body.email}', '${request.body.avatar}', '${request.body.bio}', '${request.body.github}');`
    );
    response.status(201).send(result);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

app.get("/user", async (request, response) => {
  //   const test = { username: "roughneck" };
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM user.users WHERE username = '${request.query.username}';`
    );
    response.status(200).send(result);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

app.put("/update_user", async (request, response) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `UPDATE user.users SET email='${request.body.email}', avatar='${request.body.avatar}', bio='${request.body.bio}', github='${request.body.github}' WHERE username = '${request.body.username}';`
    );
    response.status(201).send(result);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

app.delete("/delete_user", async (request, response) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `DELETE FROM user.users WHERE username='${request.body.username}';`
    );
    response.status(200).send(result);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

// app.listen(3000, () => console.log(`Listening on: 3000`));

module.exports.handler = serverless(app);
