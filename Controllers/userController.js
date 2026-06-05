const users = require('../Models/userModel')
const jwt = require('jsonwebtoken')

// register
exports.registerController = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(406).json('User already exists..Please login')
        } else {
            const newUser = new users({ username, email, password })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

// login
exports.loginController = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email, password })
        if (existingUser) {
            //  token generate
            const token = jwt.sign({
                userId: existingUser._id,
                role: existingUser.role
            }, process.env.JWT_SECRET)
            res.status(200).json({ token,existingUser,role:existingUser.role})
        } else {
            res.status(406).json('Invalid email / password')
        }
    } catch (err) {
        res.status(401).json(err)
    }
}