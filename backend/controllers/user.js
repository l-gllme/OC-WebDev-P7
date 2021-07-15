const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cryptoJs = require('crypto-js')

const models = require('../models')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

function emailMask(email) {
  var maskedEmail = email.replace(/([^@])/g, "*").split('')
  var previous	= ""
  for(i=0;i<maskedEmail.length;i++){
    if (i<=0 || previous == "@"){
      maskedEmail[i] = email[i]
    }
    previous = email[i]
  }
  return maskedEmail.join('')
}


module.exports = {

  signup: function (req, res) {

    let email = req.body.email
    let username = req.body.username
    let password = req.body.password

     if (email == null || username == null || password == null) {
       return res.status(400).json({ error: 'missing parameters' })
     }
     if (!EMAIL_REGEX.test(email)) {
       return res.status(400).json({ error: 'email is not valid' })
     }
 
     if (!PASSWORD_REGEX.test(password)) {
       return res.status(400).json({ error: 'Password invalid' })
     }
    models.User.findOne({ where: { email: req.body.email } }).then(result => {
      if (result) {
        res.status(409).json({ 'error': 'email already exist' })
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (error, hash) {
            let cryptedEmail = cryptoJs.HmacSHA256(req.body.email, 'secretKey').toString()
            let maskedEmail = emailMask(req.body.email)
            const user = {
              email: cryptedEmail,
              maskedEmail: maskedEmail,
              username: username,
              password: hash,
              isAdmin: 0
            }
            models.User.create(user)
              .then(result => {
                res.status(201).json({ 'message': 'User created' });
              }).catch(error => {
                res.status(500).json({ 'error': 'User creation problem' });
              });
          });
        });
      }
    }).catch(error => {
      res.status(500).json({ 'error': 'Model not found' });
    });
  },
  login: function login(req, res) {
    let decryptedEmail = cryptoJs.HmacSHA256(req.body.email, 'secretKey').toString()
    models.User.findOne({ where: { email: decryptedEmail } }).then(user => {
      if (user === null) {
        res.status(401).json({ 'message': 'Bad request' });
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
        res.status(401).json({ 'message': 'Incorect Password' });
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
        res.status(201).json(user)
      } else {
        res.status(404).json({ 'error': 'utilisateur non trouvé' })
      }
    }).catch(function (err) {
      res.status(500).json({ 'error': 'error' });
    });
},
editUserProfile: function (req, res) {
  const userId = req.params.id;
  const updatedProfile = {
    username: req.body.username,
  }

  models.User.update(updatedProfile, { where: { id: userId } })
    .then(result => {
      res.status(200).json({
        message: "Profil updated successfully",
        post: updatedProfile
      });
    }).catch(error => {
      res.status(500).json({
        message: "Somenthing went wrong",
      });
    })
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



