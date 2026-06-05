const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId: String,
    message: String,
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const notifications = mongoose.model('notifications', notificationSchema)

module.exports = notifications