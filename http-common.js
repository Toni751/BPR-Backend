const axios = require("axios");

module.exports.http = axios.create({
  baseURL: process.env.PATIENTS_URL,
  headers: {
    "Content-type": "application/json",
    accept: "application/json",
  },
});
