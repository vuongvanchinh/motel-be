const { Motel } = require('./motel.model')
const { handleCreateImages } = require('./motel.help')

class MotelController {
    getMotels(req, res, next) {
        const query = req.query
        Motel.find(query).then(motels => {
            res.json(motels)
        })
        .catch(err => {
            return next({
                status: 400,
                message: err.message
            })
        })
    }

    async createMotel(req, res, next) {
        const body = req.body
        const images = body.images
        console.log("🚀 ~ file: motel.controller.js ~ line 20 ~ MotelController ~ createMotel ~ images", images)
        
        delete body.images 
        body.owner = req.user._id
        console.log(body)
        const motel = new Motel(body)
        motel.save().then(motel => {
            const imgs = handleCreateImages(images, motel._id.toString())
            motel.images = imgs
            return res.json(motel)
        })
        .catch(err => next({
            status: 400,
            message: err.message
        }))
        
    }

    motelDetail(req, res, next) {
        const {id} = req.params
        Motel.findOne({_id: id}).then(motel => {
            return res.json(motel)
        })
        .catch(err => next({
            status: 404,
            message: err.message
        }))  
    }

    async updateMotel(req, res, next) {
        const {id} = req.params
        const data = req.body
        delete data.censored
        delete data.rate
        const images = data.images
        delete data.images
        console.log(images)
        Motel.findByIdAndUpdate(id, data, {new: true}).then(motel => {

            res.json(motel)
        }).catch(err => next({
            status: 400,
            message: err.message            
        }))
    }

    async censoredMotel(req, res, next) {
        const {id} = req.params
        const {censored} = req.body
        if (censored !== undefined) {
            Motel.findByIdAndUpdate(id, {censored: censored}, {new: true})
            .then(motel => res.json(motel))
            .catch(err => next({
                status: 400,
                message: err.message
            }))
        } else {
            return next({
                status: 400,
                message: "Censored is required" 
            })
        }
    }

    deleteMotel(req, res, next) {
        const {id} = req.params
        Motel.findByIdAndDelete({_id:id}).then(motel => res.json(motel))
        .catch(err => next({
            status: 404,
            message: err.message
        }))
    }
    
}

module.exports = new MotelController()