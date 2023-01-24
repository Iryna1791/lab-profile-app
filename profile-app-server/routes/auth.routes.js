const router = require('express');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const bcrypt = require('bcrypjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const router = express.Router();
const saltRounds = 10;
const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/signup', (req, res) => {
  const { username, password, campus, course } = req.body;
  if (!username) {
    return res.status(400).json({ errorMessage: 'Please provide your username.' });
  }   

   const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
   if (!passwordRegex.test(password)) {
     res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
     return;
   }

  User.findOne({ username }).then(async(found) => {
    if (found) {
      return res.status(400).json({ errorMessage: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)
    return User.create({email, password: passwordHash, name})
    })
    .then(createdUser => {
        const user = {_id: createdUser._id, email: createdUser.email, name: createdUser.name};
        return res.status(201).json({ user })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
      });
})


router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Provide a username' });
  }

  User.findOne({ username })
    .then((foundUser) => {

      if (!foundUser) {
        return res.status(401).json({ message: 'User not found' });
      }

      const passwordCorrect = bcrypt.compare(password, foundUser.password);
      if (passwordCorrect) {
        const { _id, email, name } = foundUser;
        const payload = { _id, email, name };

        const authToken = jwt.sign( 
        payload,
        process.env.TOKEN_SECRET,
        { algorithm: 'HS256', expiresIn: "6h" }
        );

        res.status(200).json({ authToken: authToken });
    }
    else {
        res.status(401).json({ message: "Unable to authenticate the user" });
    }

    })
    .catch(err => res.status(500).json({ message: "Internal Server Error" }));

})

    router.get('/verify', isAuthenticated, (req, res, next) => {

    res.status(200).json(req.payload);
});

module.exports = router;