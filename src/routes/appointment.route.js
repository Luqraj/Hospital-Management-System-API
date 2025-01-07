import express from "express"
import {
    createAppointment,
    getAllAppointments,
    getDoctorAppointments,
    getPatientAppointments,
    cancelAnAppointment,
    rescheduleAnAppointment,
    deleteAppointment,
} from "../controllers/appointment.controllers.js"
import { authenticate, isAdmin } from "../middleware/auth.middleware.js"

const appointmentRouter = express.Router();
const validate = [ authenticate, isAdmin ]

appointmentRouter
  .post("/create", authenticate, createAppointment)
  .get("/all", authenticate, getAllAppointments)
  .get("/doctor/:doctorId", authenticate, getDoctorAppointments)
  .get("/patient/:patientId", authenticate, getPatientAppointments)
  .patch("/cancel/:appointmentId", validate, cancelAnAppointment)
  .patch("/reschedule/:appointmentId", validate, rescheduleAnAppointment)
  .delete("/:appointmentId", validate, deleteAppointment)

export default appointmentRouter;