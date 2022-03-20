const bcrypt = require('bcrypt')
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
                .catch(err => res.status(400).json(err))
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
}

module.exports = new UserController()
