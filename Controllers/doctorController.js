const Doctor = require('../Models/doctorModel')

// get doctors with search & filter
exports.getDoctorsController = async (req, res) => {
  try {
    const { name, specialization } = req.query

    let filter = {}

    if (name) {
      filter.name = { $regex: name, $options: 'i' }
    }

    if (specialization) {
      filter.specialization = specialization
    }

    const doctors = await Doctor.find(filter)

    res.status(200).json(doctors)
  } catch (err) {
    res.status(500).json(err)
  }
}

// update doctor
exports.updateDoctor = async (req, res) => {
  const { id } = req.params

  try {

      const updatedDoctor = await Doctor.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
      )

      res.status(200).json(updatedDoctor)

  } catch (err) {
      res.status(401).json(err.message)
  }

}