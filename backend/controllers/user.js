const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/;



module.exports = {

  signup: function (req, res) {

    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    /* if (email == null || username == null || password == null) {
       return res.status(400).json({ 'error': 'missing parameters' });
     }
     if (!EMAIL_REGEX.test(email)) {
       return res.status(400).json({ 'error': 'email is not valid' });
     }
 
     if (!PASSWORD_REGEX.test(password)) {
       return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
     }*/
    models.User.findOne({ where: { email: req.body.email } }).then(result => {
      if (result) {
        res.status(409).json({ 'message': 'email already exist' });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (error, hash) {
            const user = {
              email: req.body.email,
              username: username,
              password: hash,
              isAdmin: false
            }
            models.User.create(user)
              .then(result => {
                res.status(201).json({ 'message': 'Utilisateur créer' });
              }).catch(error => {
                res.status(500).json({ 'message': 'probleme lors de la création de lutilisateur' });
              });
          });
        });
      }
    }).catch(error => {
      res.status(500).json({ error });
    });
  },
  login: function login(req, res) {
    models.User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user === null) {
        res.status(401).json({ 'message': 'Informations de connexion mauvaises!' });
      } else {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          if (result) {
            res.status(200).json({
              user: user.id,
              isAdmin: user.isAdmin,
              username: user.username,
              token: jwt.sign(
                { userId: user.id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '4h' }
              )
            });
      } else {
        res.status(401).json({ 'message': 'Mot de passe incorect' });
      }
});
      }
    }).catch (error => {
  res.status(500).json({ 'message': 'error' });
});
  },
getUserProfile: function (req, res) {
  const userId = req.params.id
  models.User.findByPk(userId)
    .then(function (user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'utilisateur non trouvé' });
      }
    }).catch(function (err) {
      res.status(500).json({ error });
    });
},
deleteAccount: async function (req, res) {
  try {
    const userId = req.body.userId;
    console.log(userId)
    const idToDelete = req.params.id
    console.log(idToDelete)
    if (!userId || !idToDelete) {
      res.status(401).json({ error });
      return;
    }
    let allowed = req.body.isAdmin;
    console.log(allowed)
    if (userId == idToDelete) allowed = true;
    if (!allowed) {
      res.status(401).json({ message: "not allowed" })
      return;
    }
    let user = await models.User.findOne({ where: { id: req.params.id } });
    user.destroy()
    res.status(200).json({ message: "compte supprimé", hooks: true })
  } catch (error) {
    res.status(400).json({ error })
  }
}
};



