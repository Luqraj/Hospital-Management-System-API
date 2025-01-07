import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const registerUser = async (req, res) =>{
    try {
        const {name, email, password, role}= req.body;
        const existingName = await prisma.user.findUnique({
            where: {name}
        })
        const existingEmail = await prisma.user.findUnique({
            where: {email}
        })
        if (existingName) {
            return res.status(400).json({message: "User already exists!"})
        }
        if (existingEmail) {
            return res.status(400).json({message: "Email already exists!"})
        }
        if(!name || !password || !email) {
            return res.status(422).json({error: "Please fill the required field(s)!"})
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                role,
                password:hash
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        res.status(201).json({message: "Registration successful, please proceed to login...", newUser})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating user"});
        
    }
};

export const loginUser = async (req, res) => {
    try {
        const  {name, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {name}
        })
        if (!user) {
            return res.status(401).json({error: "Invalid name!"})
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword) {
            return res.status(401).json({error: "Invalid password!"})
        };
        const token = jwt.sign(
            {
                id: user._id,
                role:user.role,
            },
            process.env.JWT_KEY ,
            {
                expiresIn: process.env.JWT_LIFETIME,
            }
        )
        res.status(200).json({message: "Login successful...", token})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error logging in user"});
        
    };
};

// export const getAllUsers = async(req, res) => {
//     try {
//         const allRegisteredUsers = await prisma.user.findMany();
//         if(allRegisteredUsers.length ===0){
//             return res.status(404).json({ message: "No users found yet!"})
//         }
//         res.status(200).json({ message: "Users retrieved...", allRegisteredUsers})
//     } catch (error) {
//         console.error(error);
//         res.status(404).json({ error: "Error fetching users..."})
//     }
// }

// export const deleteUsers = async(req, res) => {
//     const deleteUserss = await prisma.user.deleteMany()
//     res.status(200).json({message: "Success!"})
// }