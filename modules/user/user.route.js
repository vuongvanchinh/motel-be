const express = require('express')
const router = express.Router()
const userController = require('./user.controller')
const auth = require('../../middleware/auth/requireAuthenticate')
const {isAdmin} = require('../user/user.permission')

router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/info', auth, (req, res, next) => {
    res.status(200).json({
        message: "pass"
    })
} )

router.get('/my-info', auth, userController.getCurrentUserInfo)
router.get('/:id', auth, isAdmin, userController.getUserDetail)
router.get('/', auth, isAdmin, userController.getUser)

module.exports = router