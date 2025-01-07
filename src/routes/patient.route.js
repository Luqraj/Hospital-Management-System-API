import express from "express"
import {
    createPatient,
    getAllPatients,
    getAPatient,
    deletePatient,
    updatePatient
} from "../controllers/patient.controllers.js"
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const patientRouter = express.Router();
const validate = [ authenticate, isAdmin ]

patientRouter
  .post("/create", authenticate, createPatient)
  .get("/all", authenticate, getAllPatients)
  .route("/:id").get(authenticate, getAPatient).patch( validate, updatePatient).delete( validate, deletePatient)

export default patientRouter;