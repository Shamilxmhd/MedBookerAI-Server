const notifications = require('../Models/notificationModel')

exports.getNotifications = async (req, res) => {
    const userId = req.payload.userId

    try {
        const data = await notifications
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.markAsRead = async (req, res) => {
    const { id } = req.params

    try {
        const updated = await notifications.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        )

        res.status(200).json(updated)
    } catch (err) {
        res.status(500).json(err.message)
    }
}