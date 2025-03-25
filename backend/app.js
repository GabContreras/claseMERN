//funciones de la app, tipo login, crud, registros, etc


//inserto todo lo de la libreria express
import express from "express";
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

// Creo una constante que es igual a la libreria que acabo de importar, y la ejecuto 

const app = express();

//Middleware para que acepte datos JSON
app.use(express.json());
//Que acepte cookies en postman
app.use(cookieParser());

app.use("/api/products/", productsRoutes);
app.use("/api/clients/", clientsRoutes);
app.use("/api/employees/", employeesRoutes);
app.use("/api/branches/", branchesRoutes);
app.use("/api/reviews/", reviewsRoutes);
app.use("/api/evaluations/", evaluationsRoutes);
app.use("/api/registerEmployees/",registerEmployeesRoutes);
app.use("/api/login/", loginRoutes);
app.use("/api/logout/", logoutRoutes);

//Exporto esta constante para usar express en todos lados
export default app;
