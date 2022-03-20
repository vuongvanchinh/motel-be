const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const User = new Schema({
    email: {
        type: String, required: false,
        unique: true,
        validate: {
            validator: (email) => {
                if(email !== null) {
                    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return re.test(email)
                }
                return true
            },
            message: "Email must be null or right email format."
        }
    },
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'lessor', 'lessee'],
        required: true,
        index: true
    }
        
}, {
    timestamps: true
})

User.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('User', User)