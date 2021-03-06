const { setTimeout } = require('timers')

const { Router } = require('express')
const AuthServ = require('../services/auth')
const ReceiptModel = require('../models/receipt')
const UserModel = require('../models/user')
const ReceiptService = require('../services/receipt')
const path = require('path')

const ExpressJoi = require('express-joi-validator')
const Joi = require('joi')

let router = Router()

// show list of receipt of those user
router.get('/', AuthServ.isAuthenticated, async(req, res, next) => {
  try {
    //  need to add pick only with same uesr_id
    const receipts = await ReceiptModel.find(req.query)
    res.json({ receipt: receipts })
  } catch (error) {
    next(error)
  }
})

// create new receipt
router.post('/new', AuthServ.isAuthenticated, ExpressJoi({
  body: {
    customer_id: Joi.string().required(),
    reservation_id: Joi.string().required(),
    price: Joi.number().optional(),
    payment_date: Joi.string().optional()
  }
}), async (req, res, next) => {
  try {
    // console.log(req)
    const receipt = await ReceiptModel.createReceipt(req.body)
    res.json(receipt)
  } catch (error) {
    next(error)
  }
})

// show specific receipt by reservation ID
router.get('/:id', AuthServ.isAuthenticated, async (req, res, next) => {
  try {
    const receipt = await ReceiptModel.findByReceiptId(req.params.id)
    const user = await UserModel.findByUserId(req.user.user_id)
    console.log(receipt)
    if (receipt.customer_id !== user.user_id) {
      const error = new Error('Only customer who make this reservation can view this receipt')
      error.status = 400
      throw error
    }
    res.json(receipt)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/download', AuthServ.isAuthenticated, async (req, res, next) => {
  try {
    const receipt = await ReceiptModel.findByReceiptId(req.params.id)
    if (receipt.customer_id !== req.user.user_id) {
      const error = new Error('Only customer who make this reservation can download this receipt')
      error.status = 400
      next(error)
    }
    ReceiptService.downloadReceipt(req.user.user_id, receipt.receipt_id).then(() => {
      setTimeout((response) => {
        res.download(`tmp/receipt-${receipt.receipt_id}.pdf`)
      }, 1000)
    })
    // res.setHeader({'Content-disposition': 'attachment; filename=receipt.pdf'})
    // var file = path.join(__dirname, `receipt-${receipt.receipt_id}.pdf`)
  } catch (error) {
    next(error)
  }
})

module.exports = router

// Done Validate
