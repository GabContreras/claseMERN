const blogController = {};

import blogModel from '../models/Blog.js';
import { v2 as cloudinary } from 'cloudinary';

import { config } from '../config.js';

//Configurar cloudinary 
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});


blogController.getAllBlogs = async (req, res) => {
    const blogs = await blogModel.find();
    res.json(blogs);
}

blogController.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        let imageUrl = "";

        if (req.file) {
            //Subir el archivo a cloudinary
            const result = await cloudinary.uploader.upload(req.file.path,
                {
                    folder: "public",
                    allowed_formats: ["jpg", "png", "jpeg"]
                }
            )
            imageUrl = result.secure_url;
        }
        const newBlog = new blogModel({
            title,
            content,
            image: imageUrl
        });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully' });
    } catch (error) {
        console.error("error" + error);
        res.status(500).json({ message: 'Error creating blog' });
    }
}
export default blogController;