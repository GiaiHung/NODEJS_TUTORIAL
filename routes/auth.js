const express = require('express')
const router = express.Router()
const authController = require('../controllers/userAuth')

router.post('/', authController.handleLogin)

module.exports = router
