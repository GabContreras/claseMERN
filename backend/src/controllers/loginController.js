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
        if (email === config.emailAdmin.email && password === config.passwordAdmin.password) {
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
            console.log("Ajaber cual será el usuario");
            return res.status(404).json({ message: "No se encontró el usuario we" });
        }
        //2. Verificación de contraseña
        //Solo si no es admin
        if (userType !== "admin") {
            const isMatch = await bcrypt.compare(password, userFound.password);
            if (!isMatch) {
                return res.json({ message: "Contraseña incorrecta" });
            }
        }

        //TOken
        jsonWebToken.sign(
            //1- qué voy a guardar
            { id: userFound._id, userType },
            //2- secreto
            config.JWT.secret,
            //3- cuándo expira
            { expiresIn: config.JWT.expiresIn },
            //4- función flecha
            (error, token) => {
                if (error) console.log(error);

                res.cookie("authToken", token);
                res.json({ message: "ji agarró" });
            }
        );

    } catch (error) {
        res.json({ message: "error: " + error.message });
    }

}

export default loginController;