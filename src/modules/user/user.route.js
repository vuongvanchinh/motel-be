const express = require('express')
const router = express.Router()
const userController = require('./user.controller')
const auth = require('../../middleware/auth/requireAuthenticate')
const {isAdmin} = require('../user/user.permission')


/**
 * post /api/user/login
 * @tags User
 * @param {string} email.form.required
 * @param {string} password.form.required
 * @example request - other payload example
 * {
 *   "email": "",
 *   "password": ""
 * }
 */
router.post('/login', userController.login)

/**
 * post /api/user/register
 * @tags User
 * @param {string} email.form.required
 * @param {string} password.form.required
 * @param {string} role.form.required - enum:admin,lessee,lessor
 * @example request - other payload example
 * {
 *   "email": "",
 *   "password": "",
 *   "role": "admin|lessee|lessor"
 * }
 */
router.post('/register', userController.register)


router.get('/info', auth, (req, res, next) => {
    res.status(200).json({
        message: "pass"
    })
})
/**
 * get /api/user/my-info
 * @tags User
*/
router.get('/my-info', auth, userController.getCurrentUserInfo)
/**
 * get /api/user/{id}
 * @tags User
 * @param {string} id.path
*/
router.get('/:id', auth, isAdmin, userController.getUserDetail)

/**
 * put /api/user/{id}
 * @tags User
 * @param {string} id.path
 * @param {string} email.form - Optional
 * @param {boolean} active.form.optional - Optional
 * @example request - payload
 * {
 * }
*/
router.put('/:id', auth, isAdmin, userController.updateUser)

/**
 * delete /api/user/{id}
 * @tags User
 * @description only admin
 * @param {string} id.path
 * 
 */
router.delete('/:id', auth, isAdmin, userController.deleteUser)

/**
 * get /api/user
 * @tags User 
 * @param {string} role.query.required - 'admin|lessee|lessor'
 * @param {string} active.query - true|false
 */
router.get('/', auth, isAdmin, userController.getUser)

module.exports = router