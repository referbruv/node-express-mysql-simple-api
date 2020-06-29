const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const port = 3000;

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
};
const pool = mysql.createPool(config);

const app = express();
app.use(bodyParser.json());

app.get("/api/users", (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        conn.query("SELECT * from users", (error, results, fields) => {
            conn.release();
            if (error) throw error;
            res.send(results);
        });
    });
});

app.post("/api/users", (req, res) => {
    let body = req.body;
    let user = {
        "name": body["name"],
        "email": body["email"]
    };
    pool.getConnection((err, conn) => {
        if (err) throw err;
        conn.query("INSERT INTO users SET ?", user, (error, results, fields) => {
            conn.release();
            if (error) throw error;
            res.send(results);
        });
    });
});

app.patch("/api/users/:user_id", (req, res) => {
    let body = req.body;
    let userid = req.params["user_id"];
    let name = body["name"];
    let email = body["email"];
    let query = `UPDATE users SET name='${name}',email='${email}' WHERE id=${userid}`;
    pool.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(query, (error, results, fields) => {
            conn.release();
            if (error) throw error;
            res.send(results);
        });
    });
});

app.delete("/api/users/:user_id", (req, res) => {
    let userid = req.params["user_id"];
    let query = `DELETE FROM users WHERE id=${userid}`;
    pool.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(query, (error, results, fields) => {
            conn.release();
            if (error) throw error;
            res.send(results);
        });
    })
});

// app.listen(port, () => {
//     console.log("server started to listen on " + port);
// });