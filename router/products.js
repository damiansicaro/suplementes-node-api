'use strict';

const { Op } = require("sequelize");
const END_POINT = '/v1/products'

const { checkToken } = require('../middleware');



module.exports = (app, models) => {

  app.get(END_POINT, (req, res) => {

    let options = { where: {} }
    let title = req.query.title;
    let description = req.query.description;

    if (title) options.where.title = { [Op.like]: '%' + title + '%' };
    if (description) options.where.description = { [Op.like]: '%' + description + '%' };

    models.product.findAll(options)
      .then(products => {
        res.status(200).send(products)
      })
  });

  app.get(END_POINT + '/:prodId', (req, res) => {

    let prodId = req.params.prodId;

    models.product.findOne({
      where: {
        id: prodId
      }
    })
      .then(product => {
        res.status(200).send(product)
      })
  });

  app.post(END_POINT,
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {

      var title = req.body.title;
      var description = req.body.description;
      var price = req.body.price;
      var stock = req.body.stock;
      var imageUrl = req.body.imageUrl

      models.product.create({
        title,
        description,
        price,
        stock,
        imageUrl
      })
        .then(product => {
          if (product) {
            res.status(200).send(product)
          } else {
            res.status(500).send() // fallo el insert
          }
        })
    })

  app.put(END_POINT,
    (req, res, next) => { checkToken(req, res, next) },
    (req, res) => {

      var id = req.body.id
      var title = req.body.title;
      var description = req.body.description;
      var price = req.body.price;
      var stock = req.body.stock;
      var imageUrl = req.body.imageUrl

      models.product.update({
        title,
        description,
        price,
        stock,
        imageUrl
      }, {
        where: {
          id: id
        }
      })
        .then(product => {
          if (product) {
            res.status(200).send(product)
          } else {
            res.status(500).send() // fallo el insert
          }
        })
    }
    )
}
