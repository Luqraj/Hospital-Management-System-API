import express from 'express'
import { connectToDatabase } from  './src/config/db.js'
import authRouter from './src/routes/auth.route.js';
import patientRouter from './src/routes/patient.route.js';
import doctorRouter from './src/routes/doctor.route.js';
import appointmentRouter from './src/routes/appointment.route.js';
import prescriptionRouter from './src/routes/prescription.route.js';
import billRouter from './src/routes/bill.route.js';

const port = process.env.PORT || 3000;

const app = express();
connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.use("/api/v1/hospital/auth", authRouter);
app.use("/api/v1/hospital/patients", patientRouter);
app.use("/api/v1/hospital/doctors", doctorRouter)
app.use("/api/v1/hospital/appointments", appointmentRouter)
app.use("/api/v1/hospital/prescriptions", prescriptionRouter)
app.use("/api/v1/hospital/bills", billRouter)

app.listen(port, ()=> {
    console.log(`Server listening on port: ${port}`);
});