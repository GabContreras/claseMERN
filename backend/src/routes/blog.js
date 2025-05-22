import express from 'express';
import multer from 'multer';
import blogController from '../controllers/blogController.js';
const router = express.Router();

// Configurar carpeta local para guardar imágenes
const upload = multer({
    dest: 'public/'
});

// Obtener todos los blogs y crear uno nuevo
router.route('/')
    .get(blogController.getAllBlogs)
    .post(upload.single("image"), blogController.createBlog);

router.route('/:id')
    .put(upload.single("image"), blogController.updateBlog)
    .delete(blogController.deleteBlog);

export default router;