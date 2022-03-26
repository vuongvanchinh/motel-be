const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect(process.env.DB)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { connect }