const router = require("express").Router();
const auth = require("./auth").auth;
const http = require("../http-common").http;

const formatDate = (date) => {
  const dateYear = date.getFullYear();

  const dateMonthAsInt = date.getMonth() + 1;
  const dateMonth = dateMonthAsInt > 9 ? dateMonthAsInt : "0" + dateMonthAsInt;

  const dateDateAsInt = date.getDate();
  const dateDate = dateDateAsInt > 9 ? dateDateAsInt : "0" + dateDateAsInt;

  const dateFormatted = dateYear + "-" + dateMonth + "-" + dateDate;
  return dateFormatted;
};

router.get("/", auth, async (req, res) => {
  const today = new Date();

  const requestDate = formatDate(today);
  const requestObject = {
    date: requestDate,
  };

  console.log("Ripa request object", requestObject);
  http
    .post("/patients", requestObject)
    .then((response) => {
      const patients = response.data;
      console.log("Ripa patients", patients);
      res.status(200).send(patients);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
});

router.get("/images/:accession", auth, async (req, res) => {
  const accession = req.params.accession;
  console.log(
    `${
      req.username
    } searching patient with accession: ${accession} at ${new Date()}`
  );

  http
    .get(`/patients/images/${accession}`)
    .then((response) => {
      const image = response.data;
      res.status(200).send(image);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
});

router.get("/cpr/:cpr", auth, async (req, res) => {
  const cpr = req.params.cpr;
  console.log(
    `${req.username} searching patient with cpr: ${cpr} at ${new Date()}`
  );

  http
    .get(`/patients/cpr/${cpr}`)
    .then((response) => {
      const image = response.data;
      res.status(200).send(image);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
});

module.exports = router;
