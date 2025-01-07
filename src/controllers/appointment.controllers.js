import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const createAppointment = async(req, res) => {
    try {
        const {doctorId, patientId, date, time, status} = req.body;
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId,
                patientId,
                date,
                time,
                status,
            },
        });
        if (existingAppointment) {
            return res.status(409).json({ message: "Conflict: Appointment already exists based on the specified parameters..."})
        }
        const appointment = await prisma.appointment.create({
            data: {
                doctorId,
                patientId,
                date,
                time,
                status,
            }
        });
        res.status(201).json({ message: "Appointment created successfully...", appointment})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating appointment..."})
    }
};

export const getAllAppointments = async(req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                doctor: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
                patient: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointment details yet!"})
        }
        res.status(200).json({ message: "Appointments fetched successfully...", appointments})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching appointments!"})
    }
};

export const getDoctorAppointments = async(req, res) => {
    try {
        const { doctorId } = req.params
        const confirmId = await prisma.doctor.findUnique({
            where: {
                id: doctorId,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Doctor with the specified id: ${doctorId} not found!`})
        }
        const doctorAppointments = await prisma.appointment.findMany({
            where: {
                doctorId,
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        res.status(200).json({ message: "Appointments retrieved!", doctorAppointments})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching appointment details"})
    }
};

export const getPatientAppointments = async(req, res) => {
    try {
        const { patientId }= req.params;
        const confirmId = await prisma.patient.findUnique({
            where: {
                id: patientId,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Patient with the specified id: ${patientId} not found!`})
        }
        const patientAppointments = await prisma.appointment.findMany({
            where: {
                patientId,
            },
            include: {
                doctor: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
        })
        res.status(200).json({ message: "Appointments retrieved!", patientAppointments})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Error fetching appointment!"})
    }
};

export const cancelAnAppointment = async(req, res) => {
    try {
        const {appointmentId} = req.params
        const { status } = req.body;
        const confirmId = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Appointment with the specified id: ${appointmentId} not found!`})
        }
        const cancelAppointment = await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                status,
            }
        })
        res.status(200).json({ message: "Appointment cancelled successfully!", cancelAppointment})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error cancelling appointment!"})
    }
};

export const rescheduleAnAppointment = async(req, res) => {
    try {
        const { appointmentId } = req.params;
        const { date, time } = req.body;
        const confirmId = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Appointment with the specified id: ${appointmentId} not found!`})
        }
        const rescheduleAppointment = await prisma.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                date,
                time,
            },
        });
        res.status(200).json({ message: "Appointment rescheduled successfully!", rescheduleAppointment})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error rescheduling appointment!"}) 
    }
};

export const deleteAppointment = async(req, res) => {
    try {
        const {appointmentId} = req.params;
        const confirmId = await prisma.appointment.findUnique({
            where: {
                id :appointmentId,
            },
        });
        if(!confirmId) {
            return res.status(404).json({ message: `Appointment with the specified id: ${appointmentId} not found!`})
        }
        const deleteAnAppointment = await prisma.appointment.delete({
            where: {
                id: appointmentId,
            },
        });
        res.status(200).json({ message: `Appointment with id: ${appointmentId} deleted successfully`})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting appointment!"})
    }
}