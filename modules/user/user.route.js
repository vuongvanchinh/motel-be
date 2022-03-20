const express = require('express')
const router = express.Router()
const userController = require('./user.controller')
const auth = require('../../middleware/auth/requireAuthenticate')

router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/info', auth, (req, res, next) => {
    res.status(200).json({
        message: "pass"
    })
} )

module.exports = router