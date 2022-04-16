const {role} = require('../../constants')
const { Motel } = require('./motel.model')

const isAdminOrOwner = function(req, res, next) {
    console.log("Hello", req.user)
    if (req.user && req.user.role === role.admin) {
      next();
    } else {
        if (req.user) {
            const {id} = req.params
            
            Motel.findOne({_id: id}, {owner: 1}).then(motel => {
                if(motel.owner.toString() === req.user._id) {
                    next()
                } else {
                    return res.status(401).json({ message: 'Permission denie' });
                }
                
            }).catch(() => res.status(401).json({ message: 'Permission denie' }))
        } else {
            res.status(401).json({ message: 'Permission denie' })
        }
      
    }
}

module.exports = {
    isAdminOrOwner
}