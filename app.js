// app.js
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const indexRouter = require("./routes/indexRouter.js");
const trainersRouter = require("./routes/trainersRouter.js");
const pokemonRouter = require("./routes/pokemonRouter.js");

app.set("view engine", "ejs");
app.use(express.static("static"));

app.use("/", indexRouter);
app.use("/trainers", trainersRouter);
app.use("/pokemon", pokemonRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
