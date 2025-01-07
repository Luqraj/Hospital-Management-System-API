import express from "express"
import {
    createPrescription,
    getAllPrescriptions,
    getDoctorPrescriptions,
    getPatientPrescriptions,
    reviewAPrescription,
    deletePrescription
} from "../controllers/prescription.controllers.js"
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const prescriptionRouter = express.Router();
const validate = [ authenticate, isAdmin ]

prescriptionRouter
  .post("/create", authenticate, createPrescription)
  .get("/all", authenticate, getAllPrescriptions)
  .get("/patient/:patientId", authenticate, getPatientPrescriptions)
  .get("/doctor/:doctorId", authenticate, getDoctorPrescriptions)
  .route("/:prescriptionId").patch( validate, reviewAPrescription).delete( validate, deletePrescription)

export default prescriptionRouter;