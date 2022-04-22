
const jwt = require('jsonwebtoken')

module.exports = (app) => {
    app.use(function(req, res, next) {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, function(err, decode) {
            // console.log(err, decode)
            if (err) req.user = undefined;
            else {
              req.user = decode.user;
            }
            
            next();
          });
        } else {
          req.user = undefined;
          next();
        }
    });
} 
