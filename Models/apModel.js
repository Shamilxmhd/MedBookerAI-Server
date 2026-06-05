const mongoose = require('mongoose')

const apSchema = new mongoose.Schema({

    doctor: {
        type: String,
        required: true,
        trim: true
    },

    hospital: {
        type: String,
        trim: true
    },

    // 🔥 NEW FIELD
    userName: {
        type: String,
        trim: true
    },

    patientName: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    visitType: {
        type: String,
        enum: ['New Consultation', 'Follow-up'],
        required: true
    },

    date: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['Pay at Hospital', 'Pay Online'],
        required: true
    },

    tokenNumber: {
        type: Number
    },

    userId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'Confirmed'
    }

}, {
    timestamps: true   // 🔥 OPTIONAL (createdAt, updatedAt)
})

const appointments = mongoose.model('appointments', apSchema)
module.exports = appointments