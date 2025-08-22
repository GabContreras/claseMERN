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
        //Primero verificamos si el usuario está bloqueado 
        if (userType !== "admin") {

            //return res.json({val: (userFound.lockTime > Date.now()), diferencia: (Date.parse("2025-08-12T14:09:53.176+00:00") - Date.now()) / 60000});
            if (Date.parse(userFound.lockTime) > Date.now()) {
                const minutosRestantes = Math.ceil((userFound.lockTime - Date.now()) / 60000);
                return res.status(403).json({ message: "Cuenta bloqueada, intenta de nuevo en:" + minutosRestantes + " minutos." });
            }

            const isMatch = await bcrypt.compare(password, userFound.password);
            if (!isMatch) {

                //Si se equivoca de contraseña, suma 1 a los intentos de login
                userFound.loginAttempts = userFound.loginAttempts + 1; // Incrementa el contador de intentos

                //Si sobrepasa los intentos permitidos, bloquea la cuenta
                if (userFound.loginAttempts >= 5) {
                    userFound.lockTime = Date.now() + 15 * 60000; // Bloquea la cuenta por un tiempo
                    userFound.loginAttempts = 0;
                    await userFound.save();
                    return res.status(403).json({ message: "Cuenta bloqueada por 15 minutos." });

                }
                await userFound.save(); // Guarda los cambios en la base de datos
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
            userFound.loginAttempts = 0; // Reinicia los intentos de login si la contraseña es correcta
            userFound.lockTime = null; // Reinicia el tiempo de bloqueo si la contraseña es correcta
            await userFound.save(); // Guarda los cambios en la base de datos 
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