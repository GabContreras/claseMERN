// BlogComponents.jsx
import { useEffect } from 'react';
import './Blog.css';
import { useBlogManager } from '../../components/Hooks/BLogHooks/useBlog';

// Componente de tarjeta para mostrar un blog
const BlogCard = ({ blog, onDelete, onEdit }) => {
  // Función para truncar texto largo
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Asegurarse de que el ID es válido y está disponible para depuración
  const handleDelete = (e) => {
    e.stopPropagation(); // Evitar que el clic en eliminar también abra el modal de edición
    console.log('ID del blog a eliminar:', blog._id);
    onDelete(e);
  };

  return (
    <div className="blog-card" onClick={onEdit}>
      {blog.image && (
        <div className="blog-card-image">
          <img src={blog.image} alt={blog.title} />
        </div>
      )}
      <div className="blog-card-content">
        <h2>{blog.title}</h2>
        <p>{truncateText(blog.content, 150)}</p>
        <div className="blog-card-footer">
          <span className="blog-date">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          <button 
            className="delete-button"
            onClick={handleDelete}
            title="Eliminar este artículo"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de modal para crear/editar blog
const BlogModal = ({
  title,
  setTitle,
  content,
  setContent,
  previewUrl,
  handleImageChange,
  handleSelectImage,
  fileInputRef,
  handleSubmit,
  isLoading,
  isEditing,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título del artículo"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Contenido</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido del artículo"
              rows="6"
              disabled={isLoading}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Imagen</label>
            <div className="image-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg"
                style={{ display: 'none' }}
              />
              
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Vista previa" /> 
                  <button
                    type="button"
                    className="change-image-button"
                    onClick={handleSelectImage}
                  >
                    Cambiar imagen
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="select-image-button"
                  onClick={handleSelectImage}
                >
                  Seleccionar imagen
                </button>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente principal que contiene tanto las cards como el modal
const BlogManager = () => {
  const blog = useBlogManager();

  useEffect(() => {
    blog.fetchBlogs();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="blog-manager">
      {/* Header con botón para añadir nuevo blog */}
      <div className="blog-header">
        <h1>Blog Z Gas</h1>
        <button 
          className="add-blog-button" 
          onClick={() => {
            blog.resetForm();
            blog.setShowModal(true);
          }}
        >
          Nuevo Artículo
        </button>
      </div>
      
      {/* Mensajes de error o éxito */}
      {blog.error && <div className="error-message">{blog.error}</div>}
      {blog.success && <div className="success-message">{blog.success}</div>}
      
      {/* Contenedor de tarjetas de blogs */}
      <div className="blog-cards-container">
        {blog.isLoading && !blog.blogs.length ? (
          <div className="loading">Cargando blogs...</div>
        ) : blog.blogs.length === 0 ? (
          <div className="no-blogs">No hay blogs disponibles</div>
        ) : (
          blog.blogs.map((blogItem) => (
            <BlogCard 
              key={blogItem._id} 
              blog={blogItem} 
              onDelete={(e) => blog.handleDeleteBlog(blogItem._id, e)}
              onEdit={() => blog.handleEditBlog(blogItem)}
            />
          ))
        )}
      </div>
      
      {/* Modal para crear/editar blog */}
      {blog.showModal && (
        <BlogModal
          title={blog.title}
          setTitle={blog.setTitle}
          content={blog.content}
          setContent={blog.setContent}
          previewUrl={blog.previewUrl}
          handleImageChange={blog.handleImageChange}
          handleSelectImage={blog.handleSelectImage}
          fileInputRef={blog.fileInputRef}
          handleSubmit={blog.handleSubmit}
          isLoading={blog.isLoading}
          isEditing={blog.isEditing}
          onClose={() => {
            blog.setShowModal(false);
            blog.resetForm();
          }}
        />
      )}
    </div>
  );
};

export default BlogManager;