import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const createPrescription = async(req, res) => {
    try {
        const { doctorId, patientId, medication, dosage, date } = req.body;
        const existingPrescription = await prisma.prescription.findFirst({
            where: {
                doctorId,
                patientId,
                medication,
                dosage,
                date,
            },
        });
        if (existingPrescription) {
            return res.status(409).json({ message: "Conflict: Prescription already issued!"})
        }
        const prescription = await prisma.prescription.create({
            data: {
                doctorId,
                patientId,
                medication,
                dosage,
                date,
            },
        });
        res.status(201).json({ message: "Prescription issued successfully...", prescription})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error issuing prescription..."})
    }
};

export const getAllPrescriptions = async(req, res) => {
    try {
        const prescription = await prisma.prescription.findMany({
            include: {
                doctor: {
                    select: {
                        name: true,
                        phone: true,
                        specialty: true,
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
        if (prescription.length === 0) {
            return res.status(404).json({ message: "No prescription details yet!"})
        }
        res.status(200).json({ message: "Prescription fetched successfully...", prescription})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching prescription!"})
    }
};

export const getDoctorPrescriptions = async(req, res) => {
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
        const doctorPrescriptions = await prisma.prescription.findMany({
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
        if (doctorPrescriptions.length === 0) {
            return res.status(404).json({ message: "No prescription details yet!"})
        }
        res.status(200).json({ message: "Prescriptions retrieved!", doctorPrescriptions})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching prescription details!"})
    }
};

export const getPatientPrescriptions = async(req, res) => {
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
        const patientPrescriptions = await prisma.prescription.findMany({
            where: {
                patientId,
            },
            include: {
                doctor: {
                    select: {
                        name: true,
                        phone: true,
                        specialty: true,
                    },
                },
            },
        });
        if (patientPrescriptions.length === 0) {
            return res.status(404).json({ message: "No prescription details yet!"})
        }
        res.status(200).json({ message: "Prescription retrieved!", patientPrescriptions})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Error fetching prescriptions!"})
    }
};

export const reviewAPrescription = async(req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { medication, dosage, date } = req.body;
        const confirmId = await prisma.prescription.findUnique({
            where: {
                id: prescriptionId,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Prescription with the specified id: ${prescriptionId} not found!`})
        }
        const reviewPrescription = await prisma.prescription.update({
            where: {
                id: prescriptionId,
            },
            data: {
                medication,
                dosage,
                date,
            },
        });
        res.status(200).json({ message: "Prescription reviewed successfully!", reviewPrescription})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error reviewing prescription!"}) 
    }
};

export const deletePrescription = async(req, res) => {
    try {
        const { prescriptionId } = req.params;
        const confirmId = await prisma.prescription.findUnique({
            where: {
                id :prescriptionId,
            },
        });
        if(!confirmId) {
            return res.status(404).json({ message: `Prescription with the specified id: ${prescriptionId} not found!`})
        }
        const deleteAPrescription = await prisma.prescription.delete({
            where: {
                id: prescriptionId,
            },
        });
        res.status(200).json({ message: `Prescription with id: ${prescriptionId} deleted successfully`})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting prescription!"})
    }
};