const isAdmin = function(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
}

const isLessor = function(req, res, next) {
    if (req.user && req.user.role === 'lessor') {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
}

const isLessee = function(req, res, next) {
    if (req.user && req.user.role === 'lessee') {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
}
const isActive = function(req, res, next) {
  if (req.user && req.user.active) {
    next();
  } else {
    return res.status(401).json({ message: 'Require active user!' });
  }
}


module.exports = {
    isAdmin,
    isLessor,
    isLessee,
    isActive
}