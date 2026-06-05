const jwt = require('jsonwebtoken')
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        // console.log('inside jwt');
        if (token) {
            const jwtResponse = jwt.verify(token, process.env.JWT_SECRET)
            req.payload = jwtResponse
            next()
           
        } else {
            res.status(406).json('Token is not available')
        }
    } catch (err) {
        res.status(401).json('Please Login')
    }
}

module.exports = jwtMiddleware