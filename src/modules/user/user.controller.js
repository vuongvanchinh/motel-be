const bcrypt = require('bcryptjs')
const User = require('./user.model')
const jwt = require('jsonwebtoken')

class UserController {
    async register(req, res, next) {
        const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        try {
            if (re.test(req.body.password)) {

                req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUND))
                const newUser = new User(req.body)
                newUser.save()
                .then(user => {
                    user.password = undefined
                    res.status(200).json(user)
                
                })
                .catch(err => res.status(400).json({
                    message: err.message
                }))
            } else {
                res.status(400).json({
                    password: 'Password must be stronger'
                })
            }
    
        } catch (error) {
            console.error(error.message)
            res.status(400).json(error)
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body
        if (email && password) {
            const user = await User.findOne({email: email})
            if (user && user.checkPassword(password)) {
                user.password = undefined
                res.status(200).json({
                    jwt: jwt.sign({user: user, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, process.env.SECRET),
                    user: user
                })
            } else {
                res.status(400).json({
                    message: "Password not exact"
                })
            }
        }
    }

    async getUser(req, res, next) {
        const {role} = req.query
        if (role !== 'lessee' && role !== 'lessor') {
            return next({
                status: 400,
                message: "Deo co dau ban oi"
            })
        }
        User.find(req.query).select(['-password'])
        .then((users) => {
            return res.json(users)
        })
        .catch((err) =>  {
            next({
                status: 400,
                message: err.message
            })          
        })
    }

    getUserDetail(req, res, next) {
        console.log(req.params)
        const {id} = req.params
        User.findOne({_id: id})
        .then(user => {
            user.password = undefined            
            return res.json(user)
        })
        .catch((err) => {
            console.log(err)
            next({
                status: 404,
                message: err.message
            })
        })
    }

    getCurrentUserInfo(req, res, next) {
        return res.json(req.user)
    }
    
    updateUser(req, res, next){
        const {id} = req.params
        const updateData = req.body
        updateData.role = undefined
        updateData.password = undefined
        User.findByIdAndUpdate({_id:id}, updateData, {new: true}).then(user => {
            return res.json(user)
        }).catch(err => {
            return next({
                status: 400,
                message: err.message
            })
        })


    }

    deleteUser(req, res, next) {
        const {id} = req.params
        if (id !== req.user._id) {
            User.findOneAndDelete({_id: id})
            .then(user => {
                user.password = undefined
                return res.json(user)
            })
            .catch(err => {
                next({
                    status: 400,
                    message: err.message
                })
            })
        } else {
            next({
                status: 400,
                message: "Can not delete yourself!"
            })
        }
       
    }
}

module.exports = new UserController()
