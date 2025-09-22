//1- configuramos la libreria

import rateLimit from "express-rate-limit";

//2- configuramos los parametros
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 6, // Limitar cada IP a 100 solicitudes por `window` (aquí, por 15 minutos)
    message: {
        status: 429,
        error: "too many requests, please try again later."
    }
});

export default limiter;