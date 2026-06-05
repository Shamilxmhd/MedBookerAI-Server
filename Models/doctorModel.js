const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number
  },
  availability: {
    type: String
  },
  image: {
    type: String  
  },
  hospital: {
    type: String,
    required: true
  }
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor