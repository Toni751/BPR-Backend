const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { authenticate } = require("ldap-authentication");

const secret = process.env.SECRET;

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Authenticating", username, password);
    let authenticated = await authenticate({
      ldapOpts: { url: "ldap://127.0.0.1:3004" },
      userDn: "cn=user,dc=test",
      username: username,
      userPassword: password,
      userSearchBase: "dc=test",
    });
    console.log("Authenticated", authenticated);
  } catch (err) {
    console.log("ldap auth error", err.message);
  }
  // In a production environment this should be uncommented

  // if (authenticated !== true) {
  //   console.log("Error signing token", err.message);
  //   res.status(401).json({
  //     message: "Error signing token: " + err.message,
  //   });
  //   return;
  // }

  jwt.sign(
    {
      name: username,
    },
    secret,
    { expiresIn: "12h" },
    (err, token) => {
      if (err) {
        console.log("Error signing token", err.message);
        res.status(401).json({ message: "Error: " + err.message });
        return;
      }
      res.status(200).json({ token });
    }
  );
});

const auth = (req, res, next) => {
  const token = req.header("app-token");
  if (!token) {
    res.status(401).json({ message: "No authorization token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.username = decoded.name;
    next();
  } catch (err) {
    console.log("Error decoding token", err.message);
    res.status(401).json({ message: "Error decoding token" });
  }
};

module.exports.users = router;
module.exports.auth = auth;
