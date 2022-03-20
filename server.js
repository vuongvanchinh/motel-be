require('dotenv').config()
const express = require('express')
const db = require('./config/db')
const bodyParser = require('body-parser')
const userRoute = require('./modules/user/user.route')

const auth = require('./middleware/auth')


require('dotenv').config()

const app = express()
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
app.use(bodyParser.json());
// parse user to header
auth(app)

db.connect()

app.get('/', (req, res) => {
    res.send({name: "chinh"})
})




app.use('/api/user', userRoute)
app.use((req, res, next) => {
    const error = new Error("404 not found");
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        message: error.message || 'Internal Server Error',
    });
});
app.listen(process.env.PORT)