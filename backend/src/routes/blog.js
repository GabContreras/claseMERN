import express from 'express';
import multer from 'multer';
import blogController from '../controllers/blogController.js';
const router = express.Router();

//Configurar carpeta local para guardar imagenes
const upload = multer({
    dest: 'public/'
});

router.route('/')
.get(blogController.getAllBlogs)
.post(upload.single("image"), blogController.createBlog);

export default router;