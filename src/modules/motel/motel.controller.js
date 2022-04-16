const { Motel } = require('./motel.model')
const { handleCreateImages, fillLinkImages } = require('./motel.help')
const { Image } = require('./motel.model')


class MotelController {
    getMotels(req, res, next) {
        const query = req.query
        Motel.find(query).populate('images', {url:1}).then(motels => {
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
        delete body.images 
        body.owner = req.user._id
        const motel = new Motel(body)
        motel.save({new:true}).then(motel => {
            return res.json(motel)
        })
        .catch(err => next({
            status: 400,
            message: err.message
        }))
        
    }

    async motelDetail(req, res, next) {
        const {id} = req.params
        Motel.findOne({_id: id}).populate('images', {url:1}).then(motel => {
            motel.images = fillLinkImages(motel.images, req.headers.host)
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
    
    async uploadImage(req, res, next) {
        const {id} = req.params
        const motel = await Motel.findOne({ _id: id });
        console.log(motel)
        console.log(req)
        if (motel) {
            if (req.files) {
                const arr = req.files.map(item => {
                    return {
                        motel: id,
                        url: item.path
                    }
                })
                if (arr.length) {
                    Image.insertMany(arr).then(function(images){
                        motel.images = images.map(item => item._id)
                        motel.save().then(() => {
                            return res.json(fillLinkImages(images, req.headers.host))
                        })
                        
                    }).catch(err => {
                        console.log(err)
                        return res.json(err)
                    })
                } else {
                    next({
                        status: 404,
                        message: "Not found"
                    })
                }
            } else {
                next({
                    status: 404,
                    message: "Not found"
                })
            }           
             
        } else {
            next({
                status: 404,
                message: "Not found"
            })
        }
    }
}

module.exports = new MotelController()