const express = require('express')
const router = express.Router()
const registerController = require('../controllers/users')

router.post('/', registerController.handleNewUser)

module.exports = router