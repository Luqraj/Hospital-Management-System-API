import express from "express"
import {
    createBill,
    getAllBills,
    getAPatientBill,
    getBillByPrescription,
    updateBill,
    deleteBill
} from "../controllers/bill.controllers.js"
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const billRouter = express.Router();
const validate = [ authenticate, isAdmin ]

billRouter
  .post("/create", authenticate, createBill)
  .get("/all", authenticate, getAllBills)
  .get("/patient/:patientId", authenticate, getAPatientBill)
  .get("/prescription/:prescriptionId", authenticate, getBillByPrescription)
  .route("/:billId").patch( validate, updateBill).delete(validate, deleteBill)

export default billRouter;