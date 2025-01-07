import express from "express"
import {
    createDoctor,
    getAllDoctors,
    getADoctor,
    updateDoctor,
    deleteDoctor,
} from "../controllers/doctor.controllers.js"
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const doctorRouter = express.Router();
const validate = [ authenticate, isAdmin ]

doctorRouter
  .post("/create", authenticate, createDoctor)
  .get("/all", authenticate, getAllDoctors)
  .route("/:id").get(authenticate, getADoctor).patch( validate, updateDoctor).delete( validate, deleteDoctor)

export default doctorRouter;