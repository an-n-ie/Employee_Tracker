const mysql = require("mysql")
require("dotenv").config()
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: rocess.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})