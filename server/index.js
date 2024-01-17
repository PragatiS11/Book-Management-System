const express = require("express");
require('dotenv').config()
const cors = require("cors");
const { userRouter } = require("./routes/user.routes");
const { connection } = require("./db");
const { bookRouter } = require("./routes/book.routes");

const app = express();
app.use(cors())
app.use(express.json());
app.use("/users", userRouter);
app.use("/books" , bookRouter)


app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log(`server is running at ${process.env.PORT}`)
        console.log("Connected to the DataBase")
    } catch (error) {
        console.log(error);
    }
})