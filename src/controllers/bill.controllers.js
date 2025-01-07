import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBill = async(req, res) => {
    try {
        const { patientId, amount, status, prescriptionId} = req.body;
        const existingBill = await prisma .bill.findFirst({
            where: {
                prescriptionId,
            },
        });
        if (existingBill) {
            return res.status(409).json({ message: `Conflict: Prescription with id: ${prescriptionId} already billed!`})
        }
        const createABill = await prisma.bill.create({
            data: {
                patientId,
                amount,
                status,
                prescriptionId,
            },
        });
        res.status(201).json({ message: "Bill created successfully...", createABill})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Bill!"})
        
    }
}

export const getAllBills = async(req, res) => {
    try {
        const bills = await prisma.bill.findMany({
            include: {
                prescriptions: {
                    select: {
                        doctorId: true,
                        medication: true,
                        dosage: true,
                        date: true,
                    },
                },
            },
        });
        if (bills.length === 0) {
            return res.status(404).json({ message: "No bills found, create one!"})
        };
        res.status(200).json({ message: "Bills fetched successfully...", bills})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Error fetching bills!"})  
    }
}

export const getAPatientBill = async(req, res) => {
    try {
        const {patientId}= req.params;
        const patientBill = await prisma.bill.findFirst({
            where: {
                prescriptions: {
                    patient: {
                        id: patientId,
                    },
                },
            },
            include: {
                prescriptions: {
                    select: {
                        doctorId: true,
                        medication: true,
                        dosage: true,
                        date: true,
                    },
                },
            },
        });
        if (!patientBill) {
            return res.status(404).json({ message:  `Invalid patient id: ${patientId} , please check!`})
        }
        res.status(200).json({ message: " Patient bill retrieved successfully...", patientBill})
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: " Error fetching patient's bill!"})
        
    }
}

export const getBillByPrescription = async(req, res) => {
    try {
        const {prescriptionId} = req.params;
        const bill = await prisma.bill.findFirst({
            where: {
                prescriptionId: prescriptionId,
            },
            include: {
                prescriptions: {
                    select: {
                        doctorId: true,
                        medication: true,
                        dosage: true,
                        date: true,
                    },
                },
            },
        });
        if(!bill) {
            return res.status(404).json({ message: `Invalid prescription id: ${prescriptionId} , please check!`})
        }
        res.status(200).json({ message: "Bill fetched successfully...", bill})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Error fetching bill!"})
        
    }
}

export const updateBill= async(req, res) => {
    try {
        const {billId} = req.params;
        const {amount, status, currency } = req.body;
        const confirmId = await prisma.bill.findUnique({
            where: {
                id: billId,
            },
        })
        if (!confirmId) {
            return res.status(404).json({ message: `Invalid bill id: ${billId}, please check!`})
        }
        const updateABill = await prisma.bill.update({
            where: {
                id: billId,
            },
            data: {
                amount,
                status,
                currency,
            },
        });
        res.status(200).json({ message: "Bill updated successfully!", updateABill})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Error updating bill status!"})
    }
}

export const deleteBill = async(req, res) => {
    try {
        const {billId} = req.params;
        const confirmId = await prisma.bill.findUnique({
            where: {
                id: billId,
            },
        })
        if (!confirmId) {
            return res.status(404).json({ message: `Invalid bill id: ${billId}, please check!`})
        }
        const deleteABill = await prisma.bill.delete({
            where: {
                id: billId,
            },
        });
        res.status(200).json({ message: "Bill deleted successfully..."})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting bill!"}) 
    }
}