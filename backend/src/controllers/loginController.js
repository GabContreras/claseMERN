import clientsModel from "../models/Clients.js";
import employeesModel from "../models/Employees.js";
import bcrypt from "bcryptjs";
import jsonWebToken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) => {

    const { email, password } = req.body;

    try {
        let userFound; //Para guardar el usuario encontrado
        let userType; //Para guardar el tipo usuario encontrado

        //1. ADMIN
        if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
            userFound = { _id: "admin" };
            userType = "admin";
        } else {
            userFound = await employeesModel.findOne({ email });
            userType = "employee";
            if (!userFound) {
                userFound = await clientsModel.findOne({ email });
                userType = "client";
            }
        }
        if (!userFound) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        //2. Verificación de contraseña
        //Solo si no es admin
        if (userType !== "admin") {
            const isMatch = await bcrypt.compare(password, userFound.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        }

        //TOken
        const token = jsonWebToken.sign(
            { id: userFound._id, userType },
            config.JWT.secret,
            { expiresIn: config.JWT.expiresIn }

        )
        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "None", // o "Lax" si es mismo dominio
            secure: true,     // solo si usas HTTPS
        });

        // Prepara el objeto usuario para enviar solo lo necesario
        const userResponse = {
            id: userFound._id,
            email: userFound.email || userFound.correo, // usa el campo correcto según tu modelo
            userType
        };

        res.json({
            message: "Login exitoso",
            token, // <-- ENVÍA EL TOKEN AQUÍ
            user: userResponse
        });
    

    } catch (error) {
    res.json({ message: "error: " + error.message });
}

}

export default loginController;