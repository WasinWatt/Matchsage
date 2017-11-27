const ReceiptModel = require('../models/receipt')
const UserModel = require('../models/user')
const Pdf = require('pdfkit')
const fs = require('fs')

async function viewReceipt (userId, reserveId) {
  const receipt = await ReceiptModel.findByReservationId(reserveId)
  if (receipt.user_id !== userId) {
    const error = new Error('Only customer who make this reservation can view the receipt')
    error.status = 400
    throw error
  }
  return receipt
}

async function downloadReceipt (userId, reserveId) {
  const receipt = await ReceiptModel.findByReservationId(reserveId)
  const user = await UserModel.findByUserId(receipt.customer_id)
  if (receipt.customer_id !== user.user_id) {
    const error = new Error('Only the person who make this reservation can download the receipt')
    error.status = 400
    throw Error
  }

  var tempReceipt = new Pdf()
  return new Promise((resolve, reject) => {
    let pendingStepCount = 2

    const stepFinished = () => {
      if (--pendingStepCount === 0) {
        resolve()
      }
    }

    var ws = fs.createWriteStream('tmp/receipt.pdf')
    
    ws.on('close', stepFinished)
    tempReceipt.pipe(ws)

    tempReceipt.font('Times-Roman')
    .fontSize(30)
    .text(`Receipt No. ${receipt.receipt_id} \nValue Customer:  ${user.first_name}   ${user.last_name}\nService : ${receipt.reservation_id}\nPrice: ${receipt.price}`, 100, 100)
    tempReceipt.end()

    stepFinished()
    ws.on('close', () => {
    })
  })
}

module.exports = {
  viewReceipt,
  downloadReceipt
}
