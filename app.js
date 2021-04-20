const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");

const currentUserId = "607993825b9363741e335838";

const {
  PORT = 3000,
  MONGO_URL = "mongodb://localhost:27017/mestodb",
} = process.env;
const app = express();

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: currentUserId,
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

async function launch() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);
}

launch();

// brew services start mongodb-community@4.4
// https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg

// 607993825b9363741e335838
