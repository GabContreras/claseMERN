//funciones de la app, tipo login, crud, registros, etc


//inserto todo lo de la libreria express
import express from "express";
import productsRoutes from "./src/routes/products.js";
// Creo una constante que es igual a la libreria que acabo de importar, y la ejecuto 

const app = express();

//Middleware para que acepte datos JSON
app.use(express.json());

app.use("/api/products/", productsRoutes);

//Exporto esta constante para usar express en todos lados
export default app;
