'use strict';

const { server } = require('../config');
const END_POINT = '/v1/accounts'
const credential = require('credential')
const jwt = require('jsonwebtoken');
const msgs = require('./account.messages')

const {
  checkToken, 
  validateRequestEmail, 
  validateRequestPassword
} = require('../middleware');

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    var pw = credential()
    pw.hash(password, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

function verifyPassword(hash, password) {
  return new Promise(function (resolve, reject) {
    var pw = credential()
    pw.verify(hash, password, (err, isValid) => {
      if (err) {
        reject(err)
      } else {
        resolve(isValid)
      }
    })
  })
}

function findByEmail(email, account) {
  return new Promise(function (resolve, reject) {
    account.findOne({
      where: { email: email }
    }).then(
      account => { resolve(account) },
      err => { reject(err) }
    )
  })
}

function findById(id, account) {
  return new Promise((resolve, reject) => {
    account.findOne({
      attributes: ['fullname', 'email'],
      where: { id: id }
    }).then(
      account => { resolve(account) },
      err => { reject(err) }
    )
  })
}

function userInfo(id, fullname) {
  let token = jwt.sign(
    { id: id },
    server.jwtSecret,
    { expiresIn: '24h' }
  );
  return {
    token: token,
    fullname: fullname
  }
}

module.exports = (app, models) => {
  app.get(END_POINT + '/status', (req, res) => {
    res.status(200).send({
      serverTime: Math.floor(Date.now() / 1000),
      version: '1.0',
      endPoint: END_POINT
    })
  })

  app.post(END_POINT + '/register', (req, res) => {
    var fullname = req.body.fullname;
    var email = req.body.email;
    findByEmail(email, models.account).then(
      account => {
        if (account) {
          // El email existe
          res.status(401).send() //TODO: Investigar que código de error se devuelve por account duplicada
        } else {
          // se puede crear la account
          hashPassword(req.body.password).then(
            (hash) => {
              var password = hash; // si paso hash directamente al .create, no funciona
              models.account.create({
                fullname: fullname,
                email: email,
                password: password
              }).then(account => {
                res.status(201).end()
              })
            },
            (err) => {
              res.status(500).send
            }
          )
        }
      }
    )
  })

  app.post(
    END_POINT + '/login',
    (req, res, next) => validateRequestEmail(req, res, next),
    (req, res, next) => validateRequestPassword(req, res, next),
    (req, res) => {
      
      var email = req.body.email;
      var password = req.body.password;
      findByEmail(email, models.account).then(
        account => {
          if (account) {
            var storedHash = account.get('password')
            verifyPassword(storedHash, password).then(
              result => {
                if (result) {
                  res.status(200).send(userInfo(account.get('id'), account.get('fullname')))
                } else {
                  res.status(403).send(msgs.InvalidCredentials()) // No coincide el password
                }
              },
              err => {
                res.status(500).send // No se puedo verificar el hash
              }
            )
          } else {
            res.status(403).send(msgs.InvalidCredentials()) // No existe el email en la base de datos
          }
        },
        err => {
          res.status(500).send() // No se pudo hacer la busqueda en la base de datos
        }
      )

    })

  app.get(
    END_POINT + '/check-token',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      res.status(200).send([{
        serverTime: Math.floor(Date.now() / 1000),
        iat: req.decoded.iat,
        exp: req.decoded.exp
      }])
    })

  app.get(
    END_POINT + '/account-info',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      var account_id = req.decoded.id;
      findById(account_id, models.account).then(
        account => {
          res.status(200).send(account)
        },
        err => {
          res.status(500).send()
        }
      )
    }
  )

  app.put(
    END_POINT + '/account-info',
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {
      var account_id = req.decoded.id;
      // TODO: Verificar que el req.body.email no exista en la DB. 
      var updateValues = { fullname: req.body.fullname, email: req.body.email }
      models.account.update(
        updateValues,
        { returning: true, where: { id: account_id } }
      ).then(
        () => {
          res.status(200).send(updateValues)
        }
      ).catch(
        err => { res.status(500).send() }
      )
    }
  )
}
