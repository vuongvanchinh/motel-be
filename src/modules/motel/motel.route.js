const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth/requireAuthenticate')
const motelController = require('./motel.controller')
const { isAdmin, isLessor } = require('../user/user.permission')
const { isAdminOrOwner } = require('./motel.permission')
const upload = require('../../middleware/multer')
/**
 * GET /api/motel/stats
 * @tags Motel
 */
router.get('/stats', isAdmin, motelController.stats)
/**
 * POST /api/motel/{id}/upload-image
 * @tags Motel
 */
router.post('/:id/upload-image', upload.array('images', 4), motelController.uploadImage)

/**
 * GET /api/motel
 * @tags Motel
 * @param {string} censored.query
 * @param {string} rentalPrice.query
 * @param {string} minRentalPrice.query
 */
router.get('/' , motelController.getMotels)

/**
 * post /api/motel
 * @tags Motel
 * @param {string} title.form.required
 * @param {string} description.form.required
 * @param {string} address.form.required
 * @param {number} rentalPrice.form.required
 * @param {number} minRentalPrice.form.required
 * @param {number} type.form.required
 * @param {string} postType.form.required
 * @example request - payload
 * {
 *  "title": "",
 *  "description": "",
 *  "address":"",
 *  "rentalPrice":0,
 *  "minRentalPrice":0,
 *  "type": 1,
 *  "postType": "renting|roomate",
 * }
 */
router.post('/', auth, motelController.createMotel)

/**
 * put /api/motel/{id}/censored
 * @tags Motel
 * @description Only Admin
 * @param {string} id.path
 * @param {boolean} censored.form.required
 */
router.put('/:id/censored', isAdmin, motelController.censoredMotel)

/**
 * put /api/motel/{id}
 * @tags Motel
 * @description Only Admin or Owner
 * @param {string} title.form.required
 * @param {string} description.form.required
 * @param {string} address.form.required
 * @param {number} rentalPrice.form.required
 * @param {number} minRentalPrice.form.required
 * @param {number} type.form.required
 * @param {string} postType.form.required
 * @param {array<Image>} images.form.required - array of Image 
 * @example request - payload
 * {
 *  "title": "",
 *  "description": "",
 *  "address":"",
 *  "rentalPrice":0,
 *  "minRentalPrice":0,
 *  "type": 1,
 *  "postType": "renting|roomate",
 *  "images": [{"_id": "", "url":""}]
 * }
 */
router.put('/:id', isAdminOrOwner, motelController.updateMotel)

/**
 * delete /api/motel/{id}
 * @tags Motel
 * @param {string} id.path
 * 
 */
router.delete('/:id', isAdminOrOwner, motelController.deleteMotel)



/**
 * get /api/motel/{id}
 * @tags Motel
 * @param {string} id.path
 */
router.get('/:id', auth, motelController.motelDetail)


module.exports = router