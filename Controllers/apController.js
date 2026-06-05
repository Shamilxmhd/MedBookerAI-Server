const appointments = require('../Models/apModel')
const Doctor = require('../Models/doctorModel')
const User = require('../Models/userModel')
const Notification = require('../Models/notificationModel')

// addAppointment
exports.addAppointmentController = async (req, res) => {

    const {
        patientName,
        age,
        phone,
        visitType,
        date: rawDate,
        description,
        paymentMethod
    } = req.body

    const doctor = req.body.doctor.trim()
    const userId = req.payload.userId

    try {

        // ✅ Normalize date
        const date = new Date(rawDate).toISOString().split('T')[0]

        // ✅ Get doctor details (hospital)
        const doctorData = await Doctor.findOne({ name: doctor })
        const hospital = doctorData ? doctorData.hospital : ''

        // ✅ Get user name (🔥 NEW)
        const userData = await User.findById(userId)
        const userName = userData ? userData.username : 'User'

        // ✅ Duplicate check
        const existingAp = await appointments.findOne({
            doctor,
            userId,
            patientName,
            date
        })

        if (existingAp) {
            return res.status(406).json('Appointment already exists for this patient')
        }

        // ✅ Token logic
        const lastToken = await appointments
            .find({ doctor, date })
            .sort({ tokenNumber: -1 })
            .limit(1)

        const tokenNumber = lastToken.length > 0
            ? lastToken[0].tokenNumber + 1
            : 1

        // ✅ Save
        const newAp = new appointments({
            doctor,
            hospital,
            patientName,
            userName, // 🔥 ADDED
            age,
            phone,
            visitType,
            date,
            description,
            paymentMethod,
            tokenNumber,
            userId
        })

        await newAp.save()
        await Notification.create({
            userId,
            message: `Appointment booked with ${doctor} on ${date}`
        })
        res.status(200).json(newAp)

    } catch (err) {
        res.status(401).json(err.message)
    }

}

// getAppointment*
exports.getAppointmentController = async (req, res) => {
    const userId = req.payload.userId
    try {
        const result = await appointments.find({ userId })
        res.status(200).json(result)
    } catch (err) {
        res.status(401).json(err)
    }
}

// deleteAppointment
exports.deleteAppointmentController = async (req, res) => {
    const { id } = req.params
    const userId = req.payload.userId
    try {
        const updatedAp = await appointments.findByIdAndUpdate({ _id: id }, { status: "Cancelled" }, { new: true })
        await Notification.create({
            userId: userId,
            message: `Appointment cancelled for ${updatedAp.doctor}`
        })
        res.status(200).json(updatedAp)
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message)
    }
}
