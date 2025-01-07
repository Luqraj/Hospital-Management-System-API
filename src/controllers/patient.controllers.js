import  { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const createPatient = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const existingName = await prisma.patient.findUnique({
            where: {
                name,
            }
        })
        if (existingName) {
            return res.status(400).json({message: "Name already exists, please specify another name!"})
        }
        const newPatient = await prisma.patient.create({
            data:{
                name,
                email,
                phone,
                address,
            }
        })
        res.status(201).json({message: "Patient details created successfully...", newPatient})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating patient details."})
        
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const {name} = req.query
        const patients = await prisma.patient.findMany({
            where: name? {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            } : {},
        })
        if (name  ===  0) {
            return res.status(404).json({message: "Patient(s) not found!"})
        } else if (patients.length === 0){
            return res.status(404).json({message: "Patient(s) not found!"})
        }
        else{
            res.status(200).json({message: "Patients successfully fetched...", patients})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching patients..."})
    }
};

export const getAPatient = async(req, res) => {
    try {
        const {id} = req.params;
        const patient = await prisma.patient.findUnique({
            where: {
                id,
            }
        });
        if (!patient) {
            return res.status(404).json({message: `Patient with the specified id: ${id} not found!`})
        }
        res.status(200).json({message: `Patient details with id: ${id} retrieved successfully...`, patient})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: `Failed to fetch patient details`})
    }
}

export const updatePatient = async(req, res) => {
    try {
        const {id} = req.params;
        const confirmId = await prisma.patient.findUnique({
            where: {
                id,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Patient with the specified id: ${id} not found!`})
        }
        const { name, email, phone, address } = req.body
        const UpdatedPatient = await prisma.patient.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                phone,
                address,
            },
        });
        res.status(200).json({message: `Patient details with id: ${id} successfully updated...`, UpdatedPatient})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: `Failed to update patient details`})
        
    }
};

export const deletePatient = async(req, res) => {
try {
    const {id}= req.params;

    const confirmId = await prisma.patient.findUnique({
        where: {
            id,
        }
    });
    if (!confirmId) {
        return res.status(404).json({message: `Patient with the specified id: ${id} not found!`})
    }
    const patient = await prisma.patient.delete({
        where: {
            id,
        }
    });
    res.status(200). json({message: `Patient details with id: ${id} successfully deleted...`})
} catch (error) {
    console.error(error);
    res.status(500).json({message: "Failed to delete patient details!"})
}};