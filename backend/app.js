//funciones de la app, tipo login, crud, registros, etc


//inserto todo lo de la libreria express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRoutes from "./src/routes/products.js";
import clientsRoutes from "./src/routes/clients.js";
import employeesRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import reviewsRoutes from "./src/routes/reviews.js";
import evaluationsRoutes from "./src/routes/evaluations.js";
import registerEmployeesRoutes from "./src/routes/registerEmployee.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import registerClient from "./src/routes/registerClients.js"
import blogRoutes from "./src/routes/blog.js";
import faqsRoutes from "./src/routes/faq.js";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";
// Creo una constante que es igual a la libreria que acabo de importar, y la ejecuto 


import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";


const app = express();

//Middleware para que acepte datos JSON
app.use(express.json());
//Que acepte cookies en postman
app.use(cookieParser());


//Traemos el archivo json
const swaggerDocument = JSON.parse(
    fs.readFileSync(
        path.resolve("./documentacion.json"),
        "utf-8"
    )
);
//MiddleWares 
app.use(
    cors({
        origin: "https://clase-mern.vercel.app",
        //Permitir envío de cookies y credenciales
        credentials: true,
    })
)

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/products/", validateAuthToken(["employee", "admin"]), productsRoutes);
app.use("/api/clients/", clientsRoutes);
app.use("/api/employees/", employeesRoutes);
app.use("/api/branches/", validateAuthToken(["employee", "admin"]), branchesRoutes);
app.use("/api/reviews/", validateAuthToken(["employee"]), reviewsRoutes);
app.use("/api/passwordRecovery/", passwordRecoveryRoutes);
app.use("/api/evaluations/", evaluationsRoutes);
app.use("/api/registerEmployees/", validateAuthToken(["admin"]), registerEmployeesRoutes);
app.use("/api/login/", loginRoutes);
app.use("/api/logout/", logoutRoutes);
app.use("/api/registerClient/", registerClient)
app.use("/api/blog/", blogRoutes)
app.use("/api/faqs/", faqsRoutes);

//Exporto esta constante para usar express en todos lados
export default app;
