import  { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const createDoctor = async (req, res) => {
    try {
        const { name, phone, specialty,  address } = req.body;
        const existingName = await prisma.doctor.findUnique({
            where: {
                name,
            }
        })
        if (existingName) {
            return res.status(400).json({message: "Name already exists, please specify another name!"})
        }
        const newDoctor = await prisma.doctor.create({
            data:{
                name,
                phone,
                specialty,
                address,
            }
        })
        res.status(201).json({message: "Doctor details created successfully...", newDoctor})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating doctor details."})
        
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const {name} = req.query
        const doctors = await prisma.doctor.findMany({
            where: name? {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            } : {},
        })
        if (name  ===  0) {
            return res.status(404).json({message: "Doctor(s) not found!"})
        } else if (doctors.length === 0){
            return res.status(404).json({message: "Doctor(s) not found!"})
        }
        else{
            res.status(200).json({message: "Doctor(s) successfully fetched...", doctors})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching doctors..."})
    }
};

export const getADoctor = async(req, res) => {
    try {
        const {id} = req.params;
        const doctor = await prisma.doctor.findUnique({
            where: {
                id,
            }
        });
        if (!doctor) {
            return res.status(404).json({message: `Doctor with the specified id: ${id} not found!`})
        }
        res.status(200).json({message: `Doctor details with id: ${id} retrieved successfully...`, doctor})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: `Failed to fetch doctor details`})
    }
}

export const updateDoctor = async(req, res) => {
    try {
        const {id} = req.params;
        const confirmId = await prisma.doctor.findUnique({
            where: {
                id,
            }
        });
        if (!confirmId) {
            return res.status(404).json({message: `Doctor with the specified id: ${id} not found!`})
        }
        const { name, phone, specialty, address } = req.body
        const UpdatedDoctor = await prisma.doctor.update({
            where: {
                id,
            },
            data: {
                name,
                phone,
                specialty,
                address,
            },
        });
        res.status(200).json({message: `Doctor details with id: ${id} successfully updated...`, UpdatedDoctor})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: `Failed to update doctor details`})
        
    }
};

export const deleteDoctor = async(req, res) => {
try {
    const {id}= req.params;

    const confirmId = await prisma.doctor.findUnique({
        where: {
            id,
        }
    });
    if (!confirmId) {
        return res.status(404).json({message: `Doctor with the specified id: ${id} not found!`})
    }
    const doctor = await prisma.doctor.delete({
        where: {
            id,
        }
    });
    res.status(200). json({message: `Doctor details with id: ${id} successfully deleted...`})
} catch (error) {
    console.error(error);
    res.status(500).json({message: "Failed to delete doctor details!"})
}};