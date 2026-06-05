const express = require('express')
const userController = require('../Controllers/userController')
const apController = require('../Controllers/apController')
const doctorController = require('../Controllers/doctorController')
const notificationController = require('../Controllers/notificationController')
const jwtMiddleware = require('../Middlewares/jwtMiddleware')

const users = require('../Models/userModel')
const Appointment = require('../Models/apModel')
const Doctor = require('../Models/doctorModel')

const router = new express.Router()

// register
router.post('/register', userController.registerController)
// login
router.post('/login', userController.loginController)
// addAppointment
router.post('/add-ap', jwtMiddleware, apController.addAppointmentController)
// getAppointment
router.get('/get-ap', jwtMiddleware, apController.getAppointmentController)
// deleteAppointment

router.put('/cancel-ap/:id', jwtMiddleware, apController.deleteAppointmentController)
//getDoctors
router.get('/get-doctors', doctorController.getDoctorsController)
// getNotification
router.get('/notifications', jwtMiddleware, notificationController.getNotifications)
// notificationMarkAsRead
router.put('/notifications/read/:id', jwtMiddleware, notificationController.markAsRead)

// ⭐ ADMIN ROUTES

// get all appointments
router.get('/admin/get-all-ap', async (req, res) => {
  try {
    const appointments = await Appointment.find()
    res.status(200).json(appointments)
  } catch (err) {
    res.status(401).json(err)
  }
})

// get stats
router.get('/admin/stats', async (req, res) => {
  try {
    const userCount = await users.countDocuments()
    const doctorCount = await Doctor.countDocuments()
    const apCount = await Appointment.countDocuments()

    res.status(200).json({
      users: userCount,
      doctors: doctorCount,
      appointments: apCount
    })
  } catch (err) {
    res.status(401).json(err)
  }
})

// add doctor 
router.post('/admin/add-doctor', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body)
    await newDoctor.save()
    res.status(200).json('Doctor added successfully')
  } catch (err) {
    res.status(401).json(err)
  }
})

//update doctor
router.put('/admin/update-doctor/:id', jwtMiddleware, (req, res, next) => {

  if (req.payload.role !== 'admin') {
    return res.status(403).json('Access denied')

  }
  console.log(req.payload)
  next()

}, doctorController.updateDoctor)

// remove doctor
router.delete('/admin/delete-doctor/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id)
    res.status(200).json('Doctor deleted')
  } catch (err) {
    res.status(401).json(err)
  }
})

router.delete('/admin/delete-ap/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id)
    res.status(200).json('Appointment deleted')
  } catch (err) {
    res.status(401).json(err)
  }
})

router.put('/admin/update-status/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    })
    res.status(200).json('Status updated')
  } catch (err) {
    res.status(401).json(err)
  }
})
module.exports = router