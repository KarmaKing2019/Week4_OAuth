const express = require('express')
const Partners = require('../models/partners')
const authenticate = require('../authenticate')
const cors = require('./cors')

const partnerRouter = express.Router()

partnerRouter
  .route('/')

  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, (req, res, next) => {
    Partners.find()
      .then(campsites => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(campsites)
      })
      .catch(err => next(err))
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partners.create(req.body)
        .then(partner => {
          console.log('Partner Created', partner)
          res.statusCode = 200
          res.setHeader('Content-type', 'application/json')
          res.json(partner)
        })
        .catch(err => next(err))
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403
      res.end('PUT operation not supported on /partners')
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partners.deleteMany()
        .then(response => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(response)
        })
        .catch(err => next(err))
    }
  )

partnerRouter
  .route('/:partnerId')

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Partners.findByIdAndDelete(req.params.partnerId)
        .then(response => {
          res.statusCode = 200
          res.setHeader('Content-type', 'application/json')
          res.json(response)
        })
        .catch(err => next(err))
    }
  )

  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, (req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then(partner => {
        if (partner) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(partner)
        } else {
          err = new Error(`Campsite ${req.params.partnerId} not found!!`)
          err.status = 404
          return next(err)
        }
      })
      .catch(err => next(err))
  })

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Partners.findByIdAndUpdate(
        req.params.partnerId,
        {
          $set: req.body
        },
        { new: true }
      )
        .then(partner => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(partner)
        })
        .catch(err => next(err))
    }
  )

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 404
    res.end(
      `POST operation not supported on /campsites/${req.params.partnerId}`
    )
  })

module.exports = partnerRouter
