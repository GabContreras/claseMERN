import { useState, useRef } from 'react';

export function useBlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlogId, setCurrentBlogId] = useState(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    // GET
    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://clasemern.onrender.com/api/blog');
            if (!response.ok) throw new Error(`Error al cargar los blogs: ${response.status} ${response.statusText}`);
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            setError('No se pudieron cargar los blogs. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST - Crear blog
    const createBlog = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);

        return await fetch('https://clasemern.onrender.com/api/blog', {
            method: 'POST',
            body: formData,
        });
    };

    // PUT - Actualizar blog
    const updateBlog = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);

        return await fetch(`https://clasemern.onrender.com/api/blog/${currentBlogId}`, {
            method: 'PUT',
            body: formData,
        });
    };

    // POST/PUT - Crear o actualizar blog
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError('El título y el contenido son obligatorios');
            return;
        }
        try {
            setIsLoading(true);
            setError('');
            let response;
            if (isEditing && currentBlogId) {
                response = await updateBlog();
            } else {
                response = await createBlog();
            }
            if (!response.ok) throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el blog: ${response.status} ${response.statusText}`);

            setSuccess(`Blog ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            fetchBlogs();
            setShowModal(false);
            resetForm();
        } catch (error) {
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el blog`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE
    const handleDeleteBlog = async (blogId, event) => {
        if (event) event.stopPropagation();
        if (!blogId) return;
        if (!window.confirm('¿Estás seguro de que deseas eliminar este blog?')) return;
        try {
            setIsLoading(true);
            const response = await fetch(`https://clasemern.onrender.com/api/blog/${blogId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Error al eliminar el blog: ${response.status} ${response.statusText}`);
            setSuccess('Blog eliminado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            fetchBlogs();
        } catch (error) {
            setError(error.message || 'Error al eliminar el blog');
        } finally {
            setIsLoading(false);
        }
    };

    // Helpers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSelectImage = () => fileInputRef.current.click();

    const resetForm = () => {
        setTitle('');
        setContent('');
        setImage(null);
        setPreviewUrl('');
        setIsEditing(false);
        setCurrentBlogId(null);
    };

    const handleEditBlog = (blog) => {
        setTitle(blog.title);
        setContent(blog.content);
        setPreviewUrl(blog.image || '');
        setIsEditing(true);
        setCurrentBlogId(blog._id);
        setShowModal(true);
    };

    return {
        blogs, setBlogs,
        showModal, setShowModal,
        isLoading, setIsLoading,
        error, setError,
        success, setSuccess,
        isEditing, setIsEditing,
        currentBlogId, setCurrentBlogId,
        title, setTitle,
        content, setContent,
        image, setImage,
        previewUrl, setPreviewUrl,
        fileInputRef,
        fetchBlogs,
        createBlog,
        updateBlog,
        handleSubmit,
        handleDeleteBlog,
        handleImageChange,
        handleSelectImage,
        resetForm,
        handleEditBlog,
    };
}