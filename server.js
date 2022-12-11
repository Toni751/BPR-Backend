const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app);

const port = 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json("The app is up and running!");
});

app.use("/patients", require("./controllers/patientscontroller"));
app.use("/users", require("./controllers/auth").users);

server.listen(port, () => console.log(`Server started on port ${port}..`));
